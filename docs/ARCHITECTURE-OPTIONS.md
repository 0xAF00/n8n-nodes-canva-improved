# Arquitectura: n8n + Canva REST API (Sin MCP)

## Flujo con Brand Templates + Autofill

```
┌─────────────────────────────────────────────────────────┐
│ 1. Usuario trigger workflow en n8n                     │
│    Input: tema, audiencia, estructura                  │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Nodo AI (GPT/Claude) prepara contenido              │
│    Output: JSON con contenido estructurado             │
│    {                                                    │
│      "slides": [                                        │
│        {"title": "...", "content": "...", "image": ""} │
│      ]                                                  │
│    }                                                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Nodo Canva: brandTemplates.search                   │
│    Encuentra template predefinido                      │
│    Output: brand_template_id                           │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Nodo Canva: autofill.create (NO IMPLEMENTADO AÚN)  │
│    Envía datos del paso 2 para rellenar template       │
│    Output: autofill_job_id                             │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Nodo Canva: autofill.getJob                         │
│    Espera hasta que job esté completo                  │
│    Output: design_id del resultado                     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Nodo Canva: exports.createJob                       │
│    Exporta a PDF Pro quality                           │
│    Output: export_job_id                               │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Nodo Canva: exports.getJob                          │
│    Obtiene URL de descarga                             │
│    Output: pdf_url                                     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 8. Enviar notificación/guardar/publicar                │
└─────────────────────────────────────────────────────────┘
```

## Requisitos Previos

### 1. Crear Brand Templates en Canva (Manual, una vez)

1. Entra a Canva → Crea una presentación
2. Diseña slides con tu estructura típica (cover, content, CTA)
3. Marca campos como "auto-fillable":
   - Títulos de slides
   - Bloques de texto
   - Placeholders de imágenes
4. Guarda como Brand Template
5. Copia el `brand_template_id`

### 2. Agregar operaciones de Autofill al nodo

Actualmente tu nodo NO tiene las operaciones de autofill.
Necesitas agregar:

- `autofill.create` - Crear job de autofill
- `autofill.getJob` - Obtener status del job
- `brandTemplates.search` - Buscar templates disponibles
- `brandTemplates.get` - Obtener detalles de template

## ¿Quieres que agregue estas operaciones al nodo?

Si dices que sí, agregaré:

1. Resource "Autofill" con operaciones create/get
2. Resource "Brand Templates" con operaciones search/get
3. Parámetros para mapear datos a campos del template
4. Documentación de uso

Esto te permitirá usar n8n con REST API (sin MCP) para generar PDFs con contenido.

## Comparación de Opciones

| Característica | MCP (AI Agent) | REST + Autofill | MCP Bridge API |
|----------------|----------------|-----------------|----------------|
| Facilidad setup | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Contenido dinámico | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Automatización | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Diseño calidad | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Costo/complejidad | Bajo | Medio | Alto |
| Requiere templates | No | Sí | No |
| Funciona en n8n | No | Sí | Sí (con bridge) |

## Recomendación por Caso de Uso

### Caso 1: "Quiero generar infoproductos conversando con AI"
→ **Usa MCP directamente** (PRESET-BUSINESS-MCP.txt en AI Agent)

### Caso 2: "Quiero workflow 100% automatizado en n8n"
→ **Usa REST + Autofill** (necesito agregar al nodo)

### Caso 3: "Quiero trigger automático pero con calidad IA"
→ **Usa MCP Bridge** (servidor intermedio que creé arriba)
