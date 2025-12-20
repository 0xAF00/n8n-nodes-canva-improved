# 🎨 Guía Rápida: Generar PDF Profesional con IA de Canva

## 📋 Flujo Completo

```
Input del Usuario → Generate Design (AI) → Create from Candidate → Export PDF → Descargar
```

## 🚀 Paso a Paso

### 1️⃣ Autenticar con Canva MCP
- Agrega el nodo **Canva MCP Auth**
- Conecta tu cuenta de Canva (OAuth)
- Obtendrás un `access_token` válido

### 2️⃣ Generar Diseño con IA
Usa el nodo **Canva MCP** con operación `Generate Design`:

**Parámetros clave:**
- `Design Type`: Selecciona el tipo (presentation, poster, flyer, document, etc.)
- `Content Query`: **CRÍTICO** - Proporciona contenido detallado

**Formato del Content Query para Presentaciones:**

```
**Presentation Brief**
Title: [Título de tu presentación]
Topic: [Descripción del tema en 1-2 líneas]
Key Messages:
- [Mensaje clave 1]
- [Mensaje clave 2]
- [Mensaje clave 3]

**Narrative Arc**
[Flujo de la historia: Problema → Solución → Evidencia → Acción]

**Slide Plan**

Slide 1 — "[Título Exacto]"
Goal: [Objetivo de esta diapositiva]
Bullets:
- [Bullet point 1 con datos específicos]
- [Bullet point 2]
- [Bullet point 3]
Visuals: [Descripción del visual: "Gráfico de barras de X vs Y", "Foto de..."]
Data: [Datos concretos, fuentes, valores específicos]
Speaker Notes: [Notas para el presentador]
Transition: [Frase de transición a la siguiente diapositiva]

Slide 2 — "[Título Exacto]"
[... repetir estructura ...]
```

**Respuesta esperada:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "job_id: abc123\ncandidate_id: xyz789\npreview: https://canva.com/preview/..."
    }
  ]
}
```

### 3️⃣ Convertir Candidato a Diseño Editable
Usa **Canva MCP** con operación `Create Design from Candidate`:

```javascript
{
  "job_id": "{{ $json.job_id }}",
  "candidate_id": "{{ $json.candidate_id }}"
}
```

**Respuesta:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "design_id: DAF123abc\ntitle: AI-Powered Business Strategy\nedit_url: https://www.canva.com/design/DAF123abc/edit"
    }
  ]
}
```

### 4️⃣ Exportar como PDF
Usa **Canva MCP** con operación `Export Design`:

```javascript
{
  "design_id": "{{ $json.design_id }}",
  "export_format": "pdf",
  "export_quality": "pro",
  "paper_size": "a4"
}
```

**Respuesta:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "url: https://export-download.canva.com/...\nexpires_at: 2025-12-20T12:00:00Z"
    }
  ]
}
```

### 5️⃣ Descargar PDF
Usa el nodo **HTTP Request** para descargar el archivo:

```javascript
{
  "method": "GET",
  "url": "{{ $json.download_url }}",
  "responseFormat": "file",
  "options": {
    "fileName": "presentation.pdf"
  }
}
```

## 🎯 Ejemplo Simplificado para Otros Tipos

### Poster / Flyer
```
Content Query:
Create a modern coffee shop poster.

Title: "Artisan Coffee Daily"
Subtitle: "Fresh roasted beans from Colombia"

Key visuals:
- Large hero image of coffee cup with latte art
- Warm brown and cream color scheme
- Location: 123 Main Street, Downtown
- Hours: Mon-Fri 7AM-6PM
- Phone: (555) 123-4567

Style: Minimalist, professional, inviting
```

### Instagram Post
```
Content Query:
Create an Instagram post about AI in business.

Main message: "AI is transforming how we work"
Stats to highlight:
- 40% productivity increase
- 24/7 automation
- Real-time insights

Visual style: Bold typography, gradient background (purple to blue)
CTA: "Learn more → link in bio"
```

### Business Card
```
Content Query:
Professional business card for tech startup founder.

Name: John Doe
Title: Founder & CEO
Company: TechVision AI
Email: john@techvision.ai
Phone: (555) 987-6543
Website: techvision.ai

Style: Modern, minimalist, tech-focused
Colors: Navy blue and electric blue accent
Logo: Use clean sans-serif typography
```

## 💡 Tips para Mejores Resultados

### ✅ DO:
- **Sé específico**: Incluye títulos exactos, bullets, datos concretos
- **Describe visuales**: "Gráfico de barras de ventas 2023-2025" vs "gráfico"
- **Proporciona datos**: Números reales, fuentes, ejemplos específicos
- **Define estilo**: Colores, tipografía, mood (profesional, moderno, etc.)
- **Usa Brand Kit**: Agrega `brand_kit_id` para diseños con tu marca

### ❌ DON'T:
- Queries vagos: "Create a presentation about business"
- Placeholders: "[Insert content here]", "TBD", "[Your company]"
- Sin estructura: Texto en párrafos largos sin secciones
- Sin visuales: No especificar qué tipo de gráficos/imágenes
- Demasiado breve: Queries de 1-2 líneas para presentaciones

## 🔧 Troubleshooting

### Error: "Common queries will not be generated"
**Solución**: Tu query es demasiado vago. Agrega más detalles específicos.

### Error: "Design generation failed"
**Solución**: 
1. Verifica que tu token de OAuth es válido
2. Revisa que el `design_type` es válido
3. Simplifica tu query si es muy complejo

### PDF vacío o incompleto
**Solución**: 
1. Verifica que el `design_id` es correcto
2. Usa `export_quality: "pro"` para mejor calidad
3. Espera unos segundos antes de descargar (la exportación puede tardar)

## 📦 Tipos de Diseño Disponibles

| Tipo | Uso | Formato Exportable |
|------|-----|-------------------|
| `presentation` | Presentaciones completas | PDF, PPTX |
| `doc` | Documentos profesionales | PDF |
| `poster` | Posters promocionales | PDF, PNG, JPG |
| `flyer` | Volantes | PDF, PNG, JPG |
| `instagram_post` | Posts cuadrados | PNG, JPG |
| `business_card` | Tarjetas de presentación | PDF, PNG |
| `logo` | Logos | PNG, SVG |
| `whiteboard` | Diagramas y brainstorming | PDF, PNG |

## 🎨 Usar Brand Kits (Diseños con Marca)

1. Lista tus brand kits disponibles:
```javascript
// Operación: List Brand Kits
// No requiere parámetros
```

2. Usa el `brand_kit_id` en Generate Design:
```javascript
{
  "design_type": "presentation",
  "content_query": "...",
  "brand_kit_id": "ABC123xyz"  // Tu brand kit
}
```

Esto aplicará automáticamente:
- ✅ Paleta de colores corporativa
- ✅ Tipografías de marca
- ✅ Logos y assets
- ✅ Estilos definidos

## 📚 Recursos Adicionales

- [Canva MCP Documentation](https://www.canva.dev/docs/mcp/)
- [Workflow de Ejemplo](./ai-design-to-pdf-workflow.json)
- [n8n Documentation](https://docs.n8n.io)

---

**¿Preguntas?** Abre un issue en GitHub: [n8n-nodes-canva-improved](https://github.com/0xAF00/n8n-nodes-canva-improved)
