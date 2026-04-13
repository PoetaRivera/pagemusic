import { beforeEach, describe, expect, test } from 'vitest'
import { usePlaylistStore } from '../store/playlistStore'

const song1 = { id: 1, title: 'Song One' }
const song2 = { id: 2, title: 'Song Two' }

beforeEach(() => {
  usePlaylistStore.setState({ playlists: [] })
})

describe('createPlaylist', () => {
  test('crea una playlist y retorna su id', () => {
    const id = usePlaylistStore.getState().createPlaylist('Mi Lista')
    const { playlists } = usePlaylistStore.getState()
    expect(playlists).toHaveLength(1)
    expect(playlists[0].name).toBe('Mi Lista')
    expect(playlists[0].id).toBe(id)
    expect(playlists[0].songs).toEqual([])
  })

  test('permite crear múltiples playlists', () => {
    usePlaylistStore.getState().createPlaylist('Lista A')
    usePlaylistStore.getState().createPlaylist('Lista B')
    expect(usePlaylistStore.getState().playlists).toHaveLength(2)
  })
})

describe('deletePlaylist', () => {
  test('elimina la playlist correcta', () => {
    usePlaylistStore.setState({
      playlists: [
        { id: 'id-a', name: 'Mantener', songs: [] },
        { id: 'id-b', name: 'Eliminar', songs: [] },
      ]
    })
    usePlaylistStore.getState().deletePlaylist('id-b')
    const { playlists } = usePlaylistStore.getState()
    expect(playlists).toHaveLength(1)
    expect(playlists[0].name).toBe('Mantener')
  })
})

describe('renamePlaylist', () => {
  test('renombra una playlist existente', () => {
    const id = usePlaylistStore.getState().createPlaylist('Nombre Viejo')
    usePlaylistStore.getState().renamePlaylist(id, 'Nombre Nuevo')
    expect(usePlaylistStore.getState().playlists[0].name).toBe('Nombre Nuevo')
  })

  test('no afecta otras playlists', () => {
    usePlaylistStore.setState({
      playlists: [
        { id: 'id-1', name: 'Lista 1', songs: [] },
        { id: 'id-2', name: 'Lista 2', songs: [] },
      ]
    })
    usePlaylistStore.getState().renamePlaylist('id-1', 'Lista Renombrada')
    const names = usePlaylistStore.getState().playlists.map(p => p.name)
    expect(names).toContain('Lista Renombrada')
    expect(names).toContain('Lista 2')
  })
})

describe('addSong', () => {
  test('agrega una canción a la playlist', () => {
    const id = usePlaylistStore.getState().createPlaylist('Lista')
    usePlaylistStore.getState().addSong(id, song1)
    expect(usePlaylistStore.getState().playlists[0].songs).toHaveLength(1)
    expect(usePlaylistStore.getState().playlists[0].songs[0].id).toBe(1)
  })

  test('no agrega la misma canción dos veces (sin duplicados)', () => {
    const id = usePlaylistStore.getState().createPlaylist('Lista')
    usePlaylistStore.getState().addSong(id, song1)
    usePlaylistStore.getState().addSong(id, song1)
    expect(usePlaylistStore.getState().playlists[0].songs).toHaveLength(1)
  })

  test('permite agregar canciones distintas', () => {
    const id = usePlaylistStore.getState().createPlaylist('Lista')
    usePlaylistStore.getState().addSong(id, song1)
    usePlaylistStore.getState().addSong(id, song2)
    expect(usePlaylistStore.getState().playlists[0].songs).toHaveLength(2)
  })
})

describe('removeSong', () => {
  test('elimina la canción correcta', () => {
    const id = usePlaylistStore.getState().createPlaylist('Lista')
    usePlaylistStore.getState().addSong(id, song1)
    usePlaylistStore.getState().addSong(id, song2)
    usePlaylistStore.getState().removeSong(id, song1.id)
    const songs = usePlaylistStore.getState().playlists[0].songs
    expect(songs).toHaveLength(1)
    expect(songs[0].id).toBe(2)
  })
})

describe('getPlaylist', () => {
  test('retorna la playlist por id', () => {
    const id = usePlaylistStore.getState().createPlaylist('Buscar')
    const pl = usePlaylistStore.getState().getPlaylist(id)
    expect(pl.name).toBe('Buscar')
  })

  test('retorna undefined si el id no existe', () => {
    expect(usePlaylistStore.getState().getPlaylist('noexiste')).toBeUndefined()
  })
})
