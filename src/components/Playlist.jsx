import { useEffect, useState } from "react"
import { formatDate } from "../utils/formatDate"

export const Playlist = ({ id }) => {

    const [playlist, setPlaylist] = useState(null)

    const token = localStorage.getItem('token')

    useEffect(() => {
        const getPlaylist = async () => {
            const res = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const json = await res.json()
            setPlaylist(json)
        }

        getPlaylist()
    }, [id, token])

    const changeTrack = async (trackId) => {
        await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                context_uri: `spotify:playlist:${id}`,
                offset: { uri: `spotify:track:${trackId}` }
            })
        })
    }

    return (
        <>
            {
                playlist
                    ?
                    <section className="bg-[#121212] text-white rounded-lg overflow-y-auto scroll max-h-[862px] w-full">

                        <div className="flex gap-6 m-6 mt-20">
                            <img
                                src={playlist.images[0]?.url}
                                alt="Playlist Cover"
                                className="w-64 h-64"
                            />
                            <div className="self-end">
                                <span className="text-sm">Playlist</span>
                                <h3 className="text-6xl font-bold mt-3">{playlist.name}</h3>
                                <div className="text-sm mt-5">
                                    <span>{playlist.owner.display_name} </span>
                                    <span>{playlist.tracks.total} songs, </span>
                                    <span className="text-[#AEB4B5]">420 min 69 seg</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex">
                            <table className="m-6 w-full">
                                <thead className="border-b-[1px] text-[#AEB4B5] border-[#AEB4B5]">
                                    <tr>
                                        <th className="py-2 px-4 text-left">#</th>
                                        <th className="py-2 px-4 text-left">Title</th>
                                        <th className="py-2 px-4 text-left ">Album</th>
                                        <th className="py-2 px-4 text-left">Date added</th>
                                    </tr>
                                </thead>
                                <div className="mb-5"></div>
                                <tbody>
                                    {
                                        playlist.tracks.items.map((track, i) => (
                                            <tr className="hover:bg-[#2A2A2A] " key={track.track.id} onClick={() => changeTrack(track.track.id)}>
                                                <td className="py-2 px-4">{i + 1}</td>
                                                <td className="py-2 px-4 max-w-[500px]">
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={track.track.album.images[0].url}
                                                            alt="Track Image"
                                                            className="w-10"
                                                        />
                                                        <div className="flex flex-col truncate">
                                                            <p className="truncate">
                                                                {track.track.name}
                                                            </p>
                                                            <p className="text-[#AEB4B5] text-xs">
                                                                {track.track.artists[0].name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-4 max-w-[300px] text-[#AEB4B5]">
                                                    <p className="truncate ">{track.track.album.name}</p>
                                                </td>
                                                <td className="py-2 px-4 text-[#AEB4B5]">{formatDate(track.added_at)}</td>
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                        </div>

                    </section>
                    :
                    <section className="bg-[#121212] text-white rounded-lg overflow-y-auto scroll max-h-[862px] w-full"></section>
            }
        </>
    )
}
