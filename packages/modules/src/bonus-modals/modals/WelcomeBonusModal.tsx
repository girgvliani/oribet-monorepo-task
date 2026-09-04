import { buyBmBonus } from '@oribet/core/api/services/BmBonus.api'
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
import { IBMBonusMoney } from '@oribet/core/types/BonusMoney.type'

function WelcomeBonusModal({
  data,
}: {
  data: {
    yourDeposit: string
    bonusAmout: string
    totalBonusMoney: string
    wagering_coefficient: string
    desc: string
    type: string
    currentWelcomeBonus: IBMBonusMoney | undefined
  }
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setloading] = useState(false)

  const onClaim = () => {
    setloading(true)

    if (data.currentWelcomeBonus) {
      const params: { bonus_id: number; buy_amount: number } = {
        bonus_id: data.currentWelcomeBonus.id,
        buy_amount: Number(data.yourDeposit),
      }
      buyBmBonus(params)
        .then(res => {
          if (res.success) {
            navigate(AppRoutePath.BONUSMODE())
            Defaults.modals.welcomeBonusModal?.hide()
          } else if (!res.success) {
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
        })
        .finally(() => {
          setloading(false)
        })
    }
  }

  return (
    <div>
      <BgImageContainerStyle>
        <BgImageStyle src="/imgs/bonus/layer.svg" alt="insurence1" />
        <ImgStyle alt="Gift Box Icon" src="/imgs/bonus/welcome-icon.png" />
      </BgImageContainerStyle>

      <Paragraph
        dangerouslySetInnerHTML={{
          __html: data.desc,
        }}
      ></Paragraph>
      <ButtonsWrapper style={{ paddingBottom: '8px' }}>
        <Button>
          <Label>{t('bonusMoney.selectedAmount')}</Label>
          <Price>{data.yourDeposit}$</Price>
        </Button>
        <Button>
          <Label>{t('bonusMoney.bonus')}</Label>
          <Price>{data.bonusAmout}%</Price>
        </Button>
      </ButtonsWrapper>

      <ButtonsWrapper style={{ paddingTop: '0px' }}>
        <Button>
          <Label>{t('bonusMoney.bonusMoneyTotal')}</Label>
          <Price>{data.totalBonusMoney}$</Price>
        </Button>
        <Button>
          <Label>{t('newBonus.wagerRequirement')}</Label>
          <Price>{data.wagering_coefficient}x</Price>
        </Button>
      </ButtonsWrapper>

      <ButtonContainer>
        <ActionButton
          data-testid={`${BONUSES_TEST_IDS.modal.action}.welcome-bonus.confirm`}
          color="orange"
          buttonType=""
          withIcon={false}
          disabled={loading}
          onClick={onClaim}
          label={t('bonusMoney.activateAndStartPlaying')}
          style={{ height: '32px' }}
        />
      </ButtonContainer>
    </div>
  )
}

export default WelcomeBonusModal

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
  background: ${({ theme }) => theme.colors.gradient.bonusModalHeader};

  ${media.sm} {
    height: 136px;
  }
`
