import { beforeEach, describe, expect, test } from 'vitest'
import { usePlayerStore } from '../store/playerStore'

const songA = { id: 1, title: 'Song A' }
const songB = { id: 2, title: 'Song B' }
const songC = { id: 3, title: 'Song C' }

beforeEach(() => {
  usePlayerStore.setState({
    currentSong: null,
    queue: [],
    originalQueue: [],
    isPlaying: false,
    isShuffle: false,
    isRepeat: 'none',
    volume: 0.8,
    currentTime: 0,
    duration: 0,
    showQueue: false,
  })
})

describe('playSong', () => {
  test('establece canción actual y activa reproducción', () => {
    usePlayerStore.getState().playSong(songA, [songA, songB])
    const state = usePlayerStore.getState()
    expect(state.currentSong).toEqual(songA)
    expect(state.isPlaying).toBe(true)
    expect(state.queue).toEqual([songA, songB])
  })

  test('usa la canción como queue si no se pasa uno', () => {
    usePlayerStore.getState().playSong(songA)
    expect(usePlayerStore.getState().queue).toEqual([songA])
  })

  test('reinicia currentTime al cambiar canción', () => {
    usePlayerStore.setState({ currentTime: 60 })
    usePlayerStore.getState().playSong(songB, [songA, songB])
    expect(usePlayerStore.getState().currentTime).toBe(0)
  })
})

describe('togglePlay', () => {
  test('alterna isPlaying de false a true', () => {
    usePlayerStore.setState({ isPlaying: false })
    usePlayerStore.getState().togglePlay()
    expect(usePlayerStore.getState().isPlaying).toBe(true)
  })

  test('alterna isPlaying de true a false', () => {
    usePlayerStore.setState({ isPlaying: true })
    usePlayerStore.getState().togglePlay()
    expect(usePlayerStore.getState().isPlaying).toBe(false)
  })
})

describe('playNext', () => {
  test('avanza a la siguiente canción', () => {
    usePlayerStore.setState({ currentSong: songA, queue: [songA, songB, songC], isRepeat: 'none' })
    usePlayerStore.getState().playNext()
    expect(usePlayerStore.getState().currentSong).toEqual(songB)
  })

  test('detiene reproducción al llegar al final con repeat none', () => {
    usePlayerStore.setState({ currentSong: songC, queue: [songA, songB, songC], isRepeat: 'none' })
    usePlayerStore.getState().playNext()
    expect(usePlayerStore.getState().isPlaying).toBe(false)
  })

  test('vuelve al inicio al llegar al final con repeat all', () => {
    usePlayerStore.setState({ currentSong: songC, queue: [songA, songB, songC], isRepeat: 'all' })
    usePlayerStore.getState().playNext()
    expect(usePlayerStore.getState().currentSong).toEqual(songA)
  })

  test('reinicia tiempo con repeat one', () => {
    usePlayerStore.setState({ currentSong: songA, queue: [songA, songB], isRepeat: 'one', currentTime: 30 })
    usePlayerStore.getState().playNext()
    expect(usePlayerStore.getState().currentSong).toEqual(songA)
    expect(usePlayerStore.getState().currentTime).toBe(0)
  })
})

describe('playPrev', () => {
  test('retrocede a la canción anterior', () => {
    usePlayerStore.setState({ currentSong: songB, queue: [songA, songB, songC], currentTime: 1 })
    usePlayerStore.getState().playPrev()
    expect(usePlayerStore.getState().currentSong).toEqual(songA)
  })

  test('reinicia tiempo si currentTime > 3 (sin cambiar canción)', () => {
    usePlayerStore.setState({ currentSong: songB, queue: [songA, songB, songC], currentTime: 10 })
    usePlayerStore.getState().playPrev()
    expect(usePlayerStore.getState().currentTime).toBe(0)
    expect(usePlayerStore.getState().currentSong).toEqual(songB)
  })

  test('va al final de la cola si está en la primera canción', () => {
    usePlayerStore.setState({ currentSong: songA, queue: [songA, songB, songC], currentTime: 0 })
    usePlayerStore.getState().playPrev()
    expect(usePlayerStore.getState().currentSong).toEqual(songC)
  })
})

describe('toggleRepeat', () => {
  test('cicla: none → all → one → none', () => {
    usePlayerStore.setState({ isRepeat: 'none' })
    usePlayerStore.getState().toggleRepeat()
    expect(usePlayerStore.getState().isRepeat).toBe('all')
    usePlayerStore.getState().toggleRepeat()
    expect(usePlayerStore.getState().isRepeat).toBe('one')
    usePlayerStore.getState().toggleRepeat()
    expect(usePlayerStore.getState().isRepeat).toBe('none')
  })
})

describe('toggleShuffle', () => {
  test('activa shuffle y mantiene las 3 canciones en la cola', () => {
    usePlayerStore.setState({ isShuffle: false, originalQueue: [songA, songB, songC] })
    usePlayerStore.getState().toggleShuffle()
    expect(usePlayerStore.getState().isShuffle).toBe(true)
    expect(usePlayerStore.getState().queue).toHaveLength(3)
  })

  test('desactiva shuffle y restaura el orden original', () => {
    usePlayerStore.setState({ isShuffle: true, originalQueue: [songA, songB, songC] })
    usePlayerStore.getState().toggleShuffle()
    expect(usePlayerStore.getState().isShuffle).toBe(false)
    expect(usePlayerStore.getState().queue).toEqual([songA, songB, songC])
  })
})

describe('setVolume', () => {
  test('actualiza el volumen', () => {
    usePlayerStore.getState().setVolume(0.5)
    expect(usePlayerStore.getState().volume).toBe(0.5)
  })
})
