# 🧪 Guía de Prueba - Canva MCP Node

## Paso 1: Instalar el Nodo en n8n

### Opción A: Desde npm (recomendado)
```bash
# En tu instalación de n8n
npm install n8n-nodes-canva-improved@2.3.0

# O si usas Docker
docker exec -it <n8n-container> npm install n8n-nodes-canva-improved@2.3.0
docker restart <n8n-container>
```

### Opción B: Desde archivo local (desarrollo)
```bash
# En este directorio
npm pack

# Copiar el .tgz a tu n8n
npm install /path/to/n8n-nodes-canva-improved-2.3.0.tgz
```

## Paso 2: Configurar Credenciales Canva MCP

### 2.1 Crear App en Canva (si no la tienes)

1. Ve a https://www.canva.com/developers/apps
2. Click en "Create an app"
3. Rellena:
   - **App name**: "n8n MCP Integration"
   - **App description**: "MCP integration for n8n workflows"
4. Una vez creada, copia:
   - **Client ID** (ej: `zyOAOBLTmiWGowfn`)
   - **Client Secret** (oculto, click para revelar)

### 2.2 Configurar OAuth en Canva App

1. En tu app de Canva → **Settings** → **OAuth**
2. Agrega **Redirect URI**:
   ```
   http://localhost:5678/rest/oauth2-credential/callback
   ```
   (Ajusta `localhost:5678` según tu URL de n8n)

3. **Scopes necesarios** (ya configurados automáticamente):
   - `openid`
   - `email`
   - `profile`
   - `design:content:read`
   - `design:content:write`
   - `design:meta:read`
   - `asset:read`
   - `asset:write`
   - `folder:read`
   - `folder:write`
   - `comment:read`
   - `comment:write`
   - `brandtemplate:meta:read`
   - `brandtemplate:content:read`
   - `profile:read`

### 2.3 Crear Credencial en n8n

1. En n8n → **Credentials** → **New Credential**
2. Busca: **"Canva MCP API"**
3. Rellena:
   - **MCP Server URL**: `https://mcp.canva.com` (default, no cambiar)
   - **Client ID**: (pega tu Client ID de Canva)
   - **Client Secret**: (pega tu Client Secret de Canva)
4. Click **"Connect my account"**
5. Se abrirá ventana de autorización:
   ```
   https://mcp.canva.com/authorize?response_type=code&client_id=...&code_challenge=...
   ```
6. Autoriza la app en Canva
7. ✅ Serás redirigido a n8n con credencial conectada

## Paso 3: Crear Workflow de Prueba

### Prueba 1: List Brand Kits (Simple)

```json
{
  "nodes": [
    {
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [250, 300]
    },
    {
      "name": "Canva MCP",
      "type": "n8n-nodes-canva-improved.canvaMcp",
      "position": [450, 300],
      "parameters": {
        "operation": "listBrandKits"
      },
      "credentials": {
        "canvaMcpApi": {
          "id": "1",
          "name": "Canva MCP API account"
        }
      }
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{"node": "Canva MCP", "type": "main", "index": 0}]]
    }
  }
}
```

**Resultado esperado:**
```json
{
  "brand_kits": [
    {
      "id": "brand_kit_123",
      "name": "My Brand Kit",
      "colors": ["#1A2B4F", "#D4AF37"]
    }
  ]
}
```

### Prueba 2: Search Designs

```json
{
  "nodes": [
    {
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [250, 300]
    },
    {
      "name": "Canva MCP",
      "type": "n8n-nodes-canva-improved.canvaMcp",
      "position": [450, 300],
      "parameters": {
        "operation": "searchDesigns",
        "searchQuery": "presentation",
        "ownership": "any"
      },
      "credentials": {
        "canvaMcpApi": {
          "id": "1",
          "name": "Canva MCP API account"
        }
      }
    }
  ]
}
```

**Resultado esperado:**
```json
{
  "designs": [
    {
      "id": "DAFVztcvd9z",
      "title": "My Presentation",
      "created_at": 1703001234,
      "thumbnail": {
        "url": "https://..."
      }
    }
  ]
}
```

### Prueba 3: Generate Design (Completo)

**Nodo 1: Manual Trigger con input**
```json
{
  "topic": "LinkedIn Authority for Freelancers"
}
```

