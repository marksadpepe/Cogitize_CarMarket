# CarMarket API

REST API for a car sales platform.

## Running with Docker Compose

**1. Copy the example env file:**

```bash
cp .env.example .env
```

Set `DATABASE_MIGRATIONS_RUN=true` in `.env` to run migrations automatically on app start.

**2. Start everything:**

```bash
docker-compose up -d
```

The API will be available at `http://localhost:3000` (or any port, if you specified one).
The Swagger will be available at `http://localhost:3000/api/swagger`.

## Running Locally

**1. Start infrastructure (PostgreSQL + MinIO):**

```bash
docker-compose up -d postgres minio createbuckets
```

**2. Install dependencies:**

```bash
npm install
```

**3. Copy and configure environment:**

```bash
cp .env.example .env
```

Update these values to point to localhost:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/carmarket
MINIO_ENDPOINT=http://localhost:9000
```

**4. Run database migrations:**

```bash
npm run build
npm run typeorm:run-migrations
```

**5. Start the app in watch mode:**

```bash
npm run start:dev
```

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | HTTP port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://postgres:postgres@postgres:5432/carmarket` |
| `DATABASE_MIGRATIONS_RUN` | Run migrations on startup | `true` |
| `DATABASE_LOGGING` | Enable TypeORM query logging | `false` |
| `JWT_ACCESS_SECRET` | Secret for access tokens | `secret` |
| `JWT_ACCESS_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | `secret` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `MINIO_ENDPOINT` | MinIO endpoint URL | `http://minio:9000` |
| `MINIO_PORT` | MinIO port | `9000` |
| `MINIO_USE_SSL` | Enable SSL for MinIO | `false` |
| `MINIO_ROOT_USER` | MinIO access key | `minioadmin` |
| `MINIO_ROOT_PASSWORD` | MinIO secret key | `minioadmin` |
| `MINIO_BUCKET` | Bucket name for uploads | `carmarket` |

## Scripts

```bash
npm run start:dev                                        # Start in watch mode
npm run build                                            # Compile TypeScript to dist/
npm run lint                                             # Run ESLint with autofix
npm test                                                 # Unit tests
npm run typeorm:generate-migration --name=MigrationName  # Generate a migration from entity changes
npm run typeorm:run-migrations                           # Run pending migrations
npm run typeorm:revert-migration                         # Revert the last migration
npm run typeorm:create-migration --name=MigrationName    # Create an empty migration file
