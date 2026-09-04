import { fontSize, zIndex } from '@oribet/ui'
import { resolveImageUrl } from '@oribet/core/api/baseUrl'
import { getLocalizedString } from '@oribet/core/util/appUtil'
import { AtomBonusWheelDiamond } from '@oribet/assets/atoms/AtomBonusWheelDiamond'
import { IconClose } from '@oribet/assets/icons/IconClose'
import { IconLock } from '@oribet/assets/icons/IconLock'
import BonusWheelCountDownTimer from './BonusWheelCountDownTimer'
import BonusWheelWinModal from './BonusWheelWinModal'
import { useAppDispatch } from '@oribet/core/redux/hooks'
import { globalBonusWheelModalClose } from '@oribet/core/redux/slices/userSlice'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { IBonusWheelWinPrize } from '@oribet/core/types/Bonus.type'
import { IBonusWheel } from '@oribet/core/types/common.type'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'

interface IBonusWheelPage {
  prizes: IBonusWheel[]
  width: number
  height: number
  getWinPrize: () => void
  rotate: number
  eachItemDeg: number
  isDisableSpinButton: boolean
  isFinishedSpin: boolean
  showSpin: () => void
  isOpenBonusWheelWinModal: boolean
  onCloseBonusWheelWinModal: () => void
  wonPrize: null | IBonusWheelWinPrize
}

const BonusWheelPage = ({
  prizes,
  width,
  height,
  getWinPrize,
  rotate,
  eachItemDeg,
  isDisableSpinButton,
  isFinishedSpin,
  showSpin,
  isOpenBonusWheelWinModal,
  onCloseBonusWheelWinModal,
  wonPrize,
}: IBonusWheelPage) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const theme = useTheme()

  const backgroundArray = [
    'linear-gradient(187.63deg, #0A34BC 10.32%, #0A34BC 79.89%)',
    'linear-gradient(205.33deg, #016FFF 19.09%, #016FFF 81.28%)',
    'linear-gradient(110.32deg, #007257 39.63%, #007257 83.45%)',
    'linear-gradient(312.76deg, #00CE02 24.51%, #00CE02 83.84%)',
    'linear-gradient(294.6deg, #FFBC00 21.49%, #FFBC00 82.26%)',
    'linear-gradient(180.73deg, #FF8E00 22.51%, #FF8E00 95.26%)',
    'linear-gradient(54.97deg, #FF5400 31%, #FF5400 83.79%)',
    'linear-gradient(58.28deg, #E41300 19%, #E41300 81.72%)',
    'linear-gradient(90.08deg, #FF0092 6.17%, #FF0092 78.24%)',
    'linear-gradient(249.33deg, #FD02FF 39.73%, #FD02FF 83.94%)',
    'linear-gradient(157.53deg, #6C00D8 19.05%, #6C00D8 82.08%)',
    'linear-gradient(171.78deg, #3200A7 10.02%, #3200A7 79.18%)',
  ]

  return (
    <MainContainerWrapper $isMobile={isMobile}>
      <CloseButtonBox
        data-testid={BONUSES_TEST_IDS.wheel.close}
        onClick={() => dispatch(globalBonusWheelModalClose(false))}
      >
        <IconClose
          style={{
            color: theme.colors.icon.dimmed,
            cursor: 'pointer',
          }}
        />
      </CloseButtonBox>
      <Root style={{ width, height }}>
        <OutlineContainer>
          <ArrowContainer>
            <img src={'/imgs/bonus/wheel-arrow.png'} alt="arrow" />
          </ArrowContainer>
          {prizes.map((_, index: number) => {
            return (
              <DiamondWrapper
                key={index}
                style={{
                  transform: 'translate(-50%, -50%) rotate(' + index * eachItemDeg + 'deg)',
                }}
              >
                <AtomBonusWheelDiamond />
              </DiamondWrapper>
            )
          })}
          {prizes.map((_, index: number) => {
            return (
              <LightWrapper
                key={index}
                style={{
                  transform: `translate(-50%, -50%) rotate(${15 + index * eachItemDeg}deg)`,
                }}
              >
                <LightDot />
              </LightWrapper>
            )
          })}

          <RotateContainer style={{ transform: `rotate(${rotate}deg)` }}>
            <WheelInner style={{ width, height }}>
              {prizes.map((item, index: number) => {
                return (
                  <WheelSector
                    key={index}
                    style={{
                      width: `${width / 2}px`,
                      height: `${height / 2}px`,
                      maxWidth: `${width / 2}px`,
                      maxHeight: `${height / 2}px`,
                      background: backgroundArray[index],
                      transform: `rotate(${index * eachItemDeg - 0.7}deg)`,
                      zIndex: prizes.length - index,
                      clipPath: `polygon(0 0, ${3.418 * prizes.length}% 0, 98% 98%, 0 ${3.418 * prizes.length}%)`,
                    }}
                  >
                    <PrizeSectorWrapper $isMobile={isMobile}>
                      <PrizePhoto
                        src={resolveImageUrl(item.bonus_wheel_prize.image)}
                        $isMobile={isMobile}
                      />
                      <PrizeName $isMobile={isMobile}>
                        {getLocalizedString(item.bonus_wheel_prize.name)}
                      </PrizeName>
                    </PrizeSectorWrapper>
                  </WheelSector>
                )
              })}
            </WheelInner>
          </RotateContainer>
          {!isFinishedSpin ? (
            <SpinContainer>
              <SpinButton
                data-testid={BONUSES_TEST_IDS.wheel.spin}
                onClick={() => {
                  if (!isDisableSpinButton) {
                    getWinPrize()
                  }
                }}
              >
                <SpinText>SPIN!</SpinText>
              </SpinButton>
            </SpinContainer>
          ) : (
            <BlockedSpinContainer>
              <BlockedSpinText>Next Spin In</BlockedSpinText>
              <BonusWheelCountDownTimer showSpin={showSpin} />
              <BlockedGoodLuckText>Good Luck!</BlockedGoodLuckText>
            </BlockedSpinContainer>
          )}
        </OutlineContainer>
      </Root>

      <WinBox>
        <span>{t('bonus.spinTheWheelAndWin')}</span>
        <span>Free Spins Everyday</span>
      </WinBox>

      {!isDisableSpinButton && !isFinishedSpin ? (
        <SpinButtonLarge
          data-testid={BONUSES_TEST_IDS.wheel.spinLarge}
          onClick={() => {
            if (!isDisableSpinButton) {
              getWinPrize()
            }
          }}
        >
          <span>SPIN</span>
        </SpinButtonLarge>
      ) : (
        <LockedSpinButton>
          <IconLock size={24} style={{ color: theme.colors.icon.disabled }} />
          <span>SPIN</span>
        </LockedSpinButton>
      )}

      {isOpenBonusWheelWinModal && (
        <BonusWheelWinModal
          isOpenBonusWheelWinModal={isOpenBonusWheelWinModal}
          onCloseBonusWheelWinModal={onCloseBonusWheelWinModal}
          wonPrize={wonPrize}
        />
      )}
    </MainContainerWrapper>
  )
}

