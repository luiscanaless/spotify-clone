import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext()

const code = new URLSearchParams(window.location.search).get('code')

export const AuthProvider = ({ children }) => {

    const [accessToken, setAccessToken] = useState(null)
    const [refreshToken, setRefreshToken] = useState(null)
    const [expiresIn, setExpiresIn] = useState(null)

    useEffect(() => {
        if (!code) return

        const getToken = async () => {
            const res = await fetch('http://localhost:3000/auth/token', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ code })
            })
            const { access_token, refresh_token, expires_in } = await res.json()

            setAccessToken(access_token)
            setRefreshToken(refresh_token)
            setExpiresIn(expires_in)

            localStorage.setItem('token', access_token)

            window.history.pushState({}, null, '/')
        }

        getToken()

    }, [])

    useEffect(() => {

        if (!refreshToken) return
        console.log((expiresIn - 60) * 1000)
        const timeout = setInterval(async () => {
            const res = await fetch('http://localhost:3000/auth/refresh', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ refreshToken })
            })

            const { access_token } = await res.json()
            setAccessToken(access_token)
            localStorage.setItem('token', access_token)
        }, (expiresIn - 60) * 1000);

        return () => {
            clearInterval(timeout)
        }
    }, [expiresIn, refreshToken])




    return (
        <AuthContext.Provider value={{ accessToken }}>
            {children}
        </AuthContext.Provider>
    )
}
