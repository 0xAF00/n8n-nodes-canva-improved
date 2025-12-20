# 🤖 Usar Canva con Agentes de IA en n8n

## 📋 Cómo Funciona

El servidor MCP de Canva (`https://mcp.canva.com`) ya está listo para usar. Solo necesitas:

1. **Obtener access_token** con el nodo Canva MCP Auth
2. **Configurar el agente** para conectarse al servidor de Canva
3. **El agente usa las herramientas** directamente

## 🚀 Configuración en n8n

### Paso 1: Workflow Base

```
[Canva MCP Auth] → [AI Agent con MCP Tool]
```

### Paso 2: Obtener Access Token

**Nodo: Canva MCP Auth**
- Ejecuta autenticación OAuth
- Output: `{ "access_token": "eyJ0...", "refresh_token": "...", ... }`
- Copia el `access_token` que necesitarás en el siguiente paso

### Paso 3: Configurar MCP Tool en AI Agent

En tu nodo **AI Agent**:

1. **Tools** → Add Tool → **MCP Tool**

2. **MCP Server Settings**:
   - **URL**: `https://mcp.canva.com/sse`
   - **Transport**: `SSE` (Server-Sent Events)

3. **Authentication**: Selecciona **Bearer Auth**
   - **Token**: Pega el `access_token` del nodo Canva MCP Auth
   
   O si quieres que sea dinámico (desde el workflow):
   - **Token**: `={{ $('Canva MCP Auth').item.json.access_token }}`

4. El agente ahora tiene acceso automático a todas las herramientas de Canva

### Alternativa: Usar Header Auth

Si no ves Bearer Auth, usa **Header Auth**:

1. **Authentication**: Selecciona **Header Auth**
2. **Credential**:
   - **Header Name**: `Authorization`
   - **Header Value**: `Bearer TU_ACCESS_TOKEN_AQUI`
   
   O dinámico:
   - **Header Value**: `=Bearer {{ $('Canva MCP Auth').item.json.access_token }}`

## 🛠️ Herramientas Disponibles Automáticamente

Una vez conectado, el agente tiene acceso a:

- ✅ `generate-design` - Generar diseños con IA
- ✅ `create-design-from-candidate` - Convertir candidato a diseño editable
- ✅ `export-design` - Exportar a PDF, PNG, etc.
- ✅ `search-designs` - Buscar diseños existentes
- ✅ `get-design` - Obtener info de diseño
- ✅ `list-brand-kits` - Listar brand kits

## 💬 Ejemplos de Prompts

### Ejemplo 1: Presentación Completa (Recomendado)

```
IMPORTANTE: Debes llamar a la herramienta generate-design con estos parámetros OBLIGATORIOS:
- design_type: "presentation"
- query: Un string con TODO el contenido detallado de la presentación

Crea una presentación profesional sobre "IA en Negocios" con estos requisitos:

**Presentation Brief**
Title: AI-Powered Business Strategy
Topic: Cómo la inteligencia artificial transforma operaciones empresariales

**Slide Plan**

Slide 1 — "AI-Powered Business Strategy"
Goal: Captar atención con estadística impactante
Bullets:
- Transforma tu negocio con automatización inteligente
- Decisiones basadas en datos en tiempo real
- ROI comprobado en múltiples industrias
Visuals: Imagen de dashboard futurista con gráficos de IA
Data: "30-40% reducción de costos operativos"

Slide 2 — "El Desafío Actual"
Goal: Establecer el problema que IA resuelve
Bullets:
- Procesos manuales consumen 60% del tiempo del equipo
- Retrasos en decisiones por silos de datos
- Errores humanos cuestan $500K-$2M anualmente
- Presión competitiva en aumento
Visuals: Comparación split-screen: workflow manual caótico vs sistema IA optimizado

[... continuar con slides 3-6 ...]

Usa design_type: "presentation"
Si hay brand kit disponible, úsalo.
Al finalizar, exporta como PDF en calidad PRO tamaño A4.
```

### Ejemplo 2: Prompt Simplificado (Para Testing)

```
Usa la herramienta generate-design con estos parámetros exactos:

design_type: "presentation"

query: "**Presentation Brief**
Title: IA en Negocios
Topic: Transformación digital con inteligencia artificial

**Slide Plan**

Slide 1 — Título Principal
Goal: Introducir el tema
Bullets:
- IA transforma operaciones
- Reduce costos 30-40%
- Mejora toma de decisiones
Visuals: Dashboard moderno con gráficos

Slide 2 — Beneficios Clave
Goal: Mostrar ventajas
Bullets:
- Automatización de procesos
- Análisis predictivo
- Atención 24/7
Visuals: Íconos de beneficios

Slide 3 — Casos de Éxito
Goal: Credibilidad con ejemplos
Bullets:
- Empresa A: 35% reducción costos
- Empresa B: 50% más rápido
- Empresa C: 90% precisión
Visuals: Gráfico de barras comparativo"

Luego toma el primer candidato (candidate_id del resultado), conviértelo a diseño con create-design-from-candidate, y finalmente exporta como PDF con export-design.
```

