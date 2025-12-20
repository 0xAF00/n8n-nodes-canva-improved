# n8n-nodes-canva-improved

[![NPM Version](https://img.shields.io/npm/v/n8n-nodes-canva-improved)](https://www.npmjs.com/package/n8n-nodes-canva-improved)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Nodo mejorado de n8n para Canva Connect API con soporte REST y MCP (Model Context Protocol)

Este paquete incluye **2 nodos** de comunidad para n8n:
1. **Canva (REST)**: API REST tradicional para CRUD operations
2. **Canva MCP**: Protocolo MCP para generación de diseños con IA

## 🎯 Características Principales

### 🆕 v2.7.0 - Integración con Agentes de IA

- **🤖 Agentes de IA**: Los agentes de n8n pueden usar Canva directamente con el servidor MCP oficial
- **🔗 Encadenamiento de nodos**: Canva MCP acepta access_token desde el nodo anterior
- **📄 Generación con IA**: Crea presentaciones, posters, documentos completos con lenguaje natural
- **🎨 Brand Kits**: Usa tu marca corporativa en diseños generados
- **🔐 OAuth 2.0 PKCE**: Autenticación segura con Dynamic Client Registration

### ✅ Mejoras sobre versiones anteriores

- **API actualizada**: Implementa las últimas especificaciones de la API de Canva (Diciembre 2025)
- **OAuth 2.0 con PKCE**: Autenticación segura y moderna (REST y MCP)
- **Endpoints simplificados**: Rutas más limpias y consistentes
- **Mejor manejo de errores**: Respuestas más claras y útiles
- **Tipos de design actualizados**: Solo los tipos oficialmente soportados
- **Formato de exportación mejorado**: Estructura actualizada para múltiples formatos

## 🚀 Inicio Rápido

### Para Agentes de IA 🤖

```
1. Canva MCP Auth → Genera access_token
2. AI Agent → Conecta a https://mcp.canva.com con el token
3. El agente usa tools: generate-design, export-design, etc.
4. ¡Listo! El agente genera y exporta diseños automáticamente
```

**📘 [Ver Guía de Configuración de Agentes](./AGENT_SETUP.md)**

### Para Workflows Manuales 📋

```
1. Autentica con Canva MCP Auth
2. Usa Canva MCP → Generate Design (proporciona contenido detallado)
3. Usa Canva MCP → Create Design from Candidate (convierte a editable)
4. Usa Canva MCP → Export Design (PDF, PNG, etc.)
5. Descarga el archivo generado
```

**📘 [Ver Guía Completa de IA](./GUIDE_AI_DESIGN.md)** | **📦 [Workflow de Ejemplo](./examples/ai-design-to-pdf-workflow.json)**

## 📦 Nodos Incluidos

### 1. 🤖 Canva MCP (AI-Powered)

Nodo para generación de diseños con IA y operaciones avanzadas.

#### Operaciones:

**Generate Design** 🎨
- Genera diseños completos con IA usando descripciones detalladas
- Soporta: presentations, posters, flyers, instagram_post, business_card, logo, etc.
- Opcional: Brand Kits y Asset IDs

**Create Design from Candidate** ✨
- Convierte candidato generado en diseño editable
- Obtén design_id para editar/exportar

**Export Design** 📄
- Exporta a PDF, PNG, JPG, PPTX, MP4
- Configuración de calidad y tamaño de papel

**Search Designs** 🔍
- Busca diseños por keywords

**Get Design** 📋
- Obtén detalles de un diseño específico

**List Brand Kits** 🎨
- Lista tus brand kits disponibles

### 2. 🎨 Canva (REST API)

Nodo tradicional para operaciones CRUD y exportación.

#### Recursos Soportados:

**Designs**
- Create, Get, List, Update, Delete

**Exports**  
- Create Export Job, Get Export Job
- Formatos: PDF, JPG, PNG, GIF, PPTX, MP4

**Folders**
- Create, List, Get, List Items

**Users**
- Get Profile

**[Ver documentación completa →](./docs/CANVA-API.md)**

### 2. 🤖 Canva MCP (Model Context Protocol)

**NUEVO** - Nodo para generación de diseños con IA.

#### Operaciones Disponibles:

- **Generate Design**: Genera diseño completo con contenido (IA)
- **Create from Candidate**: Convierte candidato en design editable
- **Export Design**: Exporta a PDF/PNG/JPG/etc
- **Search Designs**: Busca diseños por keywords
- **Get Design**: Obtiene detalles de un diseño
- **List Brand Kits**: Lista brand kits disponibles

**[Ver documentación completa →](./docs/CANVA-MCP-NODE.md)**

#### 📁 Folders
- ✅ **Create**: Crear nuevas carpetas
- ✅ **List**: Listar carpetas
- ✅ **Get**: Obtener información de una carpeta
- ✅ **List Items**: Listar contenido de una carpeta

#### 👤 Users
- ✅ **Get Profile**: Obtener información del usuario actual

## 📋 Requisitos

- **n8n**: Versión 1.54.4 o superior
- **Node.js**: Versión 18.10.0 o superior
- **Cuenta Canva**: Con acceso a la Connect API
- **App registrada**: En el [Canva Developer Portal](https://www.canva.dev/)

## 🚀 Instalación

### Desde n8n

1. Ve a **Settings > Community Nodes**
2. Selecciona **Install**
3. Ingresa `n8n-nodes-canva-improved`
4. Acepta los riesgos de usar nodos de comunidad
5. Instala el nodo

### Desde npm

```bash
npm install n8n-nodes-canva-improved
```

### Manual (desarrollo)

```bash
# Clona el repositorio
git clone https://github.com/yourusername/n8n-nodes-canva-improved.git
cd n8n-nodes-canva-improved

# Instala dependencias
npm install

# Compila el proyecto
npm run build

# Enlaza localmente (para desarrollo)
npm link
```

## 🔑 Configuración de Credenciales

### Opción 1: Canva API (REST) - Para operaciones CRUD

### Paso 1: Crear una integración en Canva

1. Ve al [Canva Developer Portal](https://www.canva.com/developers/)
2. Inicia sesión con tu cuenta de Canva
3. Activa la autenticación de dos factores (MFA) si es necesario
4. Ve a "Your Integrations" y haz clic en "Create an integration"
5. Elige el tipo de integración (Public o Private)

### Paso 2: Configurar tu integración

1. Define un nombre para tu integración
2. **Copia el Client ID** (lo necesitarás en n8n)
3. **Genera y guarda el Client Secret** (lo necesitarás en n8n)
4. Configura la **URL de redirección OAuth**:
   ```
   https://tu-instancia-n8n.com/rest/oauth2-credential/callback
   ```

### Paso 3: Habilitar Scopes

**⚠️ CRÍTICO**: Debes habilitar TODOS estos scopes en tu integración de Canva:

```
openid
email
profile
design:content:read
design:content:write
design:meta:read
asset:read
asset:write
folder:read
folder:write
comment:read
comment:write
brandtemplate:meta:read
brandtemplate:content:read
profile:read
```

Si falta algún scope, recibirás el error `"invalid_scope"`.

### Paso 4: Configurar en n8n

1. En n8n, crea una nueva credencial **"Canva API"**
2. Ingresa el **Client ID** de tu integración de Canva
3. Ingresa el **Client Secret** de tu integración
4. Haz clic en **"Connect my account"**
5. Autoriza la aplicación en la ventana de Canva
6. ✅ ¡Listo! n8n gestionará automáticamente los tokens

---

### Opción 2: Canva MCP API - Para generación con IA

### Paso 1: Usar la misma App de Canva

Puedes usar la misma integración creada arriba (Client ID y Secret).

### Paso 2: Configurar en n8n

1. En n8n, crea una nueva credencial **"Canva MCP API"**
2. **MCP Server URL**: `https://mcp.canva.com` (default)
3. Ingresa el **Client ID** de tu integración de Canva
4. Ingresa el **Client Secret** de tu integración
5. Haz clic en **"Connect my account"**
6. Serás redirigido a `https://mcp.canva.com/authorize`
7. Autoriza la aplicación
8. ✅ Credencial lista para generar diseños con IA

**📚 [Guía completa de MCP →](./docs/CANVA-MCP-NODE.md)**

## 💡 Ejemplos de Uso

### REST API - Operaciones CRUD

#### Ejemplo 1: Crear un documento de Canva

```json
{
  "resource": "designs",
  "operation": "create",
  "designType": "doc",
  "title": "Mi nuevo documento"
}
```

#### Ejemplo 2: Exportar un design a PDF

```json
{
  "resource": "exports",
  "operation": "createJob",
  "designId": "DAFVztcvd9z",
  "exportFormat": "pdf",
  "exportQuality": "pro",
  "paperSize": "a4"
}
```

#### Ejemplo 3: Verificar el estado de exportación

```json
{
  "resource": "exports",
  "operation": "getJob",
  "exportJobId": "e08861ae-3b29-45db-8dc1-1fe0bf7f1cc8"
}
```

#### Ejemplo 4: Listar todos los designs

```json
{
  "resource": "designs",
  "operation": "list"
}
```

---

### MCP - Generación con IA

#### Ejemplo 5: Generar una presentación con contenido

```
Operation: Generate Design
Design Type: presentation
Content Query:
```
```markdown
**Presentation Brief**
* **Title**: LinkedIn Authority Blueprint
* **Topic**: Complete strategy for freelancers to generate leads on LinkedIn
* **Key Messages**: 
  1. Authority is built with system, not luck
  2. Three pillars: Profile, Content, Network
  3. 90-day practical implementation

**Slide Plan**

**Slide 1 — "From Invisible to Influential"**
* **Goal**: Capture attention and establish promise
* **Bullets**:
  - For freelancers tired of posting into the void
  - The proven 90-day framework to build authority
  - Generate qualified leads while you sleep
* **Visuals**: Split-screen: frustrated freelancer (left) → confident freelancer on call (right)

[... add 7-10 more slides with detailed structure ...]
```

#### Ejemplo 6: Workflow completo de generación

```
Node 1: Canva MCP - Generate Design
  → Returns: job_id + candidates[]

Node 2: Code - Select Best Candidate
  → Extract: candidates[0].candidate_id

Node 3: Canva MCP - Create from Candidate
  → Returns: design_id

Node 4: Canva MCP - Export Design
  → Returns: download_url

Node 5: HTTP Request - Download PDF
  → Save or send via email
```

**📚 [Ver workflows completos de MCP →](./docs/CANVA-MCP-NODE.md)**

## 🔄 Diferencias con el nodo anterior

| Característica | Versión Anterior | Esta Versión Mejorada |
|----------------|------------------|----------------------|
| Tipos de Design | 30+ tipos genéricos | 3 tipos oficiales (doc, whiteboard, presentation) |
| Endpoint Create | `/designs` con body complejo | `/designs` con estructura simplificada |
| Formato Export | Múltiples parámetros | Objeto `format` estructurado |
| OAuth | OAuth 2.0 básico | OAuth 2.0 con PKCE |
| Calidad Export | low/medium/high | regular/pro |
| Paper Size | No soportado | Soportado para PDF (a4, a3, letter, legal) |
| Método Update | POST | PATCH |

## 📚 Documentación de la API

Para más detalles sobre la API de Canva Connect:

- [Documentación oficial](https://www.canva.dev/docs/connect/)
- [Referencia de API](https://www.canva.dev/docs/connect/api-reference/)
- [Create Design](https://www.canva.dev/docs/connect/api-reference/designs/create-design/)
- [Export Design](https://www.canva.dev/docs/connect/api-reference/exports/create-design-export-job/)

## 🐛 Solución de Problemas

### Error: "invalid_scope"

**Causa**: No habilitaste todos los scopes en tu integración de Canva.

**Solución**: Ve al Canva Developer Portal y habilita TODOS los 18 scopes listados en la sección de configuración.

### Error: "design type not supported"

**Causa**: Intentas usar un tipo de design que no está soportado por la API actual.

**Solución**: Usa solo los tipos oficiales: `doc`, `whiteboard`, o `presentation`.

### Error de autenticación

**Causa**: Token expirado o credenciales incorrectas.

**Solución**: 
1. Verifica que el Client ID y Secret sean correctos
2. Reconecta tu cuenta haciendo clic en "Reconnect" en las credenciales
3. Asegúrate de que la URL de redirección OAuth esté configurada correctamente

### La exportación queda en "in_progress"

**Causa**: Los trabajos de exportación son asíncronos.

**Solución**: 
1. Usa la operación "Get Export Job" para verificar el estado
2. Espera hasta que el estado sea "success"
3. Descarga el archivo usando la URL proporcionada (válida por 24 horas)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si encuentras un bug o tienes una sugerencia:

1. Abre un [issue](https://github.com/0xAF00/n8n-nodes-canva-improved/issues)
2. Fork el repositorio
3. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
4. Commit tus cambios (`git commit -m 'Add amazing feature'`)
5. Push a la rama (`git push origin feature/amazing-feature`)
6. Abre un Pull Request

## 📝 Changelog

### v2.3.0 (2025-12-19)

🆕 **MCP Support**
- Added Canva MCP node for AI-powered design generation
- New credential: CanvaMcpApi with OAuth 2.0 PKCE
- 6 MCP operations: generate-design, create-from-candidate, export-design, search-designs, get-design, list-brand-kits
- Complete workflow support: Generate → Create → Export

📚 **Documentation**
- Added [CANVA-MCP-NODE.md](./docs/CANVA-MCP-NODE.md) - Complete MCP guide
- Added [TESTING-GUIDE.md](./docs/TESTING-GUIDE.md) - Testing instructions
- Added [ARCHITECTURE-OPTIONS.md](./docs/ARCHITECTURE-OPTIONS.md) - Decision matrix
- Updated README with MCP examples

### v2.2.0 (2025-12-18)

🤖 **AI Agent Support**
- Added `usableAsTool: true` flag for n8n AI Agents
- Translated all descriptions to English
- Optimized for AI workflow automation

### v2.1.1 (2025-12-17)

🐛 **Bug Fixes**
- Fixed CanvaTrigger.node reference error

### v2.1.0 (2025-12-16)

✅ **Initial Release**
- OAuth 2.0 with PKCE authentication
- Design operations (CRUD)
- Export operations (PDF, JPG, PNG, GIF, PPTX, MP4)
- Folder operations
- User profile operations

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [n8n](https://n8n.io/) por la increíble plataforma de automatización
- [Canva](https://www.canva.com/) por su API Connect
- La comunidad de n8n por su apoyo

## 📞 Soporte

- [Documentación de n8n](https://docs.n8n.io/)
- [Comunidad de Canva Developers](https://community.canva.dev/)
- [GitHub Issues](https://github.com/yourusername/n8n-nodes-canva-improved/issues)

---

**Nota**: Este es un nodo de comunidad y no está oficialmente soportado por n8n o Canva. Úsalo bajo tu propio riesgo.

Hecho con ❤️ para la comunidad de n8n
