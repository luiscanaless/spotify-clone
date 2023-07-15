import { faHouse, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export const Sidebar = () => {

    const token = localStorage.getItem('token')

    const [playlists, setPlaylists] = useState([])

    useEffect(() => {

        const getPlaylists = async () => {
            const res = await fetch('https://api.spotify.com/v1/me/playlists', {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            const { items } = await res.json()
            setPlaylists(items)
        }

        getPlaylists()
    }, [])

    return (
        <aside className="text-white rounded-lg w-[350px] flex-[0_0_400px] flex flex-col gap-3">
            <div className="p-6 flex flex-col gap-6 bg-[#121212] rounded-lg">
                <Link to='/'>
                    <div className="flex gap-5 items-center">
                        <FontAwesomeIcon icon={faHouse} size="xl" />
                        <span>Home</span>
                    </div>
                </Link>

                <Link to='/playlist'>
                    <div className="flex gap-5 items-center">
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="xl" />
                        <span>Search</span>
                    </div>
                </Link>

            </div>
            <div className="p-2 bg-[#121212] rounded-lg">
                <h3 className="mb-6 p-2">Your Library</h3>
                <ul className="flex flex-col max-h-[650px] overflow-y-auto">
                    {
                        playlists.map(playlist => (
                            <li key={playlist.id} className="hover:bg-[#1A1A1A] p-2 rounded-md">
                                <Link to={`/playlist/${playlist.id}`}>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={playlist.images[0]?.url}
                                            alt="playlist-img"
                                            className="w-16 h-16 rounded-md"
                                        />
                                        <span>{playlist.name}</span>
                                    </div>
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </aside >
    )
}
