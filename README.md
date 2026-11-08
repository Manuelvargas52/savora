<div align="center">

# 🍽️ Savora

### Sistema web de reservas para restaurantes

**Descubre restaurantes, consulta disponibilidad y reserva tu mesa de manera rápida y sencilla.**

[Aplicación](https://savora-blush.vercel.app/) · [Repositorio](https://github.com/Manuelvargas52/savora) · [API](https://savora-backend-0ewz.onrender.com)

</div>

---

## 📌 Descripción

Savora es una aplicación web full stack orientada a la consulta de restaurantes y a la gestión de reservas. El sistema permite consultar restaurantes, revisar disponibilidad y realizar operaciones sobre las reservas.

## ✨ Funcionalidades

- Consulta de restaurantes.
- Consulta de mesas y disponibilidad.
- Creación de reservas.
- Modificación de reservas.
- Cancelación de reservas.
- Consulta de reservas.

## 🏗️ Arquitectura

| Módulo | Tecnologías | Responsabilidad |
|---|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS | Interfaz y consumo de API |
| Backend | Java 21, Spring Boot, Spring Data JPA | API REST y lógica de negocio |
| Base de datos | PostgreSQL | Persistencia de información |
| Despliegue frontend | Vercel | Publicación de la aplicación web |
| Despliegue backend | Render y Docker | Ejecución de la API |
| Base de datos cloud | Neon | PostgreSQL de producción |

## 🗂️ Estructura del repositorio

```text
savora/
├── frontend/
│   └── README.md
├── backend/
│   └── README.md
├── database/
│   └── README.md
└── README.md
```

## 🚀 Ejecución local

### Requisitos

- Node.js y npm.
- Java 21.
- PostgreSQL.
- Git.

### 1. Iniciar el backend

Abre una terminal en `backend` y configura la conexión a PostgreSQL local:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/savora_db"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="TU_PASSWORD_LOCAL"
$env:DDL_AUTO="update"
.\mvnw.cmd spring-boot:run
```

La API estará disponible normalmente en `http://localhost:8080`.

### 2. Iniciar el frontend

En otra terminal:

```powershell
cd frontend
npm install
npm run dev
```

La aplicación estará disponible normalmente en `http://localhost:5173`.

Configura `frontend/.env.development`:

```env
VITE_API_URL=http://localhost:8080/api
```

## 🌎 Entornos

| Entorno | Frontend | Backend | Base de datos |
|---|---|---|---|
| Desarrollo | `localhost:5173` | `localhost:8080` | PostgreSQL local: `savora_db` |
| Producción | Vercel | Render | Neon: `neondb` |

> **Importante:** mantén separadas las bases de datos de desarrollo y producción. Verifica `DB_URL` antes de iniciar el backend para evitar realizar pruebas sobre datos reales.

## 📚 Documentación técnica

- [Documentación del frontend](frontend/README.md)
- [Documentación del backend](backend/README.md)
- [Documentación de la base de datos](database/README.md)

## 🔐 Seguridad

- No subas contraseñas, tokens ni secretos al repositorio.
- No incluyas credenciales reales en archivos README.
- Las variables `VITE_*` se incorporan al código del navegador; no deben contener secretos.
- Utiliza datos ficticios en el entorno local.

## 📦 Compilación

Frontend:

```bash
cd frontend
npm run build
```

Backend (Windows):

```powershell
cd backend
.\mvnw.cmd clean package
```

## 🚢 Publicación

El frontend se publica en Vercel y el backend en Render. Si el despliegue automático está habilitado, los cambios enviados a la rama configurada pueden iniciar una nueva publicación.

Se recomienda ejecutar y probar ambos módulos localmente antes de enviar cambios a la rama de producción.
