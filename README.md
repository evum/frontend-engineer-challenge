# Frontend приложение для аутентификации и дашборда

Приложение предоставляет интерфейс для регистрации, входа, восстановления пароля и просмотра защищённого дашборда. Построено на современном стеке: React + TypeScript + Vite, Material UI, TanStack Query.

## Backend
В качестве бэкенда использовано решение https://github.com/aiezq/engineer-challenge (взята часть, отвечающая за бэкенд)
## 🧱 Архитектура

### Структура проекта
src/<br>
├── api/ # Кастомные хуки для GraphQL-запросов (TanStack Query)<br>
│&nbsp;&nbsp;&nbsp;&nbsp;├── useLoginQuery.ts<br>
│&nbsp;&nbsp;&nbsp;&nbsp;├── useRegQuery.ts<br>
│&nbsp;&nbsp;&nbsp;&nbsp;├── useRecoveryQuery.ts<br>
│&nbsp;&nbsp;&nbsp;&nbsp;├── useSetNewPassword.ts<br>
│&nbsp;&nbsp;&nbsp;&nbsp;└── useCheckAuthorization.ts<br>
├── assets/ # Иконки<br>
│&nbsp;&nbsp;&nbsp;&nbsp;├── back-arrow.svg<br>
│&nbsp;&nbsp;&nbsp;&nbsp;├── background-image.svg<br>
│&nbsp;&nbsp;&nbsp;&nbsp;├── dashboard.svg<br>
│&nbsp;&nbsp;&nbsp;&nbsp;├── logo.svg<br>
│&nbsp;&nbsp;&nbsp;&nbsp;└── vite.svg<br>
├── Components/<br>
│&nbsp;&nbsp;&nbsp;&nbsp;├── Common/ # Переиспользуемые UI-компоненты<br>
│&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;├── BackgroundPanel<br>
│&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;├── PanelWithCenterControls<br>
│&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;├── Logo<br>
│&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;└── PasswordInput<br>
│&nbsp;&nbsp;&nbsp;&nbsp;├── Login/ # Страница входа<br>
│&nbsp;&nbsp;&nbsp;&nbsp;├── Registration/ # Регистрация<br>
│&nbsp;&nbsp;&nbsp;&nbsp;├── Recovery/ # Восстановление пароля (запрос ссылки)<br>
│&nbsp;&nbsp;&nbsp;&nbsp;├── ResetPassPage/ # Установка нового пароля<br>
│&nbsp;&nbsp;&nbsp;&nbsp;└── Dashboard/ # Защищённая страница после авторизации<br>
├── test/ # Утилиты и моки для тестов<br>
│&nbsp;&nbsp;&nbsp;&nbsp;├── mocks/<br>
│&nbsp;&nbsp;&nbsp;&nbsp;│ &nbsp;&nbsp;&nbsp;&nbsp;├── react-router.ts<br>
│&nbsp;&nbsp;&nbsp;&nbsp;│ &nbsp;&nbsp;&nbsp;&nbsp;├── mui-icons-stub.ts<br>
│&nbsp;&nbsp;&nbsp;&nbsp;│ &nbsp;&nbsp;&nbsp;&nbsp;└── localStorage.ts<br>
│&nbsp;&nbsp;&nbsp;&nbsp;└── setup.ts # Глобальная настройка тестовой среды<br>
├── App.tsx # Корневой компонент с маршрутизацией<br>
├── main.tsx # Точка входа<br>
└── index.css # Глобальные стили<br>


### Технологический стек
- **React 19** (с React Compiler для автоматической мемоизации)
- **TypeScript 6** (с включённой `erasableSyntaxOnly`)
- **Vite 8** (сборка и dev-сервер)
- **Material UI 9** (компоненты и иконки)
- **TanStack Query 5** (управление серверным состоянием, кэширование)
- **React Router 7** (маршрутизация)
- **Vitest 4** + **React Testing Library** (тестирование)
- **Docker** (многоэтапная сборка с Nginx для продакшена)

### Поток аутентификации
1. При монтировании `App` из `localStorage` читается токен и отправляется GraphQL-запрос `me` для проверки валидности.
2. В зависимости от результата:
   - Если пользователь активен → показывается `DashboardPage`.
   - Иначе → роутинг на страницы входа/регистрации/восстановления.
3. После успешного входа/регистрации токен сохраняется в `localStorage`, и вызывается `queryClient.invalidateQueries` для обновления данных пользователя.

