import { getUserPrizes, makeSpin } from '@oribet/core/api/services/BonusWheel.api'
import { getUserInfo } from '@oribet/core/api/services/User.api'
import BonusWheelPage from './BonusWheelPage'
import { useAppDispatch, useAppSelector } from '@oribet/core/redux/hooks'
import { changeWheelSpinsInfo } from '@oribet/core/redux/slices/userSlice'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { IBonusWheelWinPrize } from '@oribet/core/types/Bonus.type'
import { IBonusWheel, IUserInfo, IWheelSpinsInfo } from '@oribet/core/types/common.type'

interface IBonusWheelContainer {
  width: number
  height: number
}

const BonusWheelContainer = ({ width, height }: IBonusWheelContainer) => {
  const playerInfo = useAppSelector(state => state.user.playerInfo)
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const borderWidth: number = 2.6
  const startLocation = 60 + borderWidth / 2
  const [rotate, setRotate] = useState<any>(startLocation)
  const [prizes, setPrizes] = useState<IBonusWheel[]>([])
  const [isDisableSpinButton, setIsDisableSpinButton] = useState(false)
  const [isFinishedSpin, setIsFinishedSpin] = useState(false)
  const [spinClickedCount, setSpinClickedCount] = useState(0)
  const [isOpenBonusWheelWinModal, setIsOpenBonusWheelWinModal] = useState<boolean>(false)
  const [wonPrize, setWonPrize] = useState<null | IBonusWheelWinPrize>(null)
  const eachItemDeg: number = 360 / prizes.length
  const { wheel_spins, can_spin_after } = playerInfo.player

  useEffect(() => {
    if (wheel_spins === 1 && remainingTime(can_spin_after)) {
      setIsFinishedSpin(true)
      setIsDisableSpinButton(true)
    }
    getPrizes()
  }, [])

  useEffect(() => {
    if (wheel_spins === 1 && remainingTime(can_spin_after)) {
      setTimeout(() => {
        setIsFinishedSpin(true)
        setIsDisableSpinButton(true)
      }, 5000)
    }
    const resetDisableSpinButtonTimeout = setTimeout(() => {
      setIsDisableSpinButton(false)
    }, 5000)

    return () => {
      clearTimeout(resetDisableSpinButtonTimeout)
    }
  }, [playerInfo])

  useEffect(() => {
    if (wonPrize !== null) {
      setTimeout(() => {
        setIsOpenBonusWheelWinModal(true)
      }, 5000)
    }
  }, [wonPrize])

  const getPrizes = () => {
    setIsDisableSpinButton(true)
    getUserPrizes()
      .then((resp: any) => {
        if (resp.data.data) {
          setPrizes(resp.data.data)
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsDisableSpinButton(false)
      })
  }

  const remainingTime = (can_spin_after: string | null) => {
    if (can_spin_after === null) return false

    const serverTime = new Date(can_spin_after)
    const targetServerTime = serverTime.getTime() - serverTime.getTimezoneOffset() * 60000

    const now = new Date()
    const nowUtc = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      )
    )

    return targetServerTime > nowUtc.getTime()
  }

  const showSpin = () => {
    updateUserInfoState()
    setIsFinishedSpin(false)
    setIsDisableSpinButton(false)
  }

  const calculateStopSpin = (gainPrize: number) => {
    return spinClickedCount === 0
      ? (spinClickedCount + 1) * 1440 - gainPrize + 15
      : (spinClickedCount + 2) * 1080 - gainPrize + 15
  }

  const updateUserInfoState = () => {
    getUserInfo()
      .then(resp => {
        const updateWheelsInfo = {
          wheel_spins: resp.data.data.wheel_spins,
          can_spin_after: resp.data.data.can_spin_after,
        }
        dispatch(changeWheelSpinsInfo(updateWheelsInfo))
      })
      .catch(() => {})
  }

  const getWinPrize = () => {
    setIsDisableSpinButton(true)
    makeSpin()
      .then(res => {
        if (res.data.success) {
          const wonPrize = res.data.data
          setWonPrize(wonPrize)
          const findWonSector: number = prizes.findIndex(prize => prize.id === wonPrize.id) + 1
          const gainPrize = eachItemDeg * findWonSector

          if (playerInfo.player.wheel_spins !== 1) {
            const updateWheelsInfo = {
              wheel_spins: playerInfo.player.wheel_spins - 1,
            }
            dispatch(changeWheelSpinsInfo(updateWheelsInfo))
          }
          const stopSpin = calculateStopSpin(gainPrize)

          setRotate(Number(stopSpin) + startLocation)
          setSpinClickedCount(prev => prev + 1)
          updateUserInfoState()
        } else {
          enqueueSnackbar(res?.data?.data?.message ?? 'Spin failed. Please try again.', {
            variant: 'error',
          })
          setIsDisableSpinButton(false)
        }
      })
      .catch(err => {
        const message =
          err?.response?.data?.data?.message ??
          err?.response?.data?.message ??
          err?.message ??
          'Spin failed. Please try again.'
        enqueueSnackbar(message, { variant: 'error' })
        setIsDisableSpinButton(false)
      })
  }

  const onCloseBonusWheelWinModal = () => {
    setIsOpenBonusWheelWinModal(false)
  }

  return (
    <BonusWheelPage
      prizes={prizes}
      width={width}
      height={height}
      getWinPrize={getWinPrize}
      rotate={rotate}
      eachItemDeg={eachItemDeg}
      isDisableSpinButton={isDisableSpinButton}
      isFinishedSpin={isFinishedSpin}
      showSpin={showSpin}
      isOpenBonusWheelWinModal={isOpenBonusWheelWinModal}
      onCloseBonusWheelWinModal={onCloseBonusWheelWinModal}
      wonPrize={wonPrize}
    />
  )
}

export default BonusWheelContainer
