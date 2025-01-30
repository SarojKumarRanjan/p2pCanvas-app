
import { AppContextProvider } from "./context/AppContext"
import { Outlet } from "react-router-dom"


function App() {

 

  return (
    <>
      <AppContextProvider>
        <Outlet />
      </AppContextProvider>
     
    </>
  )
}

export default App
