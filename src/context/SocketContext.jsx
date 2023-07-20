import { createContext } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();


export const SocketProvider = ({ children }) => {

    const socket = io.connect('https://midnight-complex-cover.glitch.me/', { transports: ['websocket'] });

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}