import { Defaults } from '../util/defaults'
import { useState } from 'react'

interface UseModalContainerReturn<T> {
  show: boolean
  animationType: string
  data: T
  open: (newData?: T) => void
  hide: () => void
}

const useModalContainer = <T = undefined>(initialData?: T): UseModalContainerReturn<T> => {
  const [show, setShow] = useState(false)
  const [data, setData] = useState<T>(initialData as T)
  const [animationType, setAnimationType] = useState(Defaults.defaultModalShowAnimationType)

  const open = (newData?: T) => {
    setShow(true)
    setAnimationType(Defaults.defaultModalShowAnimationType)
    if (newData !== undefined) {
      setData(newData)
    }
  }

  const hide = () => {
    setAnimationType(Defaults.defaultModalHideAnimationType)
    setTimeout(() => {
      setShow(false)
    }, 500)
  }

  return { show, animationType, data, open, hide }
}

export default useModalContainer
