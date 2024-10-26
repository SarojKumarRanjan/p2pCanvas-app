import react from "react"
import Home from "./pages/Home";
import ExcalidrawCanvas from "./pages/Excalidraw";
import { createBrowserRouter } from "react-router-dom"


const App = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/draw/:id",
    element: <ExcalidrawCanvas />,
  }
]);



export default App


