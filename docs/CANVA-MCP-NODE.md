# Canva MCP Node - Guía Completa

## 🎯 ¿Qué es Canva MCP?

El nodo **Canva MCP** permite a n8n comunicarse con el servidor MCP (Model Context Protocol) de Canva para generar diseños con IA, exportarlos y gestionarlos.

### Diferencias vs Nodo Canva REST:

| Característica | Canva REST | Canva MCP |
|----------------|------------|-----------|
| **API** | REST API pública | MCP Protocol |
| **Autenticación** | OAuth 2.0 PKCE | OAuth 2.0 via MCP |
| **Genera contenido** | ❌ No | ✅ Sí (con IA) |
| **Operaciones** | CRUD básico | IA generativa + CRUD |
| **Endpoint** | api.canva.com | mcp.canva.com |

## 🔐 Configuración de Credenciales

### Paso 1: Crear App en Canva

1. Ve a https://www.canva.com/developers/apps
2. Crea una nueva aplicación
3. Copia tu **Client ID** y **Client Secret**
4. Configura **Redirect URI**: `http://localhost:5678/rest/oauth2-credential/callback`
   - (Ajusta según tu URL de n8n)

### Paso 2: Configurar Credencial en n8n

1. En n8n → Credentials → New Credential
2. Busca **"Canva MCP API"**
3. Rellena:
   - **Client ID**: (de tu app Canva)
   - **Client Secret**: (de tu app Canva)
   - **MCP Server URL**: `https://mcp.canva.com` (default)
4. Click en **Connect my account**
5. Autoriza en la ventana de Canva:
   ```
   https://mcp.canva.com/authorize?response_type=code&client_id=...
   ```
6. Una vez autorizado, la credencial estará lista

## 📋 Operaciones Disponibles

### 1. Generate Design (Generar Diseño con IA)

Genera un diseño completo con contenido usando IA de Canva.

**Parámetros:**
- **Design Type**: presentation, doc, whiteboard, poster, flyer, instagram_post, business_card
- **Content Query**: Descripción DETALLADA del contenido (CRÍTICO)
- **Brand Kit ID** (opcional): Para diseños con tu branding
- **Asset IDs** (opcional): IDs de imágenes a insertar

**Ejemplo de Content Query:**
```
**Presentation Brief**
* **Title**: LinkedIn Authority Framework
* **Topic**: Estrategia para freelancers que quieren generar leads en LinkedIn
* **Key Messages**: 
  1. La autoridad se construye con sistema
  2. Tres pilares: Perfil, Contenido, Red
  3. 90 días de implementación
* **Style**: Profesional, navy blue + gold, Montserrat font

**Slide Plan**

**Slide 1 — "From Invisible to Influential"**
* **Goal**: Hook inicial y promesa de transformación
* **Bullets**:
  - For freelancers tired of posting into the void
  - The proven 90-day framework
  - Generate qualified leads while you sleep
* **Visuals**: Split-screen: frustrado → confiado
* **Data**: N/A (cover)

**Slide 2 — "The Problem"**
* **Goal**: Espejo del dolor
* **Bullets**:
  - You publish but get zero engagement
  - Profile views don't convert
  - Competitors with less skill get clients
  - LinkedIn feels like darkness
* **Visuals**: Donut chart "78% report posting without ROI"
* **Data**: 78% stat from research

[... continuar con TODAS las slides ...]
```

**Output:**
```json
{
  "job_id": "abc123",
  "candidates": [
    {
      "candidate_id": "cand_1",
      "preview_url": "https://...",
      "thumbnail_url": "https://..."
    },
    {
      "candidate_id": "cand_2",
      "preview_url": "https://...",
      "thumbnail_url": "https://..."
    }
  ]
}
```

### 2. Create Design from Candidate

Convierte un candidato generado en diseño editable.

**Parámetros:**
- **Job ID**: Del response de Generate Design
- **Candidate ID**: ID del candidato elegido

**Output:**
```json
{
  "design": {
    "id": "DAFVztcvd9z",
    "title": "LinkedIn Authority Framework",
    "edit_url": "https://www.canva.com/design/...",
    "thumbnail": { "url": "https://..." }
  }
}
```

### 3. Export Design

Exporta un diseño a PDF, PNG, JPG, etc.

**Parámetros:**
- **Design ID**: ID del diseño
- **Export Format**: pdf, png, jpg, gif, mp4, pptx
- **Export Quality**: regular, pro
- **Paper Size** (para PDF): a4, a3, letter, legal

