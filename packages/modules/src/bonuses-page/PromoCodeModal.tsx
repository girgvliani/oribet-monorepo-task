import { AtomBonusFreeSpinReward } from '@oribet/assets/atoms/AtomBonusFreeSpinReward'
import { AtomBonusRewardClaimed } from '@oribet/assets/atoms/AtomBonusRewardClaimed'
import { CustomModal, fontSize } from '@oribet/ui'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'

interface IPromoCodeModal {
  open: boolean
  setOpen: () => void
  isFreeSpin: boolean
  amount: string
  gameName: string
  onClickButton: () => void
}

const PromoCodeModal = ({
  open,
  setOpen,
  isFreeSpin,
  amount,
  gameName,
  onClickButton,
}: IPromoCodeModal) => {
  const { t } = useTranslation()

  return (
    // idmap-ignore: structural modal wrapper
    <CustomModal open={open} onClose={() => setOpen()}>
      <Root>
        {!isFreeSpin ? <AtomBonusRewardClaimed /> : <AtomBonusFreeSpinReward />}
        <ContentContainer>
          <PrimaryText>{!isFreeSpin ? `${amount} USDT` : amount}</PrimaryText>
          <SecondaryText>
            {isFreeSpin ? t('promoCode.freeSpinsGranted') : t('promoCode.received')}
          </SecondaryText>
        </ContentContainer>
        <Description>
          {!isFreeSpin
            ? t('promoCode.receivedAmountFromPromo', { amount })
            : t('promoCode.receivedFreeSpinsOnGame', { amount, gameName })}
        </Description>
        <ActionButton
          onClick={() => onClickButton && onClickButton()}
          data-testid={BONUSES_TEST_IDS.list.promoSubmit}
        >
          {isFreeSpin ? t('bonus.playFreeSpins') : t('common.continue')}
        </ActionButton>
      </Root>
    </CustomModal>
  )
}

export default PromoCodeModal

const Root = styled.div`
  height: 344px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.surface.hover};
  background: ${({ theme }) => theme.colors.bg.secondary};
  box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  gap: 32px;
  flex-direction: column;
  width: 272px;
`

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-direction: column;
`

const PrimaryText = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize['3xl']};
  font-weight: 700;
  line-height: 24px;
`

const SecondaryText = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
  line-height: 16px;
  font-size: ${fontSize.base};
`

const Description = styled.div`
  font-size: ${fontSize.sm};
  color: #ffffff80;
  line-height: 16px;
  text-align: center;
`

const HighlightText = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
`

const ActionButton = styled.div`
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.surface.borderSubtle};
  background: #65a30d;
  box-shadow: 0px 2px 8px 0px rgba(101, 163, 13, 0.3);
  padding: 4px 16px 4px 8px;
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 6px;
  align-self: stretch;
  cursor: pointer;
  user-select: none;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.sm};
  font-weight: 700;
  line-height: 24px;
`
