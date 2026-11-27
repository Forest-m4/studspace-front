import { RouterProvider } from 'react-router-dom'
import { SessionProvider } from '@/entities/user/model/session'
import { router } from './routes/router'
import './styles/index.css'
export function App() { return <SessionProvider><RouterProvider router={router} /></SessionProvider> }
