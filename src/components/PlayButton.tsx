import { songs, type Song } from "../lib/data"
import { useStore } from "../store/songStore"

interface Props {
  id: number
  className?: string
  albumId: number
}

export default function PlayButton({ id, className, albumId }: Props) {
  const setCurrentSong = useStore((state) => state.setCurrentSong)

  return (<span className={`${className} w-8 h-8 text-white`} onClick={() => {

    const playList: Song[] = songs.filter(s => s.albumId == albumId)
    const song = playList[id - 1]

    setCurrentSong({ songs: playList, song })
  }}>
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
      <path fill="currentColor" d="M8 5.14v14l11-7-11-7z"></path>
    </svg>
  </span>)
}