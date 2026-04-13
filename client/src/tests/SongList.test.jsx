import { render, screen } from '@testing-library/react'

vi.mock('../store/playerStore', () => ({
  usePlayerStore: () => ({
    currentSong: null,
    isPlaying: false,
    playSong: vi.fn(),
    togglePlay: vi.fn(),
  }),
}))

vi.mock('../store/playlistStore', () => ({
  usePlaylistStore: () => ({
    playlists: [],
    addSong: vi.fn(),
    createPlaylist: vi.fn(),
  }),
}))

import SongList from '../components/catalog/SongList'

const songs = [
  { id: 1, title: 'Song A', artist: 'Artist 1', duration: 180, cover_url: null },
  { id: 2, title: 'Song B', artist: 'Artist 2', duration: 240, cover_url: null },
]

test('muestra mensaje vacío si no hay canciones', () => {
  render(<SongList songs={[]} />)
  expect(screen.getByText('No hay canciones en este género.')).toBeInTheDocument()
})

test('renderiza todas las canciones', () => {
  render(<SongList songs={songs} />)
  expect(screen.getByText('Song A')).toBeInTheDocument()
  expect(screen.getByText('Song B')).toBeInTheDocument()
})

test('muestra el número correcto de tarjetas', () => {
  render(<SongList songs={songs} />)
  expect(screen.getAllByText(/Artist/)).toHaveLength(2)
})
