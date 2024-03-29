import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { Player } from "../components/Player"
import { Recommendations } from "../components/Recommendations"
import { Sidebar } from "../components/Sidebar"
import { PlaylistWrapper } from "../components/PlaylistWrapper"
import { PlayerProvider } from "../context/PlayerContext"
import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"
import { FriendsActivity } from "../components/FriendsActivity"

export const HomePage = () => {

    const { accessToken } = useContext(AuthContext)

    if (!accessToken) {
        return <Navigate to="/login" />;
    }


    return (
        <PlayerProvider>

            <section className="bg-black h-screen overflow-hidden">
                <div className="m-2 flex max-h-[870px]  gap-3">
                    <Sidebar />
                    <Routes>
                        <Route path='/spotify-clone/' element={<Recommendations />} />
                        <Route path='/spotify-clone/playlist/:id' element={<PlaylistWrapper />} />
                    </Routes>
                    <FriendsActivity />
                </div>
                <div className="fixed bottom-0">
                    <Player />
                </div>
            </section>

        </PlayerProvider>
    )
}
