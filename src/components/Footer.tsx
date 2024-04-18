import { useEffect, useState } from "react"
import type { Song } from "../lib/data"
import { useStore } from "../store/songStore"
import { Howl, Howler } from "howler";

interface Props {
  song: Song
}

export default function Footer() {

  const song = useStore<Song>((state) => state.currentSong.song)
  const songs = useStore<Song[]>((state) => state.currentSong.songs)
  const setCurrentSong = useStore((state) => state.setCurrentSong)
  const currentSong = useStore((state) => state.currentSong)
  const volume = useStore<number>((state) => state.volume)
  const isPlaying = useStore<boolean>((state) => state.isPlaying)
  const setIsPlaying = useStore((state) => state.setIsPlaying)
  const setVolume = useStore((state) => state.setVolume)

  const [songTime, setSongTime] = useState<number>(0)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  function setVolumeIcon(): JSX.Element {
    if (volume === 0) {
      return (<svg onClick={handleVolumeClick} data-encore-id="icon" role="presentation" aria-label="Volumen apagado" aria-hidden="true" id="volume-icon" viewBox="0 0 16 16" className="sm:inline hidden w-4 h-4 fill-current"><path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path><path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"></path></svg>)
    } else if (volume > 0 && volume < 0.35) {
      return (<svg onClick={handleVolumeClick} data-encore-id="icon" role="presentation" aria-label="Volumen bajo" aria-hidden="true" id="volume-icon" viewBox="0 0 16 16" className="sm:inline hidden w-4 h-4 fill-current"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path></svg>)
    } else if (volume >= 0.35 && volume < 0.75) {
      return (<svg onClick={handleVolumeClick} data-encore-id="icon" role="presentation" aria-label="Volumen medio" aria-hidden="true" id="volume-icon" viewBox="0 0 16 16" className="sm:inline hidden w-4 h-4 fill-current"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a2.999 2.999 0 0 1 0 5.175v1.649z"></path></svg>)
    } else {
      return (<svg onClick={handleVolumeClick} data-encore-id="icon" role="presentation" aria-label="Volumen alto" aria-hidden="true" id="volume-icon" viewBox="0 0 16 16" className="sm:inline hidden w-4 h-4 fill-current"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path><path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"></path></svg>)
    }
  }

  function formatSecondsToTime(totalSeconds: number) {
    const seconds = Math.floor(totalSeconds % 60).toString().slice(0, 2)
    const minutes = Math.floor(totalSeconds / 60).toString().slice(0, 2)

    return `${minutes}:${seconds.length > 1 ? seconds : "0" + seconds}`
  }

  function handlePlayClick() {
    console.log(!isPlaying)
    setIsPlaying(!isPlaying)
  }

  function handleVolumeClick() {
    if (volume === 0) {
      setVolume(1)
    } else {
      setVolume(0)
    }
  }

  function setNewSong(skipType: 0 | 1) {
    setIsPlaying(false)
    setSongTime(0)
    if (skipType === 0) {
      if (songs[song.id]) {
        setCurrentSong({ ...currentSong, song: songs[song.id] })
      } else {
        setCurrentSong({ ...currentSong, song: songs[0] })
      }
    } else if (skipType === 1) {
      if (songs[song.id - 2]) {
        setCurrentSong({ ...currentSong, song: songs[song.id - 2] })
      } else {
        setCurrentSong({ ...currentSong, song: songs[0] })
      }
    }
  }

  useEffect(() => {
    if (song) {
      console.log(song.albumId)
      const newAudio = new Audio(`/music/${song.albumId}/0${song.id}.mp3`)
      setAudio(newAudio)
    }
  }, [song]);

  useEffect(() => {
    if (audio) {
      setIsPlaying(true)
      audio.volume = volume

      audio.addEventListener("timeupdate", () => setSongTime(audio.currentTime))
      audio.addEventListener("ended", () => setNewSong(0))
    }
  }, [audio]);

  useEffect(() => {
    if (audio) {
      audio.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (song && audio) {
      if (isPlaying) {
        audio.play()
      } else {
        console.log("pausado")
        audio.pause()
      }
    }
  }, [isPlaying]);

  return (
    <footer className="w-full rounded-lg flex justify-between px-2">
      <div className="song-info sm:w-[15%] flex gap-2">
        {song && <>
          <img src={song.image} alt={song.title} className="h-full rounded-md" />
          <div className="flex-col sm:flex hidden">
            <b>{song.title}</b>
            <p>{song.artists.join(", ")}</p>
          </div>
        </>}
      </div>
      <div className="song-controls w-[70%] sm:w-[40%] flex flex-col gap-y-2">
        <div className="control-music text-gray-300 w-full flex justify-center items-center gap-6">
          <button className="hover:text-gray-200 transition-colors" onClick={() => setNewSong(1)}>
            <svg
              data-encore-id="icon"
              role="img"
              aria-hidden="true"
              viewBox="0 0 16 16" className="w-[.9rem] h-[.9rem] fill-current"
            >
              <path
                d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"
              ></path>
            </svg>
          </button>
          <button className="p-1 border-0 rounded-full bg-white text-black hover:bg-gray-200 transition-colors w-8 h-8 flex justify-center items-center" onClick={handlePlayClick}>
            {isPlaying ? <svg role="img" className="h-5 w-5" aria-hidden="true" viewBox="0 0 16 16"
            ><path
              d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"
            ></path></svg
            >
              : <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path fill="currentColor" d="M8 5.14v14l11-7-11-7z"></path>
              </svg>}
          </button>
          <button className="hover:text-gray-200 transition-colors" onClick={() => setNewSong(0)}>
            <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="w-[.9rem] h-[.9rem] fill-current">
              <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path>
            </svg>
          </button>
        </div>
        <div className="flex text-xs justify-center items-center">
          <p className="w-9 min-w-9 max-w-9">{audio ? formatSecondsToTime(songTime) : "-:--"}</p>
          <div className="input-range-container p-0 m-0 w-full h-[3.5px] bg-gray-500 relative  flex justify-start items-center rounded-full ">
            {audio && <div className="rounded-full absolute z-[1] h-[3.5px] border-solid border-slate-950 bg-white progress transition-colors" style={{ width: `${songTime / audio.duration * 100}%` }}></div>}
            <input type="range" name="rango" id="rango" className="relative z-[3] m-0 p-0" max={audio?.duration} min="0" value={audio?.currentTime} step="1" disabled={!audio}
              onChange={(e) => {
                setIsPlaying(false)
                setSongTime(parseInt(e.target.value))
                if (audio) {
                  audio.currentTime = parseInt(e.target.value)
                }
              }}
            /></div>
          <p className="w-9 min-w-9 max-w-9 text-end">{audio?.duration ? formatSecondsToTime(audio?.duration) : "-:--"}</p>
        </div>
      </div>
      <div className="song-volume sm:w-[15%] text-white flex items-center justify-center gap-x-4">
        {setVolumeIcon()}

        <div className="input-range-container p-0 m-0 w-24 h-[3.5px] bg-gray-500 relative flex justify-start items-center rounded-full ">
          <div className="rounded-full absolute z-[1] h-[3.5px] border-solid border-slate-950 bg-white progress transition-colors" style={{ width: `${volume * 100}%` }}></div>
          <input type="range" name="rango" id="rango" className="relative z-[3] m-0 p-0" max="1" min="0" defaultValue="1" step="0.01" onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </footer>
  )
}
