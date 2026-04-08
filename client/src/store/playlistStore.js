import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePlaylistStore = create(
  persist(
    (set, get) => ({
      playlists: [],

      createPlaylist: (name) => {
        const id = Date.now().toString()
        set(s => ({ playlists: [...s.playlists, { id, name, songs: [] }] }))
        return id
      },

      deletePlaylist: (id) => set(s => ({
        playlists: s.playlists.filter(p => p.id !== id)
      })),

      renamePlaylist: (id, name) => set(s => ({
        playlists: s.playlists.map(p => p.id === id ? { ...p, name } : p)
      })),

      addSong: (playlistId, song) => set(s => ({
        playlists: s.playlists.map(p => {
          if (p.id !== playlistId) return p
          if (p.songs.find(existing => existing.id === song.id)) return p
          return { ...p, songs: [...p.songs, song] }
        })
      })),

      removeSong: (playlistId, songId) => set(s => ({
        playlists: s.playlists.map(p =>
          p.id === playlistId
            ? { ...p, songs: p.songs.filter(s => s.id !== songId) }
            : p
        )
      })),

      getPlaylist: (id) => get().playlists.find(p => p.id === id),
    }),
    { name: 'pagemusic-playlists' }
  )
)
