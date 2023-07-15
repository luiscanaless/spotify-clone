import { useParams } from "react-router-dom";
import { Playlist } from "./Playlist";


export const PlaylistWrapper = () => {
    const { id } = useParams();

    return <Playlist key={id} id={id} />;
}
