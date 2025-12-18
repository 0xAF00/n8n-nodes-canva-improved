# 🧪 Testing Guide

Guía para probar el nodo de Canva localmente antes de publicarlo.

## 🔧 Configuración Inicial

### 1. Preparar el entorno

```bash
# Clonar o navegar al proyecto
cd n8n-nodes-canva-improved

# Instalar dependencias
npm install

# Compilar
npm run build
```

### 2. Enlazar localmente con n8n

```bash
# En el directorio del proyecto
npm link

# Verificar el enlace
npm list -g n8n-nodes-canva-improved
```

### 3. Instalar en n8n

```bash
# Navegar al directorio de n8n custom nodes
cd ~/.n8n/custom

# Enlazar el nodo
npm link n8n-nodes-canva-improved

# O copiar manualmente
cp -r /ruta/al/proyecto/dist/* ~/.n8n/custom/
```

### 4. Reiniciar n8n

```bash
# Detener n8n si está corriendo
pkill n8n

# Iniciar en modo desarrollo
n8n start
```

## ✅ Checklist de Testing

### Testing Básico

- [ ] El nodo aparece en la lista de nodos de n8n
- [ ] El icono se muestra correctamente
- [ ] Las credenciales OAuth funcionan
- [ ] Se puede autorizar la cuenta de Canva

### Testing de Operaciones - Designs

#### Create Design
- [ ] Crear doc: ✅ Success
- [ ] Crear whiteboard: ✅ Success
- [ ] Crear presentation: ✅ Success
- [ ] Con título: ✅ Success
- [ ] Sin título: ✅ Success
- [ ] Con asset_id: ✅ Success

**Comando de prueba:**
```bash
curl -X POST https://api.canva.com/rest/v1/designs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "design_type": {
      "type": "preset",
      "name": "doc"
    },
    "title": "Test Document"
  }'
```

#### Get Design
- [ ] Con design_id válido: ✅ Success
- [ ] Con design_id inválido: ❌ Error esperado

#### List Designs
- [ ] Lista designs: ✅ Success
- [ ] Pagination funciona: ✅ Success

#### Update Design
- [ ] Actualizar título: ✅ Success
- [ ] Con design_id inválido: ❌ Error esperado

#### Delete Design
- [ ] Eliminar design: ✅ Success
- [ ] Con design_id inválido: ❌ Error esperado

### Testing de Operaciones - Exports

#### Create Export Job
- [ ] Export a PDF: ✅ Success
- [ ] Export a JPG: ✅ Success
- [ ] Export a PNG: ✅ Success
- [ ] Export a GIF: ✅ Success
- [ ] Export a PPTX: ✅ Success
- [ ] Export a MP4: ✅ Success
- [ ] Con calidad regular: ✅ Success
- [ ] Con calidad pro: ✅ Success
- [ ] Con paper size (PDF): ✅ Success
- [ ] Con páginas específicas: ✅ Success

**Comando de prueba:**
```bash
curl -X POST https://api.canva.com/rest/v1/exports \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "design_id": "YOUR_DESIGN_ID",
    "format": {
      "type": "pdf",
      "export_quality": "regular",
      "size": "a4"
    }
  }'
```

#### Get Export Job
- [ ] Verificar estado in_progress: ✅ Success
- [ ] Verificar estado success: ✅ Success
- [ ] Obtener URL de descarga: ✅ Success

### Testing de Operaciones - Folders

#### Create Folder
- [ ] Crear folder raíz: ✅ Success
- [ ] Crear subfolder: ✅ Success

#### List Folders
- [ ] Listar folders: ✅ Success

#### Get Folder
- [ ] Obtener info de folder: ✅ Success

#### List Folder Items
- [ ] Listar items: ✅ Success

### Testing de Operaciones - Users

#### Get Profile
- [ ] Obtener perfil de usuario: ✅ Success

## 🐛 Testing de Errores

### Credenciales
- [ ] Sin credenciales: ❌ Error esperado
- [ ] Token expirado: ❌ Error esperado, auto-refresh
- [ ] Scope faltante: ❌ Error esperado

