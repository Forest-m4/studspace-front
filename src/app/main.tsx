import bridge from '@vkontakte/vk-bridge'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { authSync } from '@/shared/api/studspace'
import { App } from './App'
import './index.css'

bridge.send('VKWebAppInit').catch(() => undefined)

bridge.send('VKWebAppGetUserInfo')
  .then((user) => authSync({
    first_name: user.first_name,
    last_name: user.last_name,
    photo_url: user.photo_200,
  }))
  .catch(() => undefined)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
