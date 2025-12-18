# Guía de Desarrollo

Esta guía te ayudará a desarrollar y mejorar el nodo de Canva para n8n.

## 🛠️ Configuración del Entorno

### Requisitos previos

- Node.js 18.10.0 o superior
- npm o yarn
- n8n instalado localmente (para testing)

### Instalación para desarrollo

```bash
# Clona el repositorio
git clone https://github.com/yourusername/n8n-nodes-canva-improved.git
cd n8n-nodes-canva-improved

# Instala las dependencias
npm install

# Compila el proyecto
npm run build

# Observa cambios (modo desarrollo)
npm run dev
```

## 📁 Estructura del Proyecto

```
n8n-nodes-canva-improved/
├── credentials/
│   └── CanvaApi.credentials.ts    # Configuración de OAuth 2.0
├── nodes/
│   └── Canva/
│       ├── Canva.node.ts          # Nodo principal
│       └── canva.svg              # Icono del nodo
├── dist/                          # Archivos compilados
├── .eslintrc.js                   # Configuración de ESLint
├── .gitignore                     # Archivos ignorados por Git
├── CHANGELOG.md                   # Registro de cambios
├── gulpfile.js                    # Tareas de Gulp
├── LICENSE                        # Licencia MIT
├── package.json                   # Dependencias y scripts
├── README.md                      # Documentación principal
└── tsconfig.json                  # Configuración de TypeScript
```

## 🔨 Scripts Disponibles

```bash
# Compilar el proyecto
npm run build

# Modo desarrollo (watch)
npm run dev

# Formatear código
npm run format

# Lint (verificar código)
npm run lint

# Fix lint automático
npm run lintfix
```

## 🧪 Testing Local

### 1. Enlazar el nodo localmente

```bash
# En el directorio del proyecto
npm link

# En el directorio de n8n
cd ~/.n8n/nodes
npm link n8n-nodes-canva-improved
```

### 2. Reiniciar n8n

```bash
n8n start
```

### 3. Probar el nodo

1. Abre n8n en tu navegador
2. Crea un nuevo workflow
3. Busca "Canva" en los nodos
4. Configura las credenciales
5. Prueba las diferentes operaciones

## 📝 Agregar Nuevas Operaciones

### Paso 1: Agregar la operación en el nodo

Edita `nodes/Canva/Canva.node.ts`:

```typescript
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['designs'],
    },
  },
  options: [
    // ... operaciones existentes
    {
      name: 'Nueva Operación',
      value: 'newOperation',
      action: 'Nueva operación',
      description: 'Descripción de la nueva operación',
      routing: {
        request: {
          method: 'GET',
          url: '/nueva-ruta',
        },
      },
    },
  ],
}
```

### Paso 2: Agregar parámetros necesarios

```typescript
{
  displayName: 'Nuevo Parámetro',
  name: 'newParam',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['designs'],
      operation: ['newOperation'],
    },
  },
  default: '',
  description: 'Descripción del parámetro',
}
```

### Paso 3: Implementar la lógica en execute()

```typescript
async execute(this: any): Promise<any> {
  // ...código existente...
  
  if (resource === 'designs') {
    if (operation === 'newOperation') {
      const param = this.getNodeParameter('newParam', i) as string;
      responseData = await this.helpers.httpRequestWithAuthentication.call(
        this,
        'canvaApi',
        {
          method: 'GET',
          url: `https://api.canva.com/rest/v1/nueva-ruta/${param}`,
          json: true,
        },
      );
    }
  }
}
```

## 🔍 Debugging

### Console logs

```typescript
console.log('Debug info:', variable);
```

### Errores

```typescript
try {
  // código
} catch (error) {
  console.error('Error:', error);
  throw new Error(`Error en operación: ${error.message}`);
}
```

## 📚 Recursos Útiles

### Documentación n8n
- [Creating nodes](https://docs.n8n.io/integrations/creating-nodes/)
- [Node development](https://docs.n8n.io/integrations/creating-nodes/code/)
- [OAuth2 credentials](https://docs.n8n.io/integrations/creating-nodes/code/oauth2/)

### Documentación Canva
- [Canva Connect API](https://www.canva.dev/docs/connect/)
- [API Reference](https://www.canva.dev/docs/connect/api-reference/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🐛 Reporte de Bugs

Si encuentras un bug:

1. Verifica que no exista un issue similar
2. Crea un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducirlo
   - Versión de n8n y Node.js
   - Logs relevantes
   - Capturas de pantalla si aplica

## 🤝 Contribuir

### Flujo de trabajo

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios
4. Ejecuta tests: `npm run lint`
5. Commit: `git commit -m 'Add: nueva funcionalidad'`
6. Push: `git push origin feature/nueva-funcionalidad`
7. Crea un Pull Request

### Convenciones de código

- Usa TypeScript estricto
- Sigue el estilo de ESLint configurado
- Documenta funciones complejas
- Usa nombres descriptivos para variables
- Comenta código no obvio

### Commits

Usa convenciones semánticas:

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato, sin cambios de código
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

## 📋 Checklist para Pull Request

- [ ] El código compila sin errores
- [ ] Pasa los tests de lint
- [ ] La documentación está actualizada
- [ ] Los ejemplos funcionan correctamente
- [ ] Se agregó entrada en CHANGELOG.md
- [ ] El commit sigue las convenciones

## 📞 Soporte

Si necesitas ayuda:

- [GitHub Issues](https://github.com/yourusername/n8n-nodes-canva-improved/issues)
- [Comunidad n8n](https://community.n8n.io/)
- [Discord de n8n](https://discord.gg/n8n)

---

¡Gracias por contribuir! 🎉
