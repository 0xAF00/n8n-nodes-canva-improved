# 📦 Deployment Guide - Servidor BabyKoala

## ✅ Compilación Completada

El nodo ha sido compilado exitosamente. Los archivos están en la carpeta `dist/`.

## 📋 Archivos Generados

```
dist/
├── credentials/
│   ├── CanvaApi.credentials.js
│   ├── CanvaApi.credentials.js.map
│   ├── CanvaApi.credentials.d.ts
│   └── CanvaApi.credentials.d.ts.map
└── nodes/
    └── Canva/
        ├── Canva.node.js
        ├── Canva.node.js.map
        ├── Canva.node.d.ts
        ├── Canva.node.d.ts.map
        └── canva.svg
```

## 🚀 Opciones de Despliegue

### Opción 1: Instalar como paquete npm (Recomendado)

#### En tu máquina local:
```bash
# Crear paquete npm
npm pack

# Esto genera: n8n-nodes-canva-improved-2.1.0.tgz
```

#### En el servidor BabyKoala:
```bash
# Conectar via SSH
ssh usuario@servidor-babykoala

# Navegar al directorio de n8n
cd ~/.n8n

# Instalar el paquete (subir primero el .tgz)
npm install /ruta/al/n8n-nodes-canva-improved-2.1.0.tgz

# Reiniciar n8n
pm2 restart n8n
# o
systemctl restart n8n
```

### Opción 2: Copiar archivos directamente

#### Usando SCP:
```bash
# Copiar archivos compilados al servidor
scp -r dist/* usuario@servidor-babykoala:~/.n8n/custom/

# Conectar y reiniciar n8n
ssh usuario@servidor-babykoala
pm2 restart n8n
```

#### Usando SFTP:
```bash
sftp usuario@servidor-babykoala
put -r dist/* ~/.n8n/custom/
exit
```

### Opción 3: Via Git (si el servidor tiene acceso al repo)

```bash
# En el servidor
ssh usuario@servidor-babykoala
cd /tmp
git clone [tu-repositorio]
cd n8n-nodes-canva-improved
npm install
npm run build
cp -r dist/* ~/.n8n/custom/
pm2 restart n8n
```

### Opción 4: Docker (si usas contenedores)

```dockerfile
# Agregar al Dockerfile de n8n
COPY dist/ /home/node/.n8n/custom/
```

## 🔧 Configuración Post-Instalación

### 1. Verificar instalación
```bash
# En el servidor
ls -la ~/.n8n/custom/nodes/Canva/
ls -la ~/.n8n/custom/credentials/
```

### 2. Verificar permisos
```bash
chmod -R 755 ~/.n8n/custom/
```

### 3. Reiniciar n8n
```bash
# Con PM2
pm2 restart n8n

# Con systemd
sudo systemctl restart n8n

# Con Docker
docker restart n8n-container
```

### 4. Verificar en n8n UI
1. Abre n8n en el navegador
2. Crea un nuevo workflow
3. Busca "Canva" en los nodos
4. Si aparece, ¡instalación exitosa!

## 🔐 Configurar Credenciales

### 1. Crear integración en Canva
- Ve a https://www.canva.com/developers/
- Crea una nueva integración
- Guarda Client ID y Client Secret
- Configura Redirect URI: `https://tu-servidor-babykoala.com/rest/oauth2-credential/callback`

### 2. Habilitar scopes
Marca todos estos en tu integración de Canva:
```
app:read, app:write, asset:read, asset:write,
brandtemplate:content:read, brandtemplate:meta:read,
comment:read, comment:write, design:content:read,
design:content:write, design:meta:read,
design:permission:read, design:permission:write,
folder:read, folder:write, folder:permission:read,
folder:permission:write, profile:read
```

### 3. Configurar en n8n
1. Ve a Credentials
2. Click en "New Credential"
3. Busca "Canva API"
4. Ingresa Client ID y Client Secret
5. Click "Connect my account"
6. Autoriza en Canva

## 🐛 Troubleshooting

### El nodo no aparece en n8n
```bash
# Verificar que los archivos existen
ls -la ~/.n8n/custom/nodes/Canva/Canva.node.js

# Verificar logs de n8n
pm2 logs n8n
# o
journalctl -u n8n -f
```

### Error de permisos
```bash
# Ajustar permisos
chmod -R 755 ~/.n8n/custom/
chown -R n8n-user:n8n-user ~/.n8n/custom/
```

### n8n no reconoce el nodo
```bash
# Limpiar cache
rm -rf ~/.n8n/.cache/
pm2 restart n8n
```

## 📦 Script Automatizado de Despliegue

Guarda este script como `deploy-to-babykoala.sh`:

```bash
#!/bin/bash

# Configuración
SERVER="usuario@servidor-babykoala.com"
N8N_PATH="~/.n8n/custom"

echo "🚀 Desplegando nodo Canva a BabyKoala..."

# 1. Compilar
echo "📦 Compilando..."
npm run build

# 2. Crear paquete
echo "📦 Creando paquete..."
npm pack

# 3. Subir al servidor
echo "⬆️  Subiendo al servidor..."
scp n8n-nodes-canva-improved-*.tgz $SERVER:/tmp/

# 4. Instalar en servidor
echo "🔧 Instalando en servidor..."
ssh $SERVER << 'EOF'
cd ~/.n8n
npm install /tmp/n8n-nodes-canva-improved-*.tgz
rm /tmp/n8n-nodes-canva-improved-*.tgz
pm2 restart n8n
EOF

echo "✅ Despliegue completado!"
echo "🌐 Verifica en: https://tu-servidor-babykoala.com"
```

## 📊 Checklist de Despliegue

- [ ] Proyecto compilado (`npm run build`)
- [ ] Archivos en `dist/` verificados
- [ ] Paquete npm creado (`npm pack`)
- [ ] Archivos subidos al servidor
- [ ] Permisos configurados correctamente
- [ ] n8n reiniciado
- [ ] Nodo visible en n8n UI
- [ ] Credenciales configuradas
- [ ] Scopes habilitados en Canva
- [ ] Prueba de conexión exitosa
- [ ] Workflow de prueba funciona

## 🎯 Próximos Pasos

1. ✅ Compilación exitosa
2. ⏳ Subir a servidor BabyKoala
3. ⏳ Configurar credenciales
4. ⏳ Probar funcionalidad
5. ⏳ Crear workflows

---

**¿Necesitas ayuda?** Contáctame para asistencia con el despliegue.
