# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# WattInvoice

Aplicación web para gestionar y calcular facturas eléctricas.

## Estructura del Proyecto

```
src/
├── api/                # Backend y API
│   ├── server.js       # Configuración del servidor Express
│   ├── config.js       # Configuración global (rate limits, cors, etc.)
│   ├── datadis/        # Dominio Datadis
│   │   ├── login.js    # Endpoint POST /api/datadis/login
│   │   ├── consumption.js  # Endpoint GET /api/datadis/consumption
│   │   └── service.js  # Lógica de negocio de Datadis
│   └── utils/          # Utilidades compartidas
│       ├── errors.js   # Manejo de errores
│       └── validation.js # Validaciones comunes
├── assets/          # Recursos estáticos
├── components/      # Componentes React
│   ├── auth/        # Componentes de autenticación
│   ├── layout/      # Componentes de estructura
│   ├── profile/     # Componentes de perfil
│   └── ui/          # Componentes de interfaz reutilizables
├── contexts/        # Contextos de React
├── hooks/          # Hooks personalizados
├── lib/            # Clientes y bibliotecas externas
├── styles/         # Estilos globales
└── utils/          # Utilidades y helpers
```

## Criterios de Organización

### `/api`

La API sigue una estructura basada en dominios, donde cada dominio representa una funcionalidad específica del sistema.

#### Estructura por Dominio

- Cada dominio tiene su propia carpeta (ej: `datadis/`)
- Los archivos dentro de cada dominio siguen un patrón consistente:
  - `[endpoint].js` - Endpoints HTTP (ej: `login.js`, `consumption.js`)
  - `service.js` - Lógica de negocio del dominio

#### Convenciones de Código

1. **Configuración**:

   - Variables de entorno en `.env`
   - Configuración global en `config.js`
   - Uso de `/* eslint-disable no-undef */` para archivos que necesitan `process`

2. **Endpoints**:

   ```javascript
   import { serviceMethod } from "./service.js";
   import { validateRequired } from "../utils/validation.js";
   import { handleError } from "../utils/errors.js";

   export const handler = async (req, res) => {
     try {
       validateRequired(req.body, ["field1", "field2"]);
       const result = await serviceMethod(req.body);
       res.json(result);
     } catch (error) {
       handleError(error, res);
     }
   };
   ```

3. **Servicios**:

   ```javascript
   import { supabase } from "../config.js";

   export const serviceMethod = async (params) => {
     try {
       // Lógica de negocio
       return { success: true, data };
     } catch (error) {
       return { success: false, error: "Mensaje de error" };
     }
   };
   ```

4. **Manejo de Errores**:

   - Usar `APIError` para errores conocidos
   - Manejo centralizado con `handleError`
   - Respuestas consistentes: `{ success: boolean, error?: string, data?: any }`

5. **Validaciones**:
   - Validaciones comunes en `utils/validation.js`
   - Validaciones específicas en el servicio
   - Usar `validateRequired` para campos obligatorios

#### Buenas Prácticas

1. **Organización**:

   - Mantener la estructura plana dentro de cada dominio
   - Agrupar por funcionalidad, no por tipo de archivo
   - Evitar anidación innecesaria de carpetas

2. **Endpoints**:

   - Un archivo por endpoint
   - Nombre del archivo refleja la ruta
   - Responsable solo de HTTP (validación, request, response)

3. **Servicios**:

   - Contiene toda la lógica de negocio
   - Independiente del protocolo HTTP
   - Reutilizable entre endpoints

4. **Utilidades**:

   - Compartidas entre dominios
   - Funciones puras cuando sea posible
   - Sin dependencias de dominio específico

5. **Seguridad**:
   - No exponer claves en el código
   - Usar variables de entorno
   - Validar inputs
   - Encriptar datos sensibles

### `/components`

- Componentes de React organizados por dominio
- `auth/`: Componentes de login, registro y autenticación
- `layout/`: Componentes de estructura (Header, Layout, etc.)
- `profile/`: Componentes relacionados con el perfil de usuario
- `ui/`: Componentes reutilizables (Toast, botones, etc.)

### `/contexts`

- Contextos de React para estado global
- Cada contexto en su propio archivo
- Nombrado con sufijo `Context.jsx`

### `/hooks`

- Hooks personalizados de React
- Separados por funcionalidad
- Nombrado con prefijo `use`

### `/lib`

- Clientes y bibliotecas externas
- Configuración de servicios de terceros
- Adaptadores para APIs externas

### `/styles`

- Estilos globales

### `/utils`

- Funciones de utilidad y helpers
- Funciones puras sin efectos secundarios
- Código reutilizable entre componentes

## Convenciones de Nombrado

- **Archivos de Componentes**: PascalCase (ej: `ProfileForm.jsx`)
- **Utilidades y Helpers**: camelCase (ej: `calculateInvoice.js`)
- **Contextos**: PascalCase con sufijo Context (ej: `AuthContext.jsx`)
- **Hooks**: camelCase con prefijo use (ej: `useProfileForm.js`)
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
