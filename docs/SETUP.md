# Настройка окружения

## Требования

- Node.js 20 LTS или новее
- pnpm 10 (`corepack enable && corepack use pnpm@10`)

## Установка

```bash
pnpm install
```

## Команды

```bash
pnpm dev         # локальный сервер разработки
pnpm typecheck   # tsc --noEmit
pnpm lint        # ESLint
pnpm test        # Vitest
pnpm build       # production-сборка
```

## Переменные окружения

Не требуются — проект не обращается к внешним сервисам, черновик шаблона хранится в `localStorage`.
