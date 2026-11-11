import bridge from '@vkontakte/vk-bridge'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app'
import { userApi } from '@/entities/user'

bridge.send('VKWebAppInit').catch(() => undefined)

bridge
  .send('VKWebAppGetUserInfo')
  .then((user) =>
    userApi.authSync({
      first_name: user.first_name,
      last_name: user.last_name,
      photo_url: user.photo_200,
    }),
  )
  .catch(() => undefined)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