### Управление состоянием
- **Серверное состояние** – TanStack Query (кэш, повторные запросы, инвалидация).
- **Локальное состояние** – `useState` для полей форм и флагов UI.
- **Маршрутизация** – React Router с условным рендерингом на основе `authResult`.

## ⚖️ Принятые компромиссы (trade-offs)

| Решение | Причина | Компромисс |
|---------|---------|------------|
| Хранение JWT в `localStorage` | Простота реализации, совместимость с GraphQL-заголовком `Authorization` | Уязвимость к XSS. В продакшене рекомендуется httpOnly cookie с CSRF-защитой. |
| Проверка авторизации при каждом рендере `App` | Гарантирует актуальность данных при возврате на вкладку | Избыточные запросы. Лучше использовать контекст и проверять только после входа/регистрации или при фокусе окна. |
| GraphQL-запросы прямо в хуках без слоя сервисов | Уменьшает количество абстракций в небольшом проекте | При росте приложения логику запросов лучше вынести в отдельные сервисы. |
| Моки иконок MUI в тестах через алиас и прокси | SVG в jsdom вызывают ошибки и зависания | Решение надёжное, но требует поддержки при добавлении новых иконок. Альтернатива – трансформация SVG в строки на уровне Vite. |
| `erasableSyntaxOnly: true` в TypeScript | Ускоряет компиляцию и сборку | Потребовался отдельный `tsconfig.test.json` для тестов, так как глобальные типы Vitest/jest-dom несовместимы с этой опцией. |
| Отсутствие глобального state-менеджера (Redux) | Достаточно TanStack Query и локального состояния | Упрощает код, но при усложнении логики UI может понадобиться контекст или Zustand. |

## 🚀 Следующие шаги для Production-версии

### Безопасность
- Перейти на хранение токена в **httpOnly cookie** с флагами `Secure`, `SameSite=Strict`.
- Реализовать механизм **refresh token** для продления сессии без повторного входа.
- Добавить **CSRF-защиту** при использовании cookie.

### Производительность и UX
- Ленивая загрузка страниц (`React.lazy` + `Suspense`) для уменьшения начального бандла.
- Анализ размера бандла (`vite-bundle-visualizer`) и удаление неиспользуемых зависимостей.
- Обработка ошибок сети и GraphQL с показом понятных уведомлений (например, через Snackbar MUI).
- Добавить индикаторы загрузки при выполнении мутаций (уже частично есть в `@tanstack/react-query`, но нужно UI-отображение).

### Тестирование и CI/CD
- Настроить **GitHub Actions / GitLab CI** для автоматического запуска тестов и линтера при пушах.
- Добавить **end-to-end тесты** (Playwright или Cypress) для критических пользовательских сценариев.
- Интегрировать **Sentry** для мониторинга ошибок на фронтенде.

### UI
- Привести ui в точное соответствие с макетом (проверить отступы и цвета).
- Добавить локализацию подписей через `i18n` или аналоги.

### Оптимизация кода
- Вынести общую логику работы с GraphQL (формирование body, обработка ошибок) в отдельную утилиту или хук-обёртку.
- Заменить моки иконок в тестах на трансформацию `@mui/icons-material` через Vite-плагин (чтобы не поддерживать ручные моки).
- Рассмотреть внедрение **Feature-Sliced Design** при дальнейшем росте проекта.

## 🛠 Запуск и разработка

### Запуск через Docker
```bash
docker build -t frontend-app .
docker run -p 3000:3000 frontend-app
```
Или через Docker Compose:
```bash
docker-compose up -d
```

### Установка зависимостей
```bash
npm ci
```
### Режим разработки
```bash
npm run dev
```
Приложение будет доступно на http://localhost:5173

### Сборка для production
```bash
npm run build
```
Результат в папке dist.
### Запуск тестов
```bash
npm run test        # однократный прогон
npm run test:ui     # интерактивный UI
```

## 📄 Переменные окружения
- *BASE_REQUEST_URL* – URL GraphQL-сервера (по умолчанию http://localhost:8000). Задаётся в .env.production или через аргументы сборки Docker.

## 📝 Примечания
GraphQL-эндпоинт ожидается по пути /graphql/ на указанном BASE_REQUEST_URL.

Все запросы используют POST с телом в формате JSON и полями `operationName`, `query`, `variables`.

Приложение использует `React Compiler` (включён через `@vitejs/plugin-react` с reactCompilerPreset), что может немного замедлять dev-сборку, но оптимизирует production-код.
