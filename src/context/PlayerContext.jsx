import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "./SocketContext";
import { AuthContext } from "./AuthContext";

export const PlayerContext = createContext()

export const PlayerProvider = ({ children }) => {

    const { socket } = useContext(SocketContext)
    const { user } = useContext(AuthContext)

    const token = localStorage.getItem('token')

    const [player, setPlayer] = useState(undefined)

    const [current_track, setTrack] = useState()

    const [thisDevice, setThisDevice] = useState()

    const [is_paused, setPaused] = useState(false)
    const [is_active, setActive] = useState(false)

    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)

    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 1
            });

            setPlayer(player);

            player.addListener('ready', async ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setThisDevice(device_id)
            });

            player.addListener('player_state_changed', (state => {

                if (!state) {
                    return;
                }

                if (state.track_window.current_track) {
                    setTrack(state.track_window.current_track);
                }
                setPaused(state.paused);

                if (player) {
                    player.getCurrentState().then(state => {
                        if (state) {
                            setActive(true);
                            setProgress(state.position);
                            setDuration(state.duration);
                        } else {
                            setActive(false);
                            setProgress(0);
                            setDuration(0);
                        }
                    });
                }

            }));
            player.connect();
        };
    }, [token, socket]);

    useEffect(() => {
        if (!player) return

        player.addListener('player_state_changed', state => {
            if (state && user) {
                socket.emit('user-listening', {
                    ...user,
                    listening: state.track_window.current_track.name
                })
            }
        })
    }, [player, socket, user])


    return (
        <PlayerContext.Provider value={{
            player, setPlayer,
            current_track, setTrack,
            thisDevice, setThisDevice,
            is_paused, setPaused,
            is_active, setActive,
            progress, setProgress,
            duration, setDuration
        }}>
            {children}
        </PlayerContext.Provider>
    )
}