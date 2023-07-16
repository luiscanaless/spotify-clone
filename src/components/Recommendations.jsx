import { useEffect, useState } from "react"

export const Recommendations = () => {

    const token = localStorage.getItem('token')

    const [recommendations, setRecommendations] = useState([])

    useEffect(() => {
        const getRecommendations = async () => {
            const res = await fetch('https://api.spotify.com/v1/browse/new-releases', {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })

            const { albums } = await res.json()

            setRecommendations(albums.items)
        }

        getRecommendations()
    }, [token])


    return (

        <section className="flex-[1] bg-[#121212] rounded-lg">
            <div className="m-5">
                <h3 className="text-white text-2xl font-bold mb-5">New Releases</h3>
                <ul className="flex flex-wrap gap-5 max-h-[770px] overflow-y-auto scroll">
                    {
                        recommendations.map(recommendation => (
                            <li
                                key={recommendation.id}
                                className="bg-[#181818] w-48 p-3 rounded-lg"
                            >
                                <img
                                    src={recommendation.images[1].url}
                                    alt="album-cover"
                                    className="w-full"
                                />
                                <p className="truncate text-white mt-4 font-bold text-sm">{recommendation.name}</p>
                                <p className="text-[#AEAEAE] text-xs my-3 truncate">{recommendation.artists[0].name}</p>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </section>
    )
}
