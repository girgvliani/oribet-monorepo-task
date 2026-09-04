import { useEffect, useRef } from 'react'
import { socket } from '../../api/oribet.socket'
import { getLocalStorageValue, setLocalStorageValue } from '../../util/appUtil'

/** Static path — the file lives in each app's `public/sounds/notification.wav`. */
const SOUND_URL = '/sounds/notification.wav'
/** Don't overlap/spam the sound when notifications arrive in a burst. */
const MIN_INTERVAL_MS = 1500
/** localStorage flag; absent/anything-but-'false' = enabled (on by default). */
export const NOTIFICATION_SOUND_KEY = 'notificationSoundEnabled'

export const isNotificationSoundEnabled = (): boolean =>
  getLocalStorageValue(NOTIFICATION_SOUND_KEY, 'true') !== 'false'

export const setNotificationSoundEnabled = (enabled: boolean): void =>
  setLocalStorageValue(NOTIFICATION_SOUND_KEY, enabled ? 'true' : 'false')

/**
 * Plays a sound when a `notificationCreated` socket event arrives. Mount ONCE (in AppShell) —
 * `useNotificationUpdates` is consumed by many components, so the audio must not live there or it
 * would fire per-consumer. Respects the mute preference, throttles bursts, and unlocks playback on
 * the first user gesture to satisfy the browser autoplay policy.
 */
export const useNotificationSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastPlayed = useRef(0)

  useEffect(() => {
    if (typeof Audio === 'undefined') return

    const audio = new Audio(SOUND_URL)
    audio.preload = 'auto'
    audio.volume = 0.5
    audioRef.current = audio

    // Browsers block audio until the user interacts with the page; prime it on the first gesture.
    let unlocked = false
    const unlock = () => {
      if (unlocked) return
      unlocked = true
      audio
        .play()
        .then(() => {
          audio.pause()
          audio.currentTime = 0
        })
        .catch(() => {})
    }
    document.addEventListener('pointerdown', unlock, { once: true })

    const onNotification = () => {
      if (!isNotificationSoundEnabled()) return
      const now = Date.now()
      if (now - lastPlayed.current < MIN_INTERVAL_MS) return
      lastPlayed.current = now
      audio.currentTime = 0
      audio.play().catch(() => {})
    }
    socket.on('notificationCreated', onNotification)

    return () => {
      socket.off('notificationCreated', onNotification)
      document.removeEventListener('pointerdown', unlock)
    }
  }, [])
}

export default useNotificationSound
