import { useEffect } from "react"
import { LoginPage } from "./pages/LoginPage"
import { HomePage } from "./pages/HomePage"

export const App = () => {

  const token = localStorage.getItem('token')

  useEffect(() => {

    const getToken = async () => {
      const res = await fetch('http://localhost:3000/auth/token')
      const { access_token } = await res.json()
      if (access_token === '') {
        localStorage.removeItem('token')
      } else {
        localStorage.setItem('token', access_token)
      }
    }

    getToken()
  }, [])

  return (
    <>
      {
        token
          ?
          <HomePage />
          :
          <LoginPage />
      }
    </>
  )
}