export default BonusWheelPage

const MainContainerWrapper = styled.div<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => (!$isMobile ? '500px' : '100%')};
  min-width: 340px;
  height: ${({ $isMobile }) => (!$isMobile ? '730px' : '100vh')};
  background:
    radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(27, 40, 69, 0.2) 100%),
    ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.surface.hover};
  box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
`

const Root = styled.div`
  margin-top: 16px;
  display: flex;
  box-sizing: border-box;
  position: relative;
  transition: 5s;
`

const OutlineContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 3px solid #e2b776;
  border-radius: 50%;
  position: relative;
`

const ArrowContainer = styled.div`
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
`

const DiamondWrapper = styled.div`
  position: absolute;
  width: auto;
  height: calc(100% + 65px);
  background: transparent;
  top: 50%;
  left: 50%;
  z-index: 2;
`

const LightWrapper = styled.div`
  position: absolute;
  width: auto;
  height: calc(100% + 30px);
  background: transparent;
  top: 50%;
  left: 50%;
  z-index: 2;
`

const LightDot = styled.div`
  width: 4px;
  height: 4px;
  background: #ffebcc;
  box-shadow: 0px 0px 4px 2px #ffffff;
`

const RotateContainer = styled.div`
  border-radius: 50%;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: 5s;
  box-sizing: border-box;
  box-shadow:
    0 0 0 5px #e2b776,
    0 0 0 18px #f2d9ae,
    0 0 0 23px #f7e4c6;
  background: #e2b776;
`

