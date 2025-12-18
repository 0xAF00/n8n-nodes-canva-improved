# 🚀 Quick Start Guide - Nodo Canva Mejorado para n8n

## 📦 Instalación Rápida

### Opción 1: Desde n8n (Recomendado)

1. Abre n8n
2. Ve a **Settings** → **Community Nodes**
3. Click en **Install**
4. Ingresa: `n8n-nodes-canva-improved`
5. Click **Install**

### Opción 2: Línea de comandos

```bash
cd ~/.n8n
npm install n8n-nodes-canva-improved
n8n start
```

## 🔑 Configuración en 5 Minutos

### 1️⃣ Crear Integración en Canva (2 min)

1. Ve a [Canva Developer Portal](https://www.canva.com/developers/)
2. Click **"Create an integration"**
3. Guarda tu **Client ID** y **Client Secret**
4. Configura Redirect URI:
   ```
   https://tu-n8n.com/rest/oauth2-credential/callback
   ```

### 2️⃣ Habilitar Scopes (1 min)

En tu integración de Canva, marca **TODOS** estos scopes:

```
✅ app:read                    ✅ app:write
✅ asset:read                  ✅ asset:write
✅ brandtemplate:content:read  ✅ brandtemplate:meta:read
✅ comment:read                ✅ comment:write
✅ design:content:read         ✅ design:content:write
✅ design:meta:read            ✅ design:permission:read
✅ design:permission:write     ✅ folder:read
✅ folder:write                ✅ folder:permission:read
✅ folder:permission:write     ✅ profile:read
```

### 3️⃣ Configurar en n8n (2 min)

1. En n8n, crea nueva credencial **"Canva API"**
2. Pega tu **Client ID**
3. Pega tu **Client Secret**
4. Click **"Connect my account"**
5. Autoriza en Canva
6. ✅ ¡Listo!

## 🎯 Ejemplos Rápidos

### Crear un Documento

```
Nodo: Canva
Resource: Design
Operation: Create
Design Type: doc
Title: Mi primer documento
```

### Exportar a PDF

```
Nodo: Canva
Resource: Export
Operation: Create Export Job
Design ID: [ID de tu design]
Export Format: pdf
Export Quality: pro
Paper Size: a4
```

### Listar tus Designs

```
Nodo: Canva
Resource: Design
Operation: List
```

## 🆘 Solución Rápida de Problemas

| Error | Solución |
|-------|----------|
| `invalid_scope` | Habilita TODOS los scopes en Canva Developer Portal |
| `unauthorized` | Reconecta tu cuenta en las credenciales de n8n |
| `design_type not supported` | Usa solo: doc, whiteboard, o presentation |
| Export en `in_progress` | Usa "Get Export Job" para verificar cuando termine |

## 📞 ¿Necesitas Ayuda?

- 📖 [Documentación Completa](README.md)
- 🐛 [Reportar Bug](https://github.com/yourusername/n8n-nodes-canva-improved/issues)
- 💬 [Comunidad n8n](https://community.n8n.io/)

## 🎓 Siguientes Pasos

1. ✅ Lee el [README.md](README.md) completo
2. ✅ Revisa [COMPARISON.md](COMPARISON.md) si vienes de otra versión
3. ✅ Explora [CONTRIBUTING.md](CONTRIBUTING.md) si quieres contribuir

---

**¡Feliz automatización con Canva y n8n!** 🎉
