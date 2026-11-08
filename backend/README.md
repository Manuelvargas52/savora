# Backend — Savora

> API REST para consulta de restaurantes y gestión de reservas.

## 📌 Descripción

El backend implementa los servicios y la lógica de negocio de Savora. Expone endpoints REST y utiliza PostgreSQL mediante Spring Data JPA e Hibernate.

## 🧰 Tecnologías

- **Java 21**
- **Spring Boot**
- **Spring Data JPA**
- **Hibernate**
- **Maven Wrapper**
- **PostgreSQL**
- **Docker**
- **Render**

## ⚙️ Requisitos

- JDK 21.
- PostgreSQL.
- Maven Wrapper incluido en el proyecto.

## 🔑 Configuración

Archivo principal:

```text
src/main/resources/application.properties
```

Variables utilizadas:

| Variable | Descripción | Referencia local |
|---|---|---|
| `DB_URL` | URL JDBC | `jdbc:postgresql://localhost:5432/savora_db` |
| `DB_USERNAME` | Usuario de base de datos | `postgres` |
| `DB_PASSWORD` | Contraseña | Contraseña local |
| `DDL_AUTO` | Estrategia de Hibernate | `update` |
| `SHOW_SQL` | Mostrar consultas SQL | `true` |
| `PORT` | Puerto del servidor | `8080` |

No guardes credenciales reales en el repositorio.

## ▶️ Ejecución local en Windows

Desde la carpeta `backend`:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/savora_db"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="TU_PASSWORD_LOCAL"
$env:DDL_AUTO="update"
.\mvnw.cmd spring-boot:run
```

Sustituye `TU_PASSWORD_LOCAL` por la contraseña configurada en PostgreSQL.

La API se ejecuta normalmente en:

```text
http://localhost:8080
```

## 🔌 Endpoints identificados

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/restaurants` | Consultar restaurantes |
| `GET` | `/api/reservations` | Consultar reservas |
| `GET` | `/api/reservations/available-times` | Consultar horarios disponibles |

El proyecto también contempla operaciones de creación, modificación y cancelación de reservas. Consulta los controladores para verificar los parámetros y cuerpos JSON exactos.

## 🌐 CORS

La configuración del proyecto permite solicitudes a `/api/**` desde:

- `http://localhost:5173`
- `https://*.vercel.app`

Si cambia el dominio del frontend, revisa la configuración CORS.

## 🧪 Compilación y pruebas

Compilar:

```powershell
.\mvnw.cmd clean package
```

Ejecutar pruebas:

```powershell
.\mvnw.cmd test
```

## 🐳 Docker y despliegue en Render

El backend se despliega en Render mediante Docker. La configuración de producción se suministra mediante variables de entorno.

Servicio configurado:

```text
https://savora-backend-0ewz.onrender.com
```

Variables de producción configuradas en Render:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DDL_AUTO`
- `PORT` (gestionada por Render cuando corresponda)

## 🛡️ Separación de entornos

- **Desarrollo:** PostgreSQL local, base `savora_db`.
- **Producción:** Neon PostgreSQL, base `neondb`.

Comprueba siempre `DB_URL` antes de iniciar la aplicación. No ejecutes pruebas locales contra la base de producción.