### Ejemplo 3: Poster Simple

```
Llama a generate-design con:
- design_type: "poster"
- query: "Poster moderno para cafetería. Título: Fresh Coffee Daily. Subtítulo: Granos artesanales de Colombia. Horario: Lun-Vie 7AM-6PM. Visual: Taza de café con latte art. Colores cálidos marrón y crema."

Después convierte el primer candidato y expórtalo como PDF.
```

### Ejemplo 4: Instagram Post

```
Genera un Instagram post usando generate-design:
- design_type: "instagram_post"
- query: "Post sobre IA en negocios. Mensaje principal: IA aumenta productividad 40%. Stats: 24/7 disponible, tiempo real, automatización. Estilo: tipografía bold, gradiente púrpura a azul, moderno."

Convierte y exporta como PNG.
```

## 🔄 Flujo Completo del Agente

El agente ejecutará automáticamente:

1. **`generate-design`**
   ```javascript
   {
     "design_type": "presentation",
     "query": "contenido detallado..."
   }
   ```
   → Recibe `job_id` y lista de `candidates`

2. **`create-design-from-candidate`**
   ```javascript
   {
     "job_id": "abc123",
     "candidate_id": "xyz789"
   }
   ```
   → Recibe `design_id`

3. **`export-design`**
   ```javascript
   {
     "design_id": "DAF123abc",
     "format": {
       "type": "pdf",
       "export_quality": "pro",
       "size": "a4"
     }
   }
   ```
   → Recibe URL de descarga

4. **Agente responde** con la URL del PDF generado

## 📦 Workflow Completo de Ejemplo

```json
{
  "name": "Generación de Presentación con IA",
  "nodes": [
    {
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "parameters": {}
    },
    {
      "name": "Set Topic",
      "type": "n8n-nodes-base.set",
      "parameters": {
        "values": {
          "string": [
            {
              "name": "topic",
              "value": "IA en Marketing Digital"
            }
          ]
        }
      }
    },
    {
      "name": "Canva MCP Auth",
      "type": "n8n-nodes-canva-improved.canvaMcpAuth",
      "parameters": {
        "mcpServerUrl": "https://mcp.canva.com"
      }
    },
    {
      "name": "AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "parameters": {
        "text": "=Crea una presentación profesional sobre {{ $('Set Topic').item.json.topic }} con 6 slides detallados. Usa el formato de Presentation Brief con títulos exactos, bullets específicos, y descripciones de visuales. Exporta como PDF en calidad PRO.",
        "options": {
          "mcpServers": [
            {
              "name": "canva",
              "url": "https://mcp.canva.com/sse",
              "transport": "sse",
              "headers": {
                "Authorization": "=Bearer {{ $('Canva MCP Auth').item.json.access_token }}"
              }
            }
          ]
        }
      }
    }
  ]
}
```

## 🔧 Troubleshooting

### Error: "Invalid arguments for tool generate-design: query Required"
**Causa**: El agente no está pasando el parámetro `query` correctamente
**Solución**: 
1. Sé muy específico en tu prompt: "Usa generate-design con design_type: 'presentation' y query: '...'"
2. Dale el contenido completo en el prompt, no esperes que el agente lo genere
3. Ejemplo de prompt correcto:
   ```
   Llama a generate-design con estos parámetros EXACTOS:
   design_type: "poster"
   query: "Poster de cafetería. Título: Fresh Coffee. Horario: 7AM-6PM. Visual: taza con latte art."
   ```

### Error: "Unauthorized" o "401"
**Causa**: Token inválido o expirado
**Solución**: Re-ejecuta el nodo Canva MCP Auth para obtener un token fresco

### Error: "Server not reachable"
**Causa**: URL incorrecta o problemas de red
**Solución**: Verifica que la URL sea `https://mcp.canva.com/sse` (con `/sse`)

### El agente llama a la herramienta pero falla
**Causa**: Parámetros incorrectos o faltantes
**Solución**: 
1. Especifica TODOS los parámetros requeridos en tu prompt
2. Para `generate-design`: `design_type` y `query` son OBLIGATORIOS
3. Para `create-design-from-candidate`: `job_id` y `candidate_id` son OBLIGATORIOS
4. Para `export-design`: `design_id` y `format.type` son OBLIGATORIOS

### Error: "Common queries will not be generated"
**Causa**: El `query` es demasiado vago
**Solución**: Proporciona contenido MUY detallado con el formato Presentation Brief (títulos exactos, bullets, visuales, datos)

## 📚 Recursos

- [Guía Completa de Generación con IA](./GUIDE_AI_DESIGN.md)
- [Canva MCP Documentation](https://www.canva.dev/docs/mcp/)
- [n8n AI Agents](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/)

---

**Lo importante**: NO necesitas crear ningún servidor. Canva ya lo provee en `https://mcp.canva.com`. Solo conecta tu agente con el token de autenticación. 🎉
