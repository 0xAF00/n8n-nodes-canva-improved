# n8n-nodes-canva-improved

[![NPM Version](https://img.shields.io/npm/v/n8n-nodes-canva-improved)](https://www.npmjs.com/package/n8n-nodes-canva-improved)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Nodo mejorado de n8n para Canva Connect API con las últimas especificaciones de la API

Este es un nodo de comunidad de n8n que te permite integrar Canva en tus flujos de trabajo de n8n, utilizando las últimas especificaciones de la API oficial de Canva Connect.

## 🎯 Características Principales

### ✅ Mejoras sobre la versión anterior

- **API actualizada**: Implementa las últimas especificaciones de la API de Canva (Diciembre 2025)
- **OAuth 2.0 con PKCE**: Autenticación segura y moderna
- **Endpoints simplificados**: Rutas más limpias y consistentes
- **Mejor manejo de errores**: Respuestas más claras y útiles
- **Tipos de design actualizados**: Solo los tipos oficialmente soportados (doc, whiteboard, presentation)
- **Formato de exportación mejorado**: Estructura actualizada para PDF, JPG, PNG, GIF, PPTX, MP4

### 📦 Recursos Soportados

#### 🎨 Designs
- ✅ **Create**: Crear nuevos designs con tipos actualizados
- ✅ **Get**: Obtener información de un design específico
- ✅ **List**: Listar todos tus designs
- ✅ **Update**: Actualizar el título de un design
- ✅ **Delete**: Eliminar un design

**Tipos de Design Soportados:**
- `doc`: Documentos de Canva
- `whiteboard`: Pizarras colaborativas
- `presentation`: Presentaciones

#### 📤 Exports
- ✅ **Create Export Job**: Crear trabajos de exportación asíncronos
- ✅ **Get Export Job**: Verificar el estado de exportación

**Formatos de Exportación:**
- PDF (con opciones de tamaño de papel)
- JPG
- PNG
- GIF
- PPTX (PowerPoint)
- MP4 (Video)

**Calidades de Exportación:**
- `regular`: Calidad estándar
- `pro`: Calidad premium (requiere plan Canva Pro)

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
app:read
app:write
asset:read
asset:write
brandtemplate:content:read
brandtemplate:meta:read
comment:read
comment:write
design:content:read
design:content:write
design:meta:read
design:permission:read
design:permission:write
folder:read
folder:write
folder:permission:read
folder:permission:write
profile:read
```

Si falta algún scope, recibirás el error `"invalid_scope"`.

### Paso 4: Configurar en n8n

1. En n8n, crea una nueva credencial "Canva API"
2. Ingresa el **Client ID** de tu integración de Canva
3. Ingresa el **Client Secret** de tu integración
4. Haz clic en **"Connect my account"**
5. Autoriza la aplicación en la ventana de Canva
6. ✅ ¡Listo! n8n gestionará automáticamente los tokens

## 💡 Ejemplos de Uso

### Ejemplo 1: Crear un documento de Canva

```json
{
  "resource": "designs",
  "operation": "create",
  "designType": "doc",
  "title": "Mi nuevo documento"
}
```

### Ejemplo 2: Exportar un design a PDF

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

### Ejemplo 3: Verificar el estado de exportación

```json
{
  "resource": "exports",
  "operation": "getJob",
  "exportJobId": "e08861ae-3b29-45db-8dc1-1fe0bf7f1cc8"
}
```

### Ejemplo 4: Listar todos los designs

```json
{
  "resource": "designs",
  "operation": "list"
}
```

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

1. Abre un [issue](https://github.com/yourusername/n8n-nodes-canva-improved/issues)
2. Fork el repositorio
3. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
4. Commit tus cambios (`git commit -m 'Add amazing feature'`)
5. Push a la rama (`git push origin feature/amazing-feature`)
6. Abre un Pull Request

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
