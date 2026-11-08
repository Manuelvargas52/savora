# Base de datos — Savora

> Persistencia de restaurantes, mesas, clientes y reservas mediante PostgreSQL.

## 📌 Descripción

Savora utiliza PostgreSQL como sistema de gestión de base de datos. El backend accede a la información mediante Spring Data JPA e Hibernate.

## 🧰 Motor y entornos

| Entorno | Motor | Base de datos |
|---|---|---|
| Desarrollo local | PostgreSQL 18 | `savora_db` |
| Producción | Neon PostgreSQL | `neondb` |

Mantén los entornos separados para evitar que las pruebas locales alteren los datos de producción.

## 🗃️ Tablas identificadas

En el esquema `public` se han identificado las siguientes tablas:

| Tabla | Propósito general |
|---|---|
| `restaurants` | Información de restaurantes |
| `restaurant_tables` | Mesas de los restaurantes |
| `customers` | Información de clientes |
| `reservations` | Reservas registradas |

> Los nombres anteriores corresponden a las tablas observadas en pgAdmin. Para conocer columnas, tipos, claves, restricciones e índices exactos, consulta el esquema PostgreSQL o las entidades JPA del backend.

## 🖥️ Crear la base local con pgAdmin

1. Conéctate al servidor PostgreSQL local.
2. Despliega **Databases**.
3. Selecciona **Create → Database**.
4. Escribe `savora_db`.
5. Guarda la base de datos.

El backend utiliza Hibernate con `DDL_AUTO=update` para crear o actualizar las tablas según las entidades JPA existentes.

## 🔗 Parámetros de conexión local

URL JDBC:

```text
jdbc:postgresql://localhost:5432/savora_db
```

Variables esperadas por el backend:

```text
DB_URL=jdbc:postgresql://localhost:5432/savora_db
DB_USERNAME=postgres
DB_PASSWORD=<contraseña-local>
DDL_AUTO=update
```

No incluyas la contraseña real en este documento ni en Git.

## 🔎 Consultar registros en pgAdmin

1. Abre la base `savora_db`.
2. Navega a `Schemas → public → Tables`.
3. Haz clic derecho sobre la tabla que deseas consultar.
4. Selecciona **View/Edit Data → All Rows**.

## 💾 Respaldos

Puedes utilizar:

- **Backup / Restore** desde pgAdmin.
- `pg_dump` para generar respaldos.
- `pg_restore` para restaurarlos.

Verifica cuidadosamente la base de origen y destino antes de realizar estas operaciones.

## ✅ Buenas prácticas

- Ejecuta pruebas funcionales sobre la base local.
- No conectes el entorno local a Neon para pruebas.
- No ejecutes operaciones destructivas sobre producción.
- Realiza respaldos antes de cambios importantes del esquema.
- Mantén los datos ficticios separados de los datos reales.
- No publiques credenciales ni cadenas de conexión con contraseñas.
