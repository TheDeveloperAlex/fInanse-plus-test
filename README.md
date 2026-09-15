# Invoice Template Studio

Экран настройки шаблона счёта с живым предпросмотром. Тестовое задание для **Finanse plus** (SaaS для бухгалтерского учёта).

Референс задаёт состав настроек и сценарий («меняю настройку слева — сразу вижу результат справа»); визуальное решение — собственное, не копия референса. Подробности: [`docs/PLAN.md`](docs/PLAN.md) (объём работ, архитектура), [`docs/ADR.md`](docs/ADR.md) (принятые решения и почему), [`docs/UI-SPEC.md`](docs/UI-SPEC.md) (токены и спецификации компонентов).

## Демо

- Продакшн: _добавить ссылку после `vercel --prod` / импорта репозитория в Vercel_
- Локально: см. «Запуск» ниже

## Что реализовано

**General**
- Название шаблона (обязательное поле, инлайн-редактирование в шапке)
- Логотип: drag & drop / выбор файла (PNG, JPG, SVG ≤ 1 МБ), превью, удаление, тумблер показа, размер S/M/L
- Primary и Secondary цвет: свотч → попап с пикером (`react-colorful`), hex-инпут, 8 пресетов, предупреждение о низком контрасте на белой бумаге
- Тумблер акцентной полосы

**Content**
- Заголовок документа
- Переименование 7 лейблов (Invoice number, Date of Issue, Due Date, Billed To, Subtotal, Total, Balance Due)
- Видимость 8 блоков документа (Due Date, Billed To, Item description, Discount, Taxes, Payment Made, Terms, Statement)
- Terms & Conditions / Statement — textarea со счётчиком символов

**Layout**
- Шрифт документа (Sans / Serif / Mono), плотность (Compact / Regular / Relaxed), выравнивание шапки (лево/право)
- Валюта (USD / EUR / PLN) и формат даты (US / EU / ISO) — форматирование через `Intl`, без конвертации сумм

**Документ**
- Пересчёт итогов — чистая функция; скрытие Discount/Taxes/Payment Made убирает суммы из Total и Balance Due, а не просто прячет строку
- Деньги — целые минорные единицы, округление один раз (`lib/totals.ts`)
- Primary → акцентная полоса, Secondary → выделение Total/Balance Due

**Холст и студия**
- Зум 50–150 % (кнопки, `Ctrl/Cmd +/−`), Fit, печать/PDF через `window.print()` с отдельными print-стилями
- Undo/Redo (`Cmd/Ctrl+Z`, `Shift+Cmd/Ctrl+Z`) поверх `jotai-history`, глубина 50
- Save / Cancel с индикатором несохранённых изменений (баузлайн-атом, не завязан на `localStorage`-автосохранение)
- Reset к дефолтам с подтверждением (Radix AlertDialog)
- Светлая/тёмная тема, черновик автосохраняется в `localStorage`
- Адаптив: 1280 / 1024 / 768 / 390 px, на мобильном — переключатель «Settings / Preview»

## Стек

TypeScript 5.7 (strict) · React 19 · Next.js 16 (App Router, Turbopack) · Tailwind CSS 3.4 + CSS Modules · Jotai 2.20 + `jotai-history` · `radix-ui` · `react-colorful` · `lucide-react` · Vitest + React Testing Library.

Версии зафиксированы точно (без `^`), обоснование каждого выбора — в [`docs/ADR.md`](docs/ADR.md).

## Запуск

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

Подробнее — [`docs/SETUP.md`](docs/SETUP.md).

## Проверка

```bash
pnpm typecheck   # tsc --noEmit
pnpm lint        # ESLint
pnpm test        # Vitest
pnpm build       # production-сборка
```

## Известные ограничения сдачи

- Визуальная проверка на 1440/1024/768/390 px и в обеих темах не выполнена в реальном браузере — в среде разработки не было доступного браузерного движка (Playwright/`chromium-cli`). Раскладка проверена структурно (медиа-запросы, `max-md:`-варианты, ручной расчёт fit-to-width для мобильного зума) и должна быть подтверждена визуально перед сдачей.
- Отсутствие лишних ре-рендеров при перетаскивании цветового пикера не проверено через React DevTools Profiler — обеспечено архитектурно (точечные атомы-линзы + `--tpl-primary` как CSS-переменная на корне бумаги, без чтения через React), но не замерено live.
- Прод-ссылка Vercel не создана — репозиторий не запушен на `origin` и не импортирован в Vercel в рамках этой сессии.
