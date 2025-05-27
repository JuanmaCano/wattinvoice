# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Estructura del Proyecto

Este documento describe la organización y estructura del proyecto para mantener consistencia en el desarrollo.

## Estructura de Directorios

```
src/
├── api/           # Backend y endpoints
│   ├── handlers/  # Manejadores de endpoints
│   ├── services/  # Servicios y lógica de negocio
│   └── server.js  # Configuración del servidor
│
├── components/    # Componentes React
│   ├── auth/      # Componentes de autenticación
│   ├── layout/    # Componentes de layout
│   ├── profile/   # Componentes de perfil
│   └── ui/        # Componentes de UI reutilizables
│
├── config/        # Configuración y constantes
│   └── constants.js  # Constantes globales
│
├── contexts/      # Contextos de React
│   └── AuthContext.js  # Contexto de autenticación
│
├── lib/          # Bibliotecas y clientes externos
│   └── supabase.js    # Cliente de Supabase
│
└── utils/        # Utilidades y helpers
    ├── calculateInvoice.js  # Cálculos de facturación
    ├── encryption.js        # Utilidades de encriptación
    ├── jwt.js              # Manejo de tokens JWT
    └── validation.js       # Funciones de validación
```

## Criterios de Organización

### `/api`

- Contiene todo el código relacionado con el backend
- `handlers/`: Manejadores de endpoints HTTP
- `services/`: Lógica de negocio y servicios
- `server.js`: Configuración y arranque del servidor

### `/components`

- Componentes de React organizados por dominio
- `auth/`: Componentes relacionados con autenticación
- `layout/`: Componentes de estructura (Header, Layout, etc.)
- `profile/`: Componentes relacionados con el perfil de usuario
- `ui/`: Componentes reutilizables (Toast, botones, etc.)

### `/config`

- Archivos de configuración y constantes
- Variables de entorno y claves
- Configuraciones globales

### `/contexts`

- Contextos de React para estado global
- Cada contexto en su propio archivo
- Nombrado con sufijo `Context.js`

### `/lib`

- Clientes y bibliotecas externas
- Configuración de servicios de terceros
- Adaptadores para APIs externas

### `/utils`

- Funciones de utilidad y helpers
- Funciones puras sin efectos secundarios
- Código reutilizable entre componentes

## Convenciones de Nombrado

- **Archivos de Componentes**: PascalCase (ej: `ProfileForm.jsx`)
- **Utilidades y Helpers**: camelCase (ej: `calculateInvoice.js`)
- **Contextos**: PascalCase con sufijo Context (ej: `AuthContext.js`)
- **Servicios**: camelCase (ej: `datadis.js`)
- **Handlers**: camelCase con sufijo Handler (ej: `datadisLoginHandler.js`)

## Estilos y Formato

- Usar ESLint y Prettier para consistencia
- Seguir las guías de estilo de React
- Mantener componentes pequeños y enfocados
- Documentar props y tipos cuando sea necesario

## Buenas Prácticas

1. **Componentes**:

   - Mantener componentes pequeños y reutilizables
   - Separar lógica de presentación
   - Usar hooks personalizados para lógica compleja

2. **Utilidades**:

   - Funciones puras cuando sea posible
   - Documentar parámetros y retornos
   - Mantener funciones enfocadas en una sola responsabilidad

3. **Estado**:

   - Usar contextos para estado global
   - Estado local en componentes cuando sea posible
   - Evitar prop drilling

4. **API**:

   - Separar lógica de negocio de handlers
   - Manejar errores consistentemente
   - Documentar endpoints

5. **Seguridad**:
   - No exponer claves en el código
   - Usar variables de entorno
   - Validar inputs
   - Encriptar datos sensibles
