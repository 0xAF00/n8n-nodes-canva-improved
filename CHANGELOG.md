# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

## [2.1.0] - 2025-12-17

### 🎯 Mejoras Principales

#### Actualización completa de la API de Canva
- ✅ Implementación de las últimas especificaciones de la API de Canva Connect (Diciembre 2025)
- ✅ Endpoints actualizados y simplificados
- ✅ Mejor estructura de requests y responses

#### Tipos de Design actualizados
- ✅ Solo tipos oficialmente soportados: `doc`, `whiteboard`, `presentation`
- ❌ Eliminados tipos genéricos no soportados por la API actual
- ✅ Estructura simplificada para crear designs

#### Sistema de Exportación mejorado
- ✅ Nuevo formato de exportación con objeto `format` estructurado
- ✅ Soporte para calidades `regular` y `pro`
- ✅ Soporte para tamaños de papel PDF (a4, a3, letter, legal)
- ✅ Exportación de páginas específicas
- ✅ Formatos soportados: PDF, JPG, PNG, GIF, PPTX, MP4

#### Autenticación
- ✅ OAuth 2.0 con PKCE (más seguro)
- ✅ Gestión automática de tokens por n8n
- ✅ Mejor manejo de errores de autenticación

### 📋 Cambios Detallados

#### Modificado
- **API Create Design**: Ahora usa la estructura `design_type: { type: 'preset', name: '...' }`
- **API Update Design**: Cambiado de método POST a PATCH
- **Export Format**: Nuevo objeto estructurado con `type`, `export_quality`, `size`, etc.
- **Export Quality**: Cambiado de `low/medium/high` a `regular/pro`

#### Agregado
- Paper size para exportación de PDF (solo para Canva Docs)
- Soporte para exportar páginas específicas
- Mejor documentación con ejemplos actualizados
- Tabla comparativa con versión anterior

#### Eliminado
- Tipos de design no oficiales (30+ tipos genéricos)
- Parámetros obsoletos de exportación
- Endpoints deprecados

### 🐛 Correcciones

- Corregido error de autenticación con scopes
- Mejorado manejo de errores en exportación
- Corregida estructura de body en create design

### 📚 Documentación

- README completamente reescrito
- Ejemplos actualizados con la nueva API
- Sección de solución de problemas ampliada
- Tabla de diferencias con versión anterior

### ⚠️ Breaking Changes

Si vienes de la versión anterior, ten en cuenta:

1. **Tipos de Design**: Solo `doc`, `whiteboard`, `presentation` están soportados
2. **Método Update**: Ahora usa PATCH en lugar de POST
3. **Export Format**: Nueva estructura de objeto `format`
4. **Export Quality**: Usa `regular` o `pro` en lugar de `low/medium/high`

### 🔄 Migración desde versión anterior

Para migrar tus workflows existentes:

1. **Actualiza los tipos de design** en nodos "Create Design"
   - Antes: `instagram_post`, `facebook_post`, etc.
   - Ahora: `doc`, `whiteboard`, `presentation`

2. **Actualiza los parámetros de exportación**
   - Antes: `quality: 'high'`
   - Ahora: `exportQuality: 'pro'`

3. **Reconfigura tus credenciales**
   - Elimina las credenciales antiguas
   - Crea nuevas credenciales con OAuth 2.0
   - Asegúrate de habilitar todos los scopes en Canva

## [2.0.0] - Versión anterior (ramonmatias19)

La versión 2.0.0 del repositorio original incluía:
- Cobertura completa de la API de Canva
- 30+ tipos de design
- Múltiples operaciones (Assets, Autofill, Comments, etc.)
- OAuth 2.0 básico

---

**Nota**: Esta versión mejorada se enfoca en simplicidad, claridad y alineación con la documentación oficial de Canva API.
