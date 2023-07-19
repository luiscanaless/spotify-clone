import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../context/SocketContext"
import { AuthContext } from "../context/AuthContext"


export const FriendsActivity = () => {

    const { socket } = useContext(SocketContext)
    const { user } = useContext(AuthContext)
    const [users, setUsers] = useState({})

    useEffect(() => {
        socket.on('users', users => {
            setUsers(users)
            console.log(Object.entries(users))
        })
    }, [socket])


    return (
        <section className="text-white flex-[0_0_400px] bg-[#121212] ml-auto p-5">
            <h3 className="mb-5 font-bold">Friends Activity</h3>
            <ul className="flex flex-col gap-5">
                {
                    Object.entries(users)
                        .filter(([key]) => key !== user.id)
                        .map(([key, value]) => (
                            <li
                                key={key}
                                className="flex items-start gap-3"
                            >
                                <img
                                    src={value?.images}
                                    alt="user image"
                                    className="rounded-full w-12 h-12 object-cover"
                                />
                                <div className="flex flex-col text-[#b3b3b3]">
                                    <span className="text-sm font-bold">{value.display_name}</span>
                                    <span className="text-sm">{value.listening}</span>
                                </div>
                            </li>
                        ))
                }
            </ul>
        </section>
    )
}
