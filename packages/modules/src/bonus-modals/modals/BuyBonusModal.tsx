import { getActiveCurrencySymbol } from '@oribet/core/util/currency'
import { buyBmBonus } from '@oribet/core/api/services/BmBonus.api'
import { useFetchActiveBmBonus } from '@oribet/modules/app-header'
import { ActionButton } from '@oribet/modules/app-sidebar'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'

import { Defaults } from '@oribet/core/util/defaults'
import { enqueueSnackbar } from 'notistack'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { fontSize, media } from '@oribet/ui'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'
import styled from 'styled-components'

function BuyBonusModal({
  data,
}: {
  data: {
    amount: string
    price: string
    wagering_coefficient: string
    bonus_id: number
    buy_amount?: number
  }
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const activeBmBonus = useFetchActiveBmBonus()
  const [isLoading, setisLoading] = useState(false)

  const onClaim = () => {
    const params: { bonus_id: number; buy_amount?: number } = {
      bonus_id: data.bonus_id,
    }

    if (data.buy_amount) {
      params.buy_amount = data.buy_amount
    }

    setisLoading(true)

    buyBmBonus(params)
      .then(res => {
        if (res.success) {
          activeBmBonus.refetch()

          enqueueSnackbar(res.data.message, {
            variant: 'success',
            autoHideDuration: 2000,
          })

          Defaults.modals.buyBonusModal?.hide()
          navigate(AppRoutePath.BONUSMODE())
        } else if (!res.success) {
          Defaults.modals.buyBonusModal?.hide()
          enqueueSnackbar(res?.data?.data?.message, {
            variant: 'error',
            autoHideDuration: 3000,
          })
        }
      })
      .catch(err => {
        enqueueSnackbar(err.response.data.data.message, {
          variant: 'error',
          autoHideDuration: 3000,
        })
        Defaults.modals.buyBonusModal?.hide()
      })
      .finally(() => {
        setisLoading(false)
      })
  }

  return (
    <div>
      <BgImageContainerStyle>
        <BgImageStyle src="/imgs/bonus/layer.svg" alt="insurence1" />
        <ImgStyle src="/imgs/bonus/modal-img-2.png" alt="bonus money" />
      </BgImageContainerStyle>

      <Paragraph>
        {t('bonusMoney.headsUp')} <br></br>
        {t('bonusMoney.buyBonusDescription')}
      </Paragraph>
      <ButtonsWrapper>
        <Button>
          <Label>{t('bonusMoney.bonusMoney')}</Label>
          <Price>{getActiveCurrencySymbol()}{data.amount}</Price>
        </Button>
        <Button>
          <Label>{t('newBonus.wagerRequirement')}</Label>
          <Price>{data.wagering_coefficient}x</Price>
        </Button>
      </ButtonsWrapper>

      <ButtonsWrapper style={{ paddingTop: '0px' }}>
        <Button>
          <Label>{t('newBonus.Price')}</Label>
          <Price>{getActiveCurrencySymbol()}{data.price}</Price>
        </Button>
      </ButtonsWrapper>

      <ButtonContainer>
        <ActionButton
          data-testid={`${BONUSES_TEST_IDS.modal.action}.buy-bonus.confirm`}
          onClick={onClaim}
          color="green"
          buttonType=""
          disabled={isLoading}
          label={t('bonusMoney.claimAndSwitchToBonusMode')}
          style={{ height: '32px' }}
        />
      </ButtonContainer>
    </div>
  )
}

export default BuyBonusModal

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