### Parámetros
- [ ] Design ID vacío: ❌ Error esperado
- [ ] Tipo de design inválido: ❌ Error esperado
- [ ] Formato de export inválido: ❌ Error esperado

### Rate Limiting
- [ ] Más de 20 requests/min: ❌ Rate limit esperado

## 📝 Testing Manual en n8n

### Workflow de Prueba 1: Create & Export

```
1. Nodo: Canva - Create Design
   - Type: doc
   - Title: Test Document

2. Nodo: Code
   - Extraer design_id del response

3. Nodo: Canva - Create Export Job
   - Design ID: {{ $('Code').item.json.design_id }}
   - Format: pdf
   - Quality: regular

4. Nodo: Wait (30 segundos)

5. Nodo: Canva - Get Export Job
   - Export Job ID: {{ $('Canva1').item.json.job.id }}

6. Verificar: URLs de descarga en el output
```

### Workflow de Prueba 2: List & Get

```
1. Nodo: Canva - List Designs

2. Nodo: Code
   - Extraer primer design_id

3. Nodo: Canva - Get Design
   - Design ID: {{ $('Code').item.json.first_id }}

4. Verificar: Información completa del design
```

## 🔍 Verificación de Respuestas

### Response de Create Design debe incluir:
```json
{
  "design": {
    "id": "DAFVztcvd9z",
    "title": "Test Document",
    "owner": {
      "user_id": "...",
      "team_id": "..."
    },
    "urls": {
      "edit_url": "...",
      "view_url": "..."
    },
    "created_at": 1234567890,
    "updated_at": 1234567890
  }
}
```

### Response de Create Export Job debe incluir:
```json
{
  "job": {
    "id": "e08861ae-3b29-45db-8dc1-1fe0bf7f1cc8",
    "status": "in_progress"
  }
}
```

### Response de Get Export Job (completado) debe incluir:
```json
{
  "job": {
    "id": "e08861ae-3b29-45db-8dc1-1fe0bf7f1cc8",
    "status": "success",
    "urls": [
      "https://export-download.canva.com/..."
    ]
  }
}
```

## 🚀 Automatización de Tests

### Script de testing básico

```bash
#!/bin/bash
# test.sh

echo "🧪 Testing Canva Node..."

# Test 1: Compilación
echo "1️⃣ Compilando..."
npm run build
if [ $? -eq 0 ]; then
  echo "✅ Compilación exitosa"
else
  echo "❌ Error en compilación"
  exit 1
fi

# Test 2: Lint
echo "2️⃣ Ejecutando lint..."
npm run lint
if [ $? -eq 0 ]; then
  echo "✅ Lint exitoso"
else
  echo "❌ Error en lint"
  exit 1
fi

# Test 3: Verificar archivos necesarios
echo "3️⃣ Verificando archivos..."
files=(
  "dist/nodes/Canva/Canva.node.js"
  "dist/credentials/CanvaApi.credentials.js"
  "dist/nodes/Canva/canva.svg"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file existe"
  else
    echo "❌ $file NO existe"
    exit 1
  fi
done

echo "🎉 Todos los tests básicos pasaron!"
```

### Ejecutar tests

```bash
chmod +x test.sh
./test.sh
```

## 📊 Registro de Tests

Mantén un registro de los tests ejecutados:

| Fecha | Versión | Tests Pasados | Tests Fallidos | Notas |
|-------|---------|---------------|----------------|-------|
| 2025-12-17 | 2.1.0 | 25 | 0 | Release inicial |

## 💡 Tips de Testing

1. **Usa una cuenta de prueba** en Canva para testing
2. **No uses datos de producción** durante el desarrollo
3. **Verifica los rate limits** (20 requests/min)
4. **Prueba tanto casos exitosos como errores**
5. **Verifica que los exports se completen** antes de marcar como exitoso
6. **Documenta cualquier comportamiento inesperado**

## 🔗 Recursos Útiles

- [Canva API Testing](https://www.canva.dev/docs/connect/getting-started/)
- [n8n Node Testing](https://docs.n8n.io/integrations/creating-nodes/test/)
- [Postman Collection](https://www.postman.com/canva-dev)

---

**Recuerda**: Un nodo bien testeado es un nodo confiable! 🎯