**Nodo 2: Canva MCP - Generate Design**
```
Operation: Generate Design
Design Type: presentation
Content Query: 
```
```markdown
**Presentation Brief**
* **Title**: LinkedIn Authority Blueprint
* **Topic**: Estrategia completa para freelancers que buscan generar leads en LinkedIn
* **Key Messages**: 
  1. La autoridad se construye con sistema, no con suerte
  2. Tres pilares: Perfil, Contenido, Red
  3. Implementación práctica en 90 días
* **Style**: Profesional, navy blue (#1A2B4F) + gold (#D4AF37), Montserrat font

**Slide Plan**

**Slide 1 — "From Invisible to Influential"**
* **Goal**: Capturar atención y establecer promesa
* **Bullets**:
  - For freelancers tired of posting into the void
  - The proven 90-day framework to build authority
  - Generate qualified leads while you sleep
* **Visuals**: Split-screen: freelancer frustrado (left) → freelancer confiado en call (right)
* **Data**: N/A (cover slide)

**Slide 2 — "The Invisible Freelancer Problem"**
* **Goal**: Mirror del dolor actual
* **Bullets**:
  - You publish consistently but get zero engagement
  - Profile views don't convert to conversations
  - Your competitors with less skill get all the clients
  - LinkedIn feels like shouting into darkness
* **Visuals**: Donut chart showing "78% of freelancers report posting without ROI"
* **Data**: 78% statistic from industry research

**Slide 3 — "The Authority Equation"**
* **Goal**: Introducir framework único
* **Bullets**:
  - Authority = Influence × Trust × Visibility
  - The 3-Pillar System explained
  - Each pillar amplifies the others
  - 90-day roadmap overview
* **Visuals**: Triangle diagram with 3 pillars connected by bidirectional arrows
* **Data**: Visual formula, 90-day timeline

[... agregar más slides para una presentación de 8-12 páginas ...]
```

**Nodo 3: Code - Extract Candidate ID**
```javascript
// Get first candidate from generate-design response
const candidates = $input.item.json.candidates || [];
if (candidates.length === 0) {
  throw new Error('No design candidates generated');
}

return {
  json: {
    job_id: $input.item.json.job_id,
    candidate_id: candidates[0].candidate_id,
    preview_url: candidates[0].preview_url
  }
};
```

**Nodo 4: Canva MCP - Create Design from Candidate**
```
Operation: Create Design from Candidate
Job ID: {{ $json.job_id }}
Candidate ID: {{ $json.candidate_id }}
```

**Nodo 5: Canva MCP - Export Design**
```
Operation: Export Design
Design ID: {{ $json.design.id }}
Export Format: pdf
Export Quality: pro
Paper Size: a4
```

**Resultado final esperado:**
```json
{
  "job": {
    "id": "export_abc123",
    "status": "success",
    "url": "https://export.canva.com/download/....pdf"
  }
}
```

## 📊 Verificación de Logs

Durante la ejecución, revisa los logs de n8n para ver:

```
[Canva MCP] Connecting to Canva MCP at https://mcp.canva.com
[Canva MCP] Access token length: 2048
[Canva MCP] Attempting to connect to Canva MCP...
[Canva MCP] ✅ Successfully connected to Canva MCP
[Canva MCP] Available MCP tools: generate-design, create-design-from-candidate, export-design, search-designs, get-design, list-brand-kits
[Canva MCP] Processing item 1/1: generateDesign
```

## ⚠️ Troubleshooting

### Error: "OAuth access token not found"
**Causa**: Credencial no autenticada correctamente.

**Solución**:
1. Ve a Credentials en n8n
2. Edita la credencial "Canva MCP API"
3. Click en "Reconnect" o "Delete" y crea una nueva
4. Completa el flujo OAuth nuevamente

### Error: "Failed to connect to Canva MCP: Connection timeout"
**Causa**: Servidor MCP no accesible o token inválido.

**Solución**:
1. Verifica que `https://mcp.canva.com` sea accesible desde tu n8n:
   ```bash
   curl https://mcp.canva.com
   ```
2. Verifica tu token en la credencial
3. Revisa que los scopes estén configurados en tu app de Canva

### Error: "Common queries will not be generated"
**Causa**: Content Query demasiado genérico.

**Solución**:
- Agrega MÁS detalles al Content Query
- Incluye títulos exactos, bullets específicos, datos reales
- Especifica visuales con precisión
- Ver ejemplo completo en Prueba 3

### Error: "Tool 'generate-design' not found"
**Causa**: El servidor MCP de Canva no expone las herramientas esperadas.

**Solución**:
1. Revisa los logs para ver qué herramientas están disponibles
2. Puede que Canva MCP tenga nombres diferentes
3. Contacta soporte de Canva para confirmar nombres correctos

## 📈 Métricas de Éxito

### ✅ Prueba exitosa si:
1. Credencial se conecta sin errores
2. List Brand Kits retorna datos (aunque sea array vacío)
3. Search Designs retorna lista de diseños
4. Generate Design retorna candidatos con preview URLs
5. Create from Candidate retorna design_id
6. Export Design retorna download URL

### 🎯 Tiempos esperados:
- List Brand Kits: 2-5 segundos
- Search Designs: 2-5 segundos
- Generate Design: 30-90 segundos
- Create from Candidate: 5-15 segundos
- Export Design: 10-30 segundos

## 🐛 Reportar Issues

Si encuentras problemas:

1. Captura los logs completos de n8n
2. Anota el error exacto
3. Incluye la configuración (sin credenciales sensibles)
4. Abre issue en: https://github.com/0xAF00/n8n-nodes-canva-improved/issues

---

**Próximos pasos después de probar:**
- Integrar con AI Agent para generar Content Query automáticamente
- Crear workflows de generación batch
- Configurar webhooks para generación on-demand
