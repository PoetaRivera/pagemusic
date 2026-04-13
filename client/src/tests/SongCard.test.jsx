import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockPlaySong = vi.fn()
const mockTogglePlay = vi.fn()

vi.mock('../store/playerStore', () => ({
  usePlayerStore: () => ({
    currentSong: null,
    isPlaying: false,
    playSong: mockPlaySong,
    togglePlay: mockTogglePlay,
  }),
}))

vi.mock('../store/playlistStore', () => ({
  usePlaylistStore: () => ({
    playlists: [],
    addSong: vi.fn(),
    createPlaylist: vi.fn(),
  }),
}))

import SongCard from '../components/catalog/SongCard'

const song = { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', duration: 185, cover_url: null }

beforeEach(() => {
  mockPlaySong.mockClear()
  mockTogglePlay.mockClear()
})

test('muestra título y artista', () => {
  render(<SongCard song={song} queue={[song]} index={0} />)
  expect(screen.getByText('Bohemian Rhapsody')).toBeInTheDocument()
  expect(screen.getByText('Queen')).toBeInTheDocument()
})

test('muestra el número de índice', () => {
  render(<SongCard song={song} queue={[song]} index={2} />)
  expect(screen.getByText('3')).toBeInTheDocument()
})

test('muestra duración formateada (185s → 3:05)', () => {
  render(<SongCard song={song} queue={[song]} index={0} />)
  expect(screen.getByText('3:05')).toBeInTheDocument()
})

test('muestra --:-- si no hay duración', () => {
  render(<SongCard song={{ ...song, duration: null }} queue={[song]} index={0} />)
  expect(screen.getByText('--:--')).toBeInTheDocument()
})

test('llama playSong al hacer click cuando no es la canción activa', async () => {
  render(<SongCard song={song} queue={[song]} index={0} />)
  await userEvent.click(screen.getByText('Bohemian Rhapsody'))
  expect(mockPlaySong).toHaveBeenCalledWith(song, [song])
})
