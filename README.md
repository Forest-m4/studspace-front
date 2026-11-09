# StudSpace Front

Фронтенд VK Mini App StudSpace: бронирование студенческих залов и запись на мероприятия.
Бэкенд: [kr0uch/studspace](https://github.com/kr0uch/studspace).

Стек: React, TypeScript, Vite, VKUI, VK Bridge, openapi-fetch.

## Запуск

```bash
npm install
npm run dev
```

Запросы на `/api/v1` в dev идут через прокси Vite, потому что CORS на бэке нет.
Адрес бэка по умолчанию лежит в `.env`, свой можно задать в `.env.local`.

## Настройки

| Переменная | Где | Зачем |
|---|---|---|
| `VITE_API_BASE_URL` | `.env` | базовый путь API |
| `VITE_API_PROXY_TARGET` | `.env` | куда dev-сервер проксирует API |
| `VITE_DEV_LAUNCH_PARAMS` | `.env.local` | подписанные launch params для работы вне VK |
| `VK_APP_SECRET` | `.env.local` | секрет приложения для `sign:params`, в сборку не попадает |

## Работа вне VK

Бэк принимает только подписанные launch params, и подпись живёт 24 часа.

1. Добавь в `.env.local` значение `VK_APP_SECRET`: тот же секрет, что `vk.app_secret` на бэке.
2. Получи параметры:

   ```bash
   npm run sign:params -- 1
   ```

   `1` здесь — `vk_user_id`.
3. Запиши результат в `.env.local` как `VITE_DEV_LAUNCH_PARAMS` и перезапусти `npm run dev`.

## Типы API

Типы в `src/api/schema.d.ts` генерируются из swagger бэка. Клон бэка должен лежать рядом, в `../studspace`.

```bash
npm run gen:api
```

Swagger бэка в формате 2.0, поэтому сначала он конвертируется в OpenAPI 3.
TypeScript закреплён на 5.9: `openapi-typescript` пока не поддерживает версию 7.

## Запросы

```ts
import { api } from './api/client'

const { data, error } = await api.GET('/me')
```

Заголовок `Authorization` клиент добавляет сам. Ошибка приходит в формате `{ error: { code, message, details } }`.
