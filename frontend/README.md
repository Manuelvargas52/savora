# Frontend — Savora

> Interfaz web para consultar restaurantes y gestionar reservas.

## 📌 Descripción

El frontend de Savora presenta la experiencia de usuario y consume los endpoints REST expuestos por el backend.

## 🧰 Tecnologías

- **React:** construcción de interfaces.
- **TypeScript:** tipado estático.
- **Vite:** servidor de desarrollo y herramienta de compilación.
- **Tailwind CSS:** estilos de interfaz.
- **Axios:** comunicación HTTP con el backend.
- **Vercel:** despliegue del frontend.

## ⚙️ Requisitos

- Node.js.
- npm.
- Backend disponible en local o en un entorno remoto.

## 📥 Instalación

Desde la carpeta `frontend`:

```bash
npm install
```

## 🔑 Variables de entorno

Crea el archivo `.env.development` en la raíz de `frontend`:

```env
VITE_API_URL=http://localhost:8080/api
```

Para producción, configura en Vercel la variable:

```text
VITE_API_URL=https://savora-backend-0ewz.onrender.com/api
```

> No almacenes contraseñas, tokens ni secretos en variables `VITE_*`. Sus valores pueden quedar expuestos en el navegador.

## ▶️ Ejecución en desarrollo

```bash
npm run dev
```

Dirección local habitual: `http://localhost:5173`.

## 🏗️ Compilación

```bash
npm run build
```

Para servir localmente el resultado de la compilación:

```bash
npm run preview
```

## 🔌 Comunicación con el backend

Los servicios frontend deben utilizar la configuración centralizada de Axios y la variable `VITE_API_URL`.

Ejemplo de configuración:

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

## 🖼️ Recursos estáticos

Los archivos ubicados en `public` se sirven desde la raíz del sitio. Por ejemplo:

```text
public/
└── projects/
    └── savora-home.png
```

Se referencia en la aplicación como:

```text
/projects/savora-home.png
```

## 🚀 Despliegue en Vercel

Configuración del proyecto:

| Opción | Valor |
|---|---|
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Configura `VITE_API_URL` en los entornos de Vercel que correspondan (Production y Preview).

## 🧪 Flujo recomendado

1. Iniciar el backend local.
2. Iniciar el frontend con `npm run dev`.
3. Probar las funcionalidades contra la base de datos local.
4. Ejecutar `npm run build`.
5. Enviar los cambios a GitHub cuando estén listos.
