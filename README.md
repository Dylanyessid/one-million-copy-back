# One Million Copy - Backend

API REST para gestión de leads con análisis de datos e IA.

## Tecnologías

- **Node.js + TypeScript**: Tipado estático para mayor seguridad y mantenibilidad
- **Express**: Framework minimalista 
- **TypeORM + PostgreSQL**: ORM robusto con soporte para soft deletes. Postgres es open source y extensible fácilmente
- **JWT**: Autenticación stateless
- **OpenAI (GPT-4)**: Recomendaciones basadas en IA
- **Luxon**: Manejo de fechas en UTC más cómoda
- **class-validator**: Validación de DTOs de los endpoints
- **UUID**: Estándar para IDs de recursos en DB. Se usó la V7 ya que permite organizar por tiempo los recursos y es óptimo a la hora de buscar, por ejemplo, en paginación.

## Arquitectura

```
src/
├── config/          # Configuración (DB, variables de entorno)
├── core/
│   ├── middlewares/ # Auth, validación
│   └── utils/       # Respuestas, mensajes, resultados
├── libs/            # Servicios externos (JWT, OpenAI, bcrypt)
├── models/          # Entidades TypeORM
├── modules/
│   └── leads/       # Módulo de leads (controller, service, DTOs)
└── routes/          # Definición de rutas
```

Arquitectura en capas:
- **Routes**: Definen endpoints y middlewares usados en estos
- **Controllers**: Manejan request/response
- **Services**: Lógica de negocio y operaciones
- **Models**: Acceso a datos

## Instalación

```bash
npm install
npm run build
npm run dev
```

## Variables de entorno

Copiar `.env.example` a `.env`:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=one_million_copy

JWT_SECRET=tu-secret-aqui
BCRYPT_ROUNDS=10

OPENAI_API_KEY=sk-...
```

## Ejecutar SEED

Para tener un usuario para usar los endpoints, ya que tienen autenticación por JWT, y tener unos leads de ejemplo se debe ejecutar el comando:

```bash
npm run seed
```

NOTA: Hacer esto después de haber definido las variables de entorno y tener la conexión a la DB

## Endpoints

Todos los endpoints de `/leads` requieren `Authorization: Bearer <token>`.

### Autenticación

```bash
# Login
POST /api/v1/auth/login
{ "email": "...", "password": "..." }
```

### Leads

```bash
# Crear lead
POST /api/v1/leads
{
  "nombre": "Juan",
  "email": "juan@email.com",
  "fuente": "instagram",
  "productoInteres": "Curso copy",
  "presupuesto": 500
}

# Obtener leads (con paginación y filtros)
GET /api/v1/leads?limit=10&fuente=instagram&fechaDesde=2024-01-01&fechaHasta=2024-12-31

# Obtener un lead
GET /api/v1/leads/:id

# Actualizar lead
PATCH /api/v1/leads/:id
{ "presupuesto": 750 }

# Eliminar lead (soft delete)
DELETE /api/v1/leads/:id

# Estadísticas
GET /api/v1/leads/stats

# Recomendaciones IA
GET /api/v1/leads/recommendations?fuente=facebook
```

## Manejo de Errores

Respuesta uniforme:

```json
{
  "messageCode": "ERROR_CODE",
  "message": "Mensaje legible",
  "httpCode": 400
}
```

Códigos de error comunes:
- `INVALID_PAYLOAD`: Datos inválidos
- `UNAUTHORIZED`: Sin token o token inválido
- `LEAD_NOT_FOUND`: Lead no existe
- `LEAD_EMAIL_EXISTS`: Email ya registrado
- `INTERNAL_ERROR`: Error inesperado

Los servicios capturan excepciones y retornan `INTERNAL_ERROR`

## DEPLOY

Se usó Render como servicio de Deploy (tuve que poner rejectUnauthorized:false para agilizar el despliegue y conexion con bd de prod).

Enlace base: https://one-million-copy-back.onrender.com/

Email y password para pruebas en este entorno (recuerda hacer login): 

admin@mail.com
Admin123+*

NOTA: Por el plan gratuito de Render, a veces se pone lenta las peticiones, es normal, ya que es una restricción del proveedor para uso gratuito