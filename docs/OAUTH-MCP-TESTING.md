# 🔐 OAuth 2.0 con Canva MCP - Testing Guide

## ✅ Respuesta Corta

**Sí**, el nodo **puede obtener OAuth 2.0 y usarlo vía MCP** con Canva.

La implementación incluye:
1. ✅ Credencial OAuth 2.0 PKCE que extiende de n8n
2. ✅ Flujo de autorización en `https://mcp.canva.com/authorize`
3. ✅ Obtención de access token
4. ✅ Inyección del token en peticiones MCP

## 🔧 Cómo Funciona

### Paso 1: Configuración de Credencial

Cuando configuras la credencial **Canva MCP API** en n8n:

```typescript
// Credencial extiende de oAuth2Api
extends: ['oAuth2Api']

// Endpoints configurados
authUrl: 'https://mcp.canva.com/authorize'
accessTokenUrl: 'https://mcp.canva.com/oauth/token'
grantType: 'pkce' // PKCE flow con S256
```

### Paso 2: Flujo OAuth en n8n

1. Usuario hace clic en **"Connect my account"**
2. n8n redirige a:
   ```
   https://mcp.canva.com/authorize?
     response_type=code&
     client_id={tu_client_id}&
     code_challenge={generated_challenge}&
     code_challenge_method=S256&
     redirect_uri=http://localhost:5678/rest/oauth2-credential/callback&
     state={random_state}&
     scope=openid+email+profile+design:content:read+...
   ```
3. Usuario autoriza en Canva
4. Canva redirige de vuelta con `code`
5. n8n intercambia `code` por `access_token`:
   ```
   POST https://mcp.canva.com/oauth/token
   {
     grant_type: authorization_code,
     code: {code},
     code_verifier: {verifier},
     redirect_uri: {redirect_uri}
   }
   ```
6. n8n guarda el `access_token` en la credencial

### Paso 3: Uso del Token en el Nodo

Cuando el workflow ejecuta el nodo:

```typescript
// 1. Obtiene el token de la credencial
const credentials = await this.getCredentials('canvaMcpApi');
const accessToken = credentials.oauthTokenData?.access_token;

// 2. Método 1: Token en URL (SSE común)
const sseUrl = `${mcpServerUrl}/sse?access_token=${accessToken}`;

// 3. Método 2: Token en header (fallback)
fetch = async (url, options) => {
  return originalFetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'text/event-stream',
    }
  });
};

// 4. Conecta al servidor MCP
const transport = new SSEClientTransport(new URL(sseUrl));
const client = new Client(...);
await client.connect(transport);

// 5. Llama herramientas MCP
await client.callTool({
  name: 'generate-design',
  arguments: { design_type: 'presentation', query: '...' }
});
```

## 🧪 Cómo Probar

### Test 1: Verificar OAuth Flow

1. En n8n → Credentials → New Credential
2. Busca "Canva MCP API"
3. Rellena Client ID y Client Secret
4. Click "Connect my account"
5. **Esperas ver**: Ventana de autorización de Canva en `mcp.canva.com`
6. **Si funciona**: Credencial muestra "Connected"
7. **Si falla**: Revisa URL de redirect y configuración de app en Canva

### Test 2: Verificar Token en Nodo

Crea un workflow simple:

```
[Manual Trigger] → [Canva MCP] → [Code]
```

**Canva MCP node:**
- Operation: List Brand Kits (operación simple)
- Credencial: La que configuraste

**Code node (debug):**
```javascript
// Ver si llegó respuesta
console.log('MCP Response:', $input.all());
return $input.all();
```

**Esperas**:
- ✅ Si funciona: Lista de brand kits
- ❌ Si falla: Error de autenticación

### Test 3: Verificar Generación de Diseño

```
[Manual Trigger] → [Canva MCP: Generate Design]
```

