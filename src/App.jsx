import { useContext, useEffect } from "react"
import { LoginPage } from "./pages/LoginPage"
import { HomePage } from "./pages/HomePage"
import { AuthContext } from "./context/AuthContext"
import { BrowserRouter } from "react-router-dom"

export const App = () => {

  const { accessToken } = useContext(AuthContext)

  return (
    <BrowserRouter>
      {
        accessToken
          ?
          <HomePage />
          :
          <LoginPage />
      }
    </BrowserRouter>


  )
}
