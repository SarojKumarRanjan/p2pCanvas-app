import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children:[

    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router}/>
        <Toaster
        position='top-right'
        />
      
    </ThemeProvider>
    
  </StrictMode>,
)
