import {create} from "zustand"

export const useStore = create(set => ({
  currentSong: {song: null, songs: []},
  volume: 1,
  isPlaying: false,
  setVolume: (volume) => set({ volume }),
  setCurrentSong: (currentSong) => set({ currentSong }),
  setIsPlaying: (isPlaying) => set({ isPlaying })
}))