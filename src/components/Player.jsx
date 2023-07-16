import { faPlay, faPause, faBackwardStep, faForwardStep, faLaptop, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { TrackProgressBar } from "./player/TrackProgressBar";
import { PlayerContext } from "../context/PlayerContext";

// const track = {
//     name: "",
//     album: {
//         images: [
//             { url: "" }
//         ]
//     },
//     artists: [
//         { name: "" }
//     ]
// }

export const Player = () => {

    const token = localStorage.getItem('token')

    const [devices, setDevices] = useState([])
    const [showModal, setShowModal] = useState(false)

    const {
        player,
        setTrack,
        setProgress,
        is_paused,
        is_active,
        current_track,
        progress,
        duration,
        thisDevice
    } = useContext(PlayerContext)


    useEffect(() => {
        const getDevices = async () => {
            const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const { devices } = await res.json()
            setDevices(devices)
        }
        getDevices()
    }, [token])

    useEffect(() => {
        const getPlayback = async () => {
            const res = await fetch('https://api.spotify.com/v1/me/player', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const { item, progress_ms } = await res.json()

            setTrack(item)
            setProgress(progress_ms)
        }
        getPlayback()
    }, [token, setProgress, setTrack])



    const changeDevice = async (id) => {
        if (showModal) setShowModal(!showModal)
        try {
            await fetch('https://api.spotify.com/v1/me/player', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    device_ids: [id]
                }),
            })
        } catch (error) {
            console.log(error)
        }
    }

    const setVolume = (e) => {
        player.setVolume(e.target.value)
    }

    const handleProgressBarSeek = newPosition => {
        player.seek(newPosition).then(() => {
            setProgress(newPosition);
        });
    };

    useEffect(() => {
        const timer = setInterval(() => {
            if (!is_paused && is_active) {
                setProgress(prevProgress => prevProgress + 1000);
            }
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [is_paused, is_active, setProgress]);

    return (
        <>
            {
                current_track
                &&
                <div className="text-white flex p-3 w-screen">

                    <div className="flex items-center gap-3 min-w-[400px]">
                        <img
                            src={current_track.album.images[0].url}
                            className="w-16 rounded-md"
                            alt="track-cover"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm">{current_track.name}</span>
                            <span className="text-xs text-[#b3b3b3]">{current_track.artists[0].name}</span>
                        </div>
                    </div>


                    <div className="flex flex-col items-center gap-1 flex-[1]">
                        <div className="flex gap-4">
                            <button
                                className="text-[#b3b3b3]"
                                onClick={() => { player.previousTrack() }}
                            >
                                <FontAwesomeIcon icon={faBackwardStep} size="lg" />
                            </button>

                            <button
                                className="bg-white text-black rounded-full w-9 h-9"
                                onClick={() => player.togglePlay()}
                            >
                                {is_paused ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faPause} size="lg" />}
                            </button>

                            <button
                                className="text-[#b3b3b3]"
                                onClick={() => { player.nextTrack() }}
                            >
                                <FontAwesomeIcon icon={faForwardStep} size="lg" />
                            </button>
                        </div>
                        <div>
                            <TrackProgressBar
                                progress={progress}
                                duration={duration}
                                onSeek={handleProgressBarSeek}
                            />
                        </div>

                    </div>

                    <div className="flex items-center gap-5 min-w-[400px] justify-end mr-5">
                        <div className="relative">
                            <FontAwesomeIcon icon={faLaptop} onClick={() => setShowModal(!showModal)} />
                            {
                                showModal
                                &&
                                <div className="bg-[#282828] absolute -top-full right-1/2 translate-x-1/2 -translate-y-full p-3 rounded-xl">
                                    <ul className="max-h-80 w-60 overflow-y-auto flex flex-col">

                                        {thisDevice && (
                                            <li
                                                className="flex gap-5 items-center hover:bg-[#3E3E3E] p-5 rounded-md"
                                                onClick={() => changeDevice(thisDevice)}
                                            >
                                                <FontAwesomeIcon icon={faLaptop} size="xl" />
                                                <span>This device</span>
                                            </li>
                                        )}
                                        {
                                            devices.map(device => (
                                                <li
                                                    key={device.id}
                                                    className="flex gap-5 items-center hover:bg-[#3E3E3E] p-5 rounded-md cursor-default"
                                                    onClick={() => { changeDevice(device.id) }}
                                                >
                                                    <FontAwesomeIcon icon={faLaptop} size="xl" />
                                                    <span>{device.name}</span>

                                                </li>
                                            ))
                                        }

                                    </ul>
                                </div>
                            }
                        </div>
                        <div className="flex gap-2">
                            <FontAwesomeIcon icon={faVolumeHigh} />
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step="0.01"
                                onChange={setVolume}
                            />
                        </div>
                    </div>
                </div >
            }
        </>
    )
}
