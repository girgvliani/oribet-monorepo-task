import { claimBmBonus } from '@oribet/core/api/services/BmBonus.api'
import { useFetchActiveBmBonus } from '@oribet/modules/app-header'
import { ActionButton } from '@oribet/modules/app-sidebar'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { formatAmount } from '@oribet/core/util/appUtil'
import { Defaults } from '@oribet/core/util/defaults'
import { enqueueSnackbar } from 'notistack'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fontSize, media } from '@oribet/ui'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'
import styled from 'styled-components'

function MoveToMainBalanceModal() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const { data: activeBonusData, isRefetching } = useFetchActiveBmBonus(true)

  const moveToMainBalance = () => {
    setLoading(true)

    claimBmBonus()
      .then(res => {
        if (res.success) {
          setTimeout(() => {
            window.location.href = AppRoutePath.HOME()
          }, 500)
        }
      })
      .catch(err => {
        enqueueSnackbar(err.response.data.data.message, {
          variant: 'error',
          autoHideDuration: 40000,
        })
        setLoading(false)
      })
      .finally(() => {
        Defaults.modals.moveToMainBalanceModal?.hide()
      })
  }

  return (
    <div>
      <BgImageContainerStyle>
        <BgImageStyle src="/imgs/bonus/layer.svg" alt="insurence1" />

        <ImgStyle src="/imgs/bonus/modal-img-2.png" alt="insurence2" />
      </BgImageContainerStyle>

      <Paragraph>
        {t('bonusMoney.wageringComplete')} <br></br>
        {t('bonusMoney.wageringCompleteDescription')}
      </Paragraph>
      <ButtonsWrapper>
        <Button>
          <Label>{t('bonusMoney.amountToMove')}</Label>
          <Price>{formatAmount(activeBonusData?.data?.amount)} $</Price>
        </Button>
      </ButtonsWrapper>

      <ButtonContainer>
        <ActionButton
          data-testid={`${BONUSES_TEST_IDS.modal.action}.move-to-balance.confirm`}
          color="orange"
          buttonType=""
          withIcon={false}
          disabled={isRefetching || loading}
          onClick={moveToMainBalance}
          label={t('bonusMoney.claimAndTransferToRealBalance')}
          style={{ height: '32px' }}
        />
      </ButtonContainer>
    </div>
  )
}

export default MoveToMainBalanceModal

const Paragraph = styled.p`
  font-size: ${fontSize.base};
  font-weight: 600;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 16px;
`

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 16px;
`

const Button = styled.div`
  box-shadow:
    0px 1px 2px 0px rgba(0, 0, 0, 0.5),
    0 1px 0px 0px ${({ theme }) => theme.colors.surface.hover} inset;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 12px;
  padding: 8px 12px;
  box-sizing: border-box;
  width: 100%;
`

const Label = styled.span`
  font-size: ${fontSize.sm};
  font-weight: 600;
  line-height: 16px;
  display: block;
  opacity: 0.92;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`

const Price = styled.h5`
  font-size: ${fontSize.lg};
  font-weight: 600;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`

const ButtonContainer = styled.div`
  padding: 8px;

  .button__label {
    font-size: 12px !important;
  }
`

const ImgStyle = styled.img`
  width: 80px;
  height: 80px;
  position: absolute;
  top: 50%;
  bottom: 16px;
  left: 50%;
  transform: translate(-50%, -50%);
`

const BgImageStyle = styled.img`
  mix-blend-mode: overlay;

  ${media.sm} {
    width: 100%;
  }
`
const BgImageContainerStyle = styled.div`
  position: relative;
  height: 112px;

  ${media.sm} {
    height: 136px;
  }
`
