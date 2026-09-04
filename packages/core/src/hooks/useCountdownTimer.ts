import moment from 'moment'
import { useEffect, useRef, useState } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface UseCountdownTimerOptions {
  onComplete?: () => void
}

const useCountdownTimer = (
  targetDate: string | null | undefined,
  options?: UseCountdownTimerOptions
) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const onCompleteRef = useRef(options?.onComplete)

  useEffect(() => {
    onCompleteRef.current = options?.onComplete
  })

  const calculateTimeLeft = (): TimeLeft => {
    if (!targetDate) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const target = moment(targetDate)
    const now = moment()

    if (target.isSameOrBefore(now)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const duration = moment.duration(target.diff(now))

    return {
      days: Math.floor(duration.asDays()),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    }
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft())

  const isExpired =
    timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (!targetDate) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      return
    }

    setTimeLeft(calculateTimeLeft())

    timerRef.current = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        onCompleteRef.current?.()
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [targetDate])

  return {
    ...timeLeft,
    isExpired,
    isRunning: !isExpired && !!targetDate,
  }
}

export default useCountdownTimer
