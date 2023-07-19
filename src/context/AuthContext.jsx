import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext()

const code = new URLSearchParams(window.location.search).get('code')

export const AuthProvider = ({ children }) => {

    const [accessToken, setAccessToken] = useState(null)
    const [refreshToken, setRefreshToken] = useState(null)
    const [expiresIn, setExpiresIn] = useState(null)

    const [user, setUser] = useState(null)

    useEffect(() => {
        if (!code) return

        const getToken = async () => {
            const res = await fetch('https://aluminum-silky-rifle.glitch.me/auth/token', {
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

        const timeout = setInterval(async () => {
            const res = await fetch('https://aluminum-silky-rifle.glitch.me/auth/refresh', {
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

    useEffect(() => {
        if (!accessToken) return

        const getUser = async () => {
            const res = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            const { id, display_name, images } = await res.json()
            setUser(prev => ({
                ...prev,
                id,
                display_name,
                images: images[0]?.url
            }))
        }
        getUser()
    }, [accessToken])





    return (
        <AuthContext.Provider value={{
            user,
            accessToken,
            setUser

        }}>
            {children}
        </AuthContext.Provider>
    )
}
