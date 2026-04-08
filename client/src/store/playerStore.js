import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      currentSong: null,
      queue: [],
      originalQueue: [],
      isPlaying: false,
      isShuffle: false,
      isRepeat: 'none', // 'none' | 'one' | 'all'
      volume: 0.8,
      currentTime: 0,
      duration: 0,
      showQueue: false,

      playSong: (song, queue) => {
        const original = queue || [song]
        const ordered = get().isShuffle ? shuffle(original) : original
        set({ currentSong: song, queue: ordered, originalQueue: original, isPlaying: true, currentTime: 0 })
      },

      playNext: () => {
        const { queue, currentSong, isRepeat } = get()
        if (!queue.length) return
        if (isRepeat === 'one') {
          set({ currentTime: 0, isPlaying: true })
          return
        }
        const idx = queue.findIndex(s => s.id === currentSong?.id)
        const isLast = idx === queue.length - 1
        if (isLast && isRepeat === 'none') {
          set({ isPlaying: false, currentTime: 0 })
          return
        }
        const next = queue[idx + 1] ?? queue[0]
        set({ currentSong: next, isPlaying: true, currentTime: 0 })
      },

      playPrev: () => {
        const { queue, currentSong, currentTime } = get()
        if (!queue.length) return
        if (currentTime > 3) {
          set({ currentTime: 0 })
          return
        }
        const idx = queue.findIndex(s => s.id === currentSong?.id)
        const prev = queue[idx - 1] ?? queue[queue.length - 1]
        set({ currentSong: prev, isPlaying: true, currentTime: 0 })
      },

      toggleShuffle: () => {
        const { isShuffle, originalQueue } = get()
        if (!isShuffle) {
          set({ isShuffle: true, queue: shuffle(originalQueue) })
        } else {
          set({ isShuffle: false, queue: originalQueue })
        }
      },

      toggleRepeat: () => {
        const { isRepeat } = get()
        const next = isRepeat === 'none' ? 'all' : isRepeat === 'all' ? 'one' : 'none'
        set({ isRepeat: next })
      },

      togglePlay: () => set(s => ({ isPlaying: !s.isPlaying })),
      setVolume: (v) => set({ volume: v }),
      setCurrentTime: (t) => set({ currentTime: t }),
      setDuration: (d) => set({ duration: d }),
      toggleQueue: () => set(s => ({ showQueue: !s.showQueue })),
      playFromQueue: (song) => set({ currentSong: song, isPlaying: true, currentTime: 0 }),
    }),
    {
      name: 'pagemusic-player-prefs',
      // Solo persiste preferencias, no el estado de reproducción
      partialize: (s) => ({ volume: s.volume, isShuffle: s.isShuffle, isRepeat: s.isRepeat }),
    }
  )
)
