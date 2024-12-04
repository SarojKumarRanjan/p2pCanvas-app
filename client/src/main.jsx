import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {RouterProvider} from 'react-router-dom'
import { AppContextProvider } from './Mycontext.jsx'

createRoot(document.getElementById('root')).render(
 
    <>
  <AppContextProvider>
  <RouterProvider router={App}/>
  </AppContextProvider>
  </>
)
