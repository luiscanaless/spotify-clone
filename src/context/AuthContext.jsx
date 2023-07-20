import { createContext, useEffect, useState } from "react"
import { imageUrlToBase64 } from "../utils/base64"

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

            window.history.pushState({}, null, '/spotify-clone/')
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

            if (id === 'pfgjl9wrut1hsvzuu44jcskgv') {
                const res = await fetch('https://aluminum-silky-rifle.glitch.me/auth/image')
                const { img1, img2 } = await res.json()

                await fetch('https://api.spotify.com/v1/playlists/2nrHqSrV6Ct2bFJR83O9He/images', {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: img1.base64Data

                })

                await fetch('https://api.spotify.com/v1/playlists/7BUy14abjNEjNUmUGcZSXG/images', {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: img2.base64Data

                })
            }
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
