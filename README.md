# test-project

Монорепо: Hono API + Next.js фронтенд + PostgreSQL

## Stack

- **Hono** — REST API (`apps/backend`, порт 3001)
- **Next.js 16** — фронтенд, App Router (`apps/frontend`, порт 3000)
- **Drizzle ORM** — type-safe queries + миграции
- **PostgreSQL 17** — база данных
- **TanStack Query** — серверное состояние
- **shadcn/ui + Tailwind 4** — UI
- **pnpm workspaces** — монорепо

---

## Запуск через Docker

```bash
#создать .env
cp _env.example .env
#seed для тестового запуска
pnpm --filter @repo/backend seed
#compose
docker compose up --build
```

Docker поднимает Postgres, прогоняет миграции, затем стартует backend и frontend.

- Фронтенд: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:3001](http://localhost:3001)

---

## Локальный запуск

**Требования:** Node.js 20+, pnpm, PostgreSQL

```bash
cp _env.example .env
# отредактировать .env под свою БД

pnpm install

# миграции
pnpm --filter @repo/backend migrate

# запуск обоих сервисов
pnpm dev
```

Или по отдельности:

```bash
pnpm dev:api   # только backend
pnpm dev:web   # только frontend
```

Seed (заполнить БД тестовыми данными):

```bash
pnpm --filter @repo/backend seed
```

---

## Переменные окружения

| Переменная              | Описание                        |
|-------------------------|---------------------------------|
| `POSTGRES_NAME`         | Имя базы данных                 |
| `POSTGRES_USER`         | Пользователь БД                 |
| `POSTGRES_PASSWORD`     | Пароль БД                       |
| `POSTGRES_PORT`         | Порт PostgreSQL (default: 5432) |
| `DATABASE_URL`          | Строка подключения (backend)    |
| `CORS_ORIGIN`           | Разрешённый origin для CORS     |
| `PORT`                  | Порт backend (default: 3001)    |
| `NEXT_PUBLIC_API_URL`   | URL backend для фронтенда       |

Пример для локальной разработки в `_env.example`.
