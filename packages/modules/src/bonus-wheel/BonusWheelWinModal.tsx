import { resolveImageUrl } from '@oribet/core/api/baseUrl'
import { getLocalizedString } from '@oribet/core/util/appUtil'
import { CustomModal } from '@oribet/ui'
import { FC } from 'react'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { IBonusWheelWinPrize } from '@oribet/core/types/Bonus.type'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'

interface bonusWheelWinModalProps {
  isOpenBonusWheelWinModal: boolean
  onCloseBonusWheelWinModal: () => void
  wonPrize: null | IBonusWheelWinPrize
}

const BonusWheelWinModal: FC<bonusWheelWinModalProps> = ({
  isOpenBonusWheelWinModal,
  onCloseBonusWheelWinModal,
  wonPrize,
}) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()

  return (
    /* idmap-ignore: structural modal wrapper */
    <CustomModal open={isOpenBonusWheelWinModal} onClose={onCloseBonusWheelWinModal}>
      <Root $isMobile={isMobile}>
        <WinTextWrapper $isMobile={isMobile}>
          <span>{t('bonus.congratulation')}!</span>
          <span>{t('bonus.youveWon')}</span>
        </WinTextWrapper>
        <WinBox $isMobile={isMobile}>
          <img
            src={resolveImageUrl(wonPrize?.image)}
            alt={'won_img'}
            style={{ width: '24px', height: '24px' }}
          />
          <span>{getLocalizedString(wonPrize?.name)}</span>
        </WinBox>
        <ContinuePlaying
          data-testid={BONUSES_TEST_IDS.wheel.continue}
          $isMobile={isMobile}
          onClick={() => onCloseBonusWheelWinModal()}
        >
          <span>{t('bonus.continuePlaying')}</span>
        </ContinuePlaying>
      </Root>
    </CustomModal>
  )
}

export default BonusWheelWinModal

const Root = styled.div<{ $isMobile: boolean }>`
  box-sizing: border-box;
  width: ${({ $isMobile }) => (!$isMobile ? '450px' : '370px')};
  height: 360px;
  background:
    radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(27, 40, 69, 0.2) 100%),
    ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 32px;
`

const WinTextWrapper = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  & :nth-child(1) {
    font-size: ${({ $isMobile }) => (!$isMobile ? '14px' : '12px')};
    font-weight: 600;
    line-height: ${({ $isMobile }) => (!$isMobile ? '16px' : '12px')};
    color: ${({ theme }) => theme.colors.text.tertiary};
    text-transform: uppercase;
  }

  & :nth-child(2) {
    font-size: ${({ $isMobile }) => (!$isMobile ? '24px' : '18px')};
    font-weight: 600;
    line-height: ${({ $isMobile }) => (!$isMobile ? '24px' : '18px')};
    color: ${({ theme }) => theme.colors.text.primary};
    text-transform: uppercase;
  }
`

const WinBox = styled.div<{ $isMobile: boolean }>`
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bg.overlay}40;
  gap: 16px;
  padding: 16px 32px;

  & :nth-child(2) {
    font-size: ${({ $isMobile }) => (!$isMobile ? '48px' : '36px')};
    font-weight: 700;
    line-height: ${({ $isMobile }) => (!$isMobile ? '64px' : '48px')};
    color: ${({ theme }) => theme.colors.accent.secondary};
  }
`

const ContinuePlaying = styled.div<{ $isMobile: boolean }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 32px;
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  padding: 16px 32px;
  box-shadow: 0px 2px 8px 0px ${({ theme }) => theme.colors.success}4D;
  background: ${({ theme }) => theme.colors.success};
  cursor: pointer;

  & span {
    font-size: ${({ $isMobile }) => (!$isMobile ? '24px' : '18px')};
    font-weight: 700;
    line-height: ${({ $isMobile }) => (!$isMobile ? '24px' : '18px')};
    color: ${({ theme }) => theme.colors.text.actionButton};
    text-transform: uppercase;
  }
`
