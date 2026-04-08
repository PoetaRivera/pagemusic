import { useEffect, useRef, useState } from 'react'
import { usePlayerStore } from '../../store/playerStore'
import { patchSongDuration } from '../../api/songs'
import { recordPlay } from '../../api/stats'
import {
  BsPlayFill, BsPauseFill, BsSkipStartFill, BsSkipEndFill,
  BsShuffle, BsMusicNote, BsVolumeUp, BsVolumeMute,
  BsExclamationCircle, BsArrowRepeat, BsRepeat, BsRepeat1,
  BsListUl, BsX
} from 'react-icons/bs'

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function GlobalPlayer() {
  const audioRef = useRef(null)
  const [seeking, setSeeking] = useState(false)
  const [localTime, setLocalTime] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [audioError, setAudioError] = useState(null)
  const playSessionRef = useRef(null) // { songId, startTime }

  const {
    currentSong, isPlaying, isShuffle, isRepeat, volume,
    currentTime, duration, queue, showQueue,
    togglePlay, playNext, playPrev, toggleShuffle, toggleRepeat,
    setVolume, setCurrentTime, setDuration, toggleQueue, playFromQueue,
  } = usePlayerStore()

  // Registrar sesión anterior como "saltada" al cambiar canción
  const flushPlaySession = (completed = false) => {
    const session = playSessionRef.current
    if (!session) return
    const listened = audioRef.current ? audioRef.current.currentTime : 0
    const dur = audioRef.current ? audioRef.current.duration : 0
    const skipped = !completed && dur > 0 && (listened / dur) < 0.8
    recordPlay({
      song_id: session.songId,
      duration_listened: Math.round(listened),
      completed,
      skipped,
    }).catch(() => {})
    playSessionRef.current = null
  }

  // Cambiar src cuando cambia la canción
  useEffect(() => {
    if (!audioRef.current || !currentSong) return
    flushPlaySession(false)
    playSessionRef.current = { songId: currentSong.id }
    setAudioError(null)
    setIsLoading(true)
    audioRef.current.src = currentSong.audio_url
    audioRef.current.volume = volume
    audioRef.current.play().catch((err) => {
      setAudioError('No se pudo reproducir el audio')
      setIsLoading(false)
      console.error('Error al reproducir:', err)
    })
  }, [currentSong])

  // Play / pause
  useEffect(() => {
    if (!audioRef.current || !currentSong) return
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        setAudioError('No se pudo reproducir el audio')
        console.error('Error al reproducir:', err)
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  // Volumen
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Seek desde el store
  useEffect(() => {
    if (!seeking && audioRef.current && Math.abs(audioRef.current.currentTime - currentTime) > 1.5) {
      audioRef.current.currentTime = currentTime
    }
  }, [currentTime])

  // repeat: 'one' → reinicia el audio en lugar de llamar playNext
  const handleEnded = () => {
    flushPlaySession(true)
    if (isRepeat === 'one' && audioRef.current) {
      playSessionRef.current = { songId: currentSong.id }
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    } else {
      playNext()
    }
  }

  if (!currentSong) return null

  const handleTimeUpdate = () => {
    if (!seeking) {
      const t = audioRef.current.currentTime
      setLocalTime(t)
      setCurrentTime(t)
    }
  }

  const handleSeekStart = () => setSeeking(true)
  const handleSeekChange = (e) => setLocalTime(Number(e.target.value))
  const handleSeekEnd = (e) => {
    const val = Number(e.target.value)
    audioRef.current.currentTime = val
    setCurrentTime(val)
    setSeeking(false)
  }

  const displayTime = seeking ? localTime : currentTime

  const repeatIcon = isRepeat === 'one' ? BsRepeat1 : BsRepeat
  const repeatColor = isRepeat !== 'none' ? 'text-purple-400' : 'text-gray-500 hover:text-white'

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          const dur = audioRef.current.duration
          setDuration(dur)
          setIsLoading(false)
          if (currentSong && !currentSong.duration && dur > 0) {
            patchSongDuration(currentSong.id, dur).catch(() => {})
          }
        }}
        onCanPlay={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onError={() => { setAudioError('No se pudo cargar el audio. Verifica la URL.'); setIsLoading(false) }}
        onEnded={handleEnded}
      />

      {/* Panel de cola */}
      {showQueue && (
        <div className="fixed bottom-[82px] right-4 w-80 max-h-96 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          style={{ background: 'rgba(22,22,24,0.92)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Cola de reproducción</h3>
            <button onClick={toggleQueue} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
              <BsX className="text-lg" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 py-1">
            {queue.map((song, idx) => {
              const isActive = song.id === currentSong?.id
              return (
                <button
                  key={`${song.id}-${idx}`}
                  onClick={() => playFromQueue(song)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                  style={{ background: isActive ? 'rgba(139,92,246,0.15)' : 'transparent' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <div className="w-8 h-8 rounded flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
                    {song.cover_url
                      ? <img src={song.cover_url} alt="" className="w-full h-full object-cover" />
                      : <BsMusicNote className="text-xs" style={{ color: 'var(--text-muted)' }} />
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate" style={{ color: isActive ? 'var(--accent)' : 'var(--text-primary)' }}>
                      {song.title}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{song.artist}</p>
                  </div>
                  {isActive && (
                    <div className="equalizer flex-shrink-0">
                      <span /><span /><span />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50 px-3 md:px-6 py-2 md:py-3"
        style={{
          background: 'rgba(13,13,15,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
          minHeight: '76px',
        }}>
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">

          {/* Info canción */}
          <div className="flex items-center gap-2 flex-1 min-w-0 md:w-60 md:flex-shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex-shrink-0 overflow-hidden shadow-lg" style={{ background: 'var(--bg-hover)' }}>
              {currentSong.cover_url
                ? <img src={currentSong.cover_url} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center">
                    <BsMusicNote style={{ color: 'var(--text-muted)' }} />
                  </div>
              }
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{currentSong.title}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{currentSong.artist}</p>
            </div>
          </div>

          {/* Controles centrales */}
          <div className="flex flex-col items-center gap-1 md:gap-2 md:flex-1">
            {audioError && (
              <div className="flex items-center gap-1 text-red-400 text-xs">
                <BsExclamationCircle />
                <span className="hidden sm:inline">{audioError}</span>
              </div>
            )}
            <div className="flex items-center gap-3 md:gap-5">
              {/* Shuffle — oculto en móvil */}
              <button onClick={toggleShuffle} className="text-lg transition-colors hidden md:block"
                style={{ color: isShuffle ? 'var(--accent)' : 'var(--text-muted)' }}>
                <BsShuffle />
              </button>
              <button onClick={playPrev} className="text-xl transition-colors active:scale-95"
                style={{ color: 'var(--text-secondary)' }}>
                <BsSkipStartFill />
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform active:scale-95"
                style={{ background: 'var(--accent)', boxShadow: '0 0 20px var(--accent-glow)' }}
              >
                {isLoading
                  ? <BsArrowRepeat className="text-lg animate-spin" />
                  : isPlaying
                    ? <BsPauseFill className="text-lg" />
                    : <BsPlayFill className="text-lg ml-0.5" />
                }
              </button>
              <button onClick={playNext} className="text-xl transition-colors active:scale-95"
                style={{ color: 'var(--text-secondary)' }}>
                <BsSkipEndFill />
              </button>
              {/* Repeat — oculto en móvil */}
              <button onClick={toggleRepeat} className="text-lg transition-colors hidden md:block"
                style={{ color: isRepeat !== 'none' ? 'var(--accent)' : 'var(--text-muted)' }}>
                {isRepeat === 'one' ? <BsRepeat1 /> : <BsRepeat />}
              </button>
            </div>

            {/* Barra de progreso — oculta en móvil muy pequeño */}
            <div className="w-full max-w-xs md:max-w-lg flex items-center gap-2">
              <span className="text-xs w-8 text-right hidden sm:block" style={{ color: 'var(--text-muted)' }}>{formatTime(displayTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.5}
                value={displayTime}
                onMouseDown={handleSeekStart}
                onTouchStart={handleSeekStart}
                onChange={handleSeekChange}
                onMouseUp={handleSeekEnd}
                onTouchEnd={handleSeekEnd}
                className="flex-1 cursor-pointer"
                style={{ accentColor: 'var(--accent)' }}
              />
              <span className="text-xs w-8 hidden sm:block" style={{ color: 'var(--text-muted)' }}>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volumen + cola — oculto en móvil */}
          <div className="hidden md:flex items-center gap-3 w-40 flex-shrink-0">
            <button onClick={toggleQueue} className="text-lg transition-colors" title="Ver cola"
              style={{ color: showQueue ? 'var(--accent)' : 'var(--text-muted)' }}>
              <BsListUl />
            </button>
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
              className="transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              {volume === 0 ? <BsVolumeMute /> : <BsVolumeUp />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="flex-1 cursor-pointer"
              style={{ accentColor: 'var(--accent)' }}
            />
          </div>

        </div>
      </div>
    </>
  )
}
