import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import HomePage from './pages/HomePage.tsx'

import ExcalidrawCanvas from '../src/components/ExcalidrawCanvas/index.tsx';

import DrawCanvas from './components/ExcalidrawCanvas/DrawCanvas.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children:[
      {
        path: '',
        element: <HomePage />
      },
      {
        path: 'room/:id',
        element: <DrawCanvas />
      }
    ]
    
  },
  
])

createRoot(document.getElementById('root')!).render(

    <ThemeProvider>
      <RouterProvider router={router}/>
        <Toaster
        position='top-right'
        />
      
    </ThemeProvider>
    
  
)