**Output:**
```json
{
  "job": {
    "id": "export_123",
    "status": "success",
    "url": "https://export.canva.com/download/..."
  }
}
```

### 4. Search Designs

Busca diseños existentes por keywords.

**Parámetros:**
- **Search Query** (opcional): Palabras clave
- **Ownership**: any, owned, shared

### 5. Get Design

Obtiene detalles de un diseño específico.

**Parámetros:**
- **Design ID**: ID del diseño

### 6. List Brand Kits

Lista los brand kits disponibles para diseño con branding.

## 🚀 Ejemplos de Workflows

### Ejemplo 1: Generación Completa de Infoproducto

```
┌──────────────────────────────────────────┐
│ 1. Trigger: Webhook o Manual             │
│    Input: tema, audiencia                │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│ 2. Nodo AI (GPT/Claude)                  │
│    Prompt: Crea outline detallado        │
│    Output: content_query (muy detallado) │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│ 3. Canva MCP: Generate Design            │
│    design_type: presentation             │
│    content_query: {{ $json.content }}    │
│    Output: job_id + candidates           │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│ 4. Code: Seleccionar primer candidato    │
│    candidate_id = candidates[0].id       │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│ 5. Canva MCP: Create from Candidate      │
│    job_id: {{ $json.job_id }}            │
│    candidate_id: {{ $json.candidate_id }}│
│    Output: design_id                     │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│ 6. Canva MCP: Export Design              │
│    design_id: {{ $json.design.id }}      │
│    format: pdf, quality: pro             │
│    Output: download_url                  │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│ 7. Email/Slack/Storage con URL del PDF  │
└──────────────────────────────────────────┘
```

### Ejemplo 2: Generación Batch con Brand Kit

```
┌──────────────────────────────────────────┐
│ 1. Google Sheets: Lista de temas        │
│    Output: Array de temas                │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│ 2. Loop: Para cada tema                  │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│ 3. Canva MCP: List Brand Kits            │
│    Output: brand_kit_id                  │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│ 4. AI: Genera content_query para tema   │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│ 5. Canva MCP: Generate Design            │
│    brand_kit_id: {{ $json.brand_kit_id }}│
│    content_query: {{ $json.query }}      │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│ 6-8. Create → Export → Save              │
└──────────────────────────────────────────┘
```

## ⚠️ Notas Importantes

### 1. La Calidad del Content Query es CRÍTICA

❌ **Query genérico (resultados pobres):**
```
"Crea una presentación sobre marketing digital con 15 slides"
```

✅ **Query detallado (resultados excelentes):**
```
Ver ejemplo completo arriba con:
- Brief completo
- Plan slide por slide
- Títulos exactos
- Bullets específicos
- Especificaciones visuales
- Datos reales
- Transiciones entre slides
```

### 2. Tiempos de Generación

- Generate Design: 30-90 segundos (depende de complejidad)
- Create from Candidate: 5-15 segundos
- Export: 10-30 segundos

**Recomendación:** Usa "Wait" nodes o polling en workflows automáticos.

### 3. Rate Limits

Canva MCP tiene límites según tu plan:
- Free: ~10 generaciones/día
- Pro: ~100 generaciones/día
- Enterprise: Ilimitado

### 4. Costos

Cada generación con `generate-design` consume créditos según tu plan Canva.

## 🔧 Troubleshooting

### Error: "OAuth access token not found"
→ Reautentica la credencial en n8n

### Error: "Common queries will not be generated"
→ Tu content_query es muy genérico. Agrega MÁS detalles.

### Error: "Transport connection failed"
→ Verifica que `https://mcp.canva.com` esté accesible

### Los diseños no tienen calidad premium
→ Especifica paleta de colores, tipografía, y layout en el query

## 📚 Recursos

- **MCP Protocol**: https://modelcontextprotocol.io/
- **Canva MCP Docs**: https://www.canva.dev/docs/mcp/
- **System Prompts**: Ver `prompts/PRESET-BUSINESS-MCP.txt`

## 🆚 Cuándo Usar Cada Nodo

### Usa **Canva MCP** cuando:
- ✅ Necesitas generar contenido con IA
- ✅ Quieres diseños completos automáticamente
- ✅ Tienes descripciones detalladas del contenido

### Usa **Canva REST** cuando:
- ✅ Solo necesitas exportar diseños existentes
- ✅ Gestionas carpetas y assets
- ✅ Actualizas metadatos de diseños
- ✅ No necesitas generación de contenido

---

**Versión del nodo:** 2.3.0  
**Última actualización:** Diciembre 18, 2025