const WheelInner = styled.div`
  position: relative;
  border-radius: 50%;
`

const WheelSector = styled.div`
  box-sizing: border-box;
  position: absolute;
  min-width: 0px;
  min-height: 0px;
  border: 3px solid #e2b776;
  transform-origin: bottom right;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
`

const PrizeSectorWrapper = styled.div<{ $isMobile: boolean }>`
  position: relative;
  transform: rotate(45deg);
  top: ${({ $isMobile }) => (!$isMobile ? '10px' : '7px')};
  left: ${({ $isMobile }) => (!$isMobile ? '10px' : '8px')};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  width: ${({ $isMobile }) => (!$isMobile ? '100px' : '88px')};
`

const PrizePhoto = styled.img<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => (!$isMobile ? '24px' : '16px')};
  height: ${({ $isMobile }) => (!$isMobile ? '24px' : '16px')};
  border-radius: 50%;
`

const PrizeName = styled.span<{ $isMobile: boolean }>`
  line-height: 24px;
  text-align: right;
  text-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.25);
  font-size: ${({ $isMobile }) => (!$isMobile ? fontSize.sm : fontSize.xs)};
  font-style: normal;
  font-weight: 600;
  background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0.64) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  max-width: ${({ $isMobile }) => (!$isMobile ? '80px' : '70px')};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: auto;
`

const SpinContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: ${zIndex.fixed};
  border: 4px solid #e2b776;
  border-radius: 50%;
`

const SpinButton = styled.button`
  background: linear-gradient(180deg, #2178fb 0%, #103ca9 100%);
  border: 1px solid #1241af;
  border-radius: 50%;
  cursor: pointer;
  width: 72px;
  height: 72px;
  box-shadow:
    0px 4px 0px 0px rgba(255, 255, 255, 0.35) inset,
    0px 12px 2px 0px rgba(255, 255, 255, 0.25) inset;
`

const SpinText = styled.span`
  background: linear-gradient(180deg, #fbffff 0%, #bbdfea 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 24px;
  font-weight: 900;
  font-size: ${fontSize.xl};
  text-align: center;
  text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.25);
`

const BlockedSpinContainer = styled.div`
  box-sizing: border-box;
  width: 172px;
  height: 172px;
  border-radius: 50%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bg.secondary};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: ${zIndex.fixed};
  gap: 8px;
`

const BlockedSpinText = styled.span`
  font-size: ${fontSize.lg};
  font-weight: 600;
  line-height: 32px;
  color: ${({ theme }) => theme.colors.text.primary};
`

const BlockedGoodLuckText = styled.span`
  font-size: ${fontSize.lg};
  font-weight: 600;
  line-height: 32px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`

const WinBox = styled.div`
  margin-top: 20px;
  width: 207px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bg.overlay}40;
  gap: 8px;
  text-align: center;
  padding: 12px 32px;

  & :nth-child(1) {
    font-size: ${fontSize.base};
    font-weight: 600;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  & :nth-child(2) {
    font-size: 30px;
    font-weight: 700;
    line-height: 35px;
    color: ${({ theme }) => theme.colors.accent.secondary};
  }
`

const SpinButtonLarge = styled.div`
  margin-top: 16px;
  box-sizing: border-box;
  width: 115px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 32px;
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  padding: 12px 32px;
  box-shadow: 0px 2px 8px 0px ${({ theme }) => theme.colors.success}4D;
  background: ${({ theme }) => theme.colors.success};
  cursor: pointer;

  & span {
    font-size: ${fontSize['2xl']};
    font-weight: 700;
    line-height: 24px;
    color: ${({ theme }) => theme.colors.text.actionButton};
  }
`

const LockedSpinButton = styled.div`
  margin-top: 16px;
  box-sizing: border-box;
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 32px;
  padding: 12px 32px;
  flex-wrap: nowrap;
  background: ${({ theme }) => theme.colors.surface.hover};
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  gap: 6px;

  & span {
    font-size: ${fontSize['2xl']};
    font-weight: 700;
    line-height: 24px;
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`

const CloseButtonBox = styled.div`
  margin-top: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding-right: 16px;
`