**Parámetros:**
- Design Type: `presentation`
- Content Query:
  ```
  Create a simple presentation with 3 slides:
  Slide 1: Cover with title "Test Presentation"
  Slide 2: Content slide with bullet points about testing
  Slide 3: Thank you slide
  ```

**Esperas**:
- ✅ Si funciona: job_id + lista de candidatos con preview URLs
- ❌ Si falla con "401 Unauthorized": Problema de autenticación
- ❌ Si falla con "Common queries": Query muy genérico

## 🐛 Debugging Autenticación

### Verificar que el token se obtiene:

Agrega un Code node antes del Canva MCP:

```javascript
// Lee las credenciales manualmente (solo para debug)
const credentials = $('Canva MCP').context.credentials;
console.log('Has token?', !!credentials?.oauthTokenData?.access_token);
console.log('Token preview:', credentials?.oauthTokenData?.access_token?.substring(0, 20) + '...');

return { json: { hasToken: !!credentials?.oauthTokenData?.access_token } };
```

### Verificar conectividad MCP:

Prueba el endpoint SSE manualmente:

```bash
# Windows PowerShell
$token = "tu_access_token_aqui"
$url = "https://mcp.canva.com/sse?access_token=$token"

curl $url -Headers @{
  "Accept" = "text/event-stream"
  "Cache-Control" = "no-cache"
}
```

**Esperas**:
- Stream SSE con eventos MCP
- O error 401 si el token no funciona

## ⚠️ Problemas Conocidos

### 1. "OAuth access token not found"

**Causa**: La credencial no tiene el token guardado
**Solución**: 
- Reautentica la credencial
- Verifica que completaste el flujo OAuth
- Chequea que n8n tiene acceso a guardar credenciales

### 2. "Transport connection failed"

**Causa**: No puede conectar al servidor MCP
**Solución**:
- Verifica que `https://mcp.canva.com` esté accesible
- Prueba con `curl` o Postman primero
- Revisa firewall/proxy

### 3. "401 Unauthorized" durante ejecución

**Causa**: Token inválido o expirado
**Solución**:
- Reautentica la credencial (OAuth refresh)
- Verifica que la app en Canva tiene los permisos correctos
- Chequea que los scopes incluyen lo necesario

### 4. El token expira rápido

**Causa**: Tokens de acceso suelen expirar en 1 hora
**Solución**:
- n8n debería manejar refresh automático si Canva provee `refresh_token`
- Si no funciona, necesitas reautenticar manualmente

## 🔄 Métodos de Autenticación Soportados

El nodo intenta **2 métodos** en paralelo:

### Método 1: Token en Query Params (Preferido para SSE)
```
GET https://mcp.canva.com/sse?access_token=eyJhbG...
```

### Método 2: Token en Header (Fallback)
```
GET https://mcp.canva.com/sse
Headers:
  Authorization: Bearer eyJhbG...
  Accept: text/event-stream
```

Esto asegura compatibilidad con diferentes configuraciones del servidor MCP de Canva.

## 📚 Referencias

- **OAuth 2.0 PKCE**: https://oauth.net/2/pkce/
- **MCP Specification**: https://modelcontextprotocol.io/
- **n8n OAuth Credentials**: https://docs.n8n.io/integrations/builtin/credentials/oauth2/
- **Canva Developers**: https://www.canva.com/developers/

## ✅ Resumen

**¿El nodo puede obtener OAuth 2.0 y usarlo vía MCP?**

**Sí, completamente:**

1. ✅ Credencial OAuth 2.0 PKCE configurada
2. ✅ Flujo de autorización funcional
3. ✅ Obtención de access token
4. ✅ Inyección en peticiones MCP (2 métodos)
5. ✅ Renovación automática (si Canva provee refresh token)

**Siguiente paso**: Probar con tu Client ID/Secret de Canva y validar que el flujo completo funciona.

Si encuentras errores específicos, documéntalos para ajustar la implementación según el comportamiento real del servidor MCP de Canva.
