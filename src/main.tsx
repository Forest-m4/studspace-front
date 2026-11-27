import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import bridge from '@vkontakte/vk-bridge'
import { App } from '@/app'

if (bridge.isEmbedded() || bridge.isWebView()) document.documentElement.classList.add('vk-mini-app')

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
