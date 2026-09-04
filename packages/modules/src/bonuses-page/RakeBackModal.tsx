import { ActionButton } from '@oribet/modules/app-sidebar'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { Defaults } from '@oribet/core/util/defaults'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { fontSize } from '@oribet/ui'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'

function RakeBackModal({ value }: { value: string }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div>
      <div style={{ position: 'relative', height: '112px' }}>
        <img src="/imgs/bonus/layer.svg" alt="insurence1" style={{ mixBlendMode: 'overlay' }} />

        <ImgStyle src="/imgs/bonus/rakeback-icon.png" alt="rakeback" />
      </div>

      <Paragraph>{t('rakeBack.description')}</Paragraph>
      <ButtonsWrapper>
        <Button>
          <Label>{t('sidebar.claim')}</Label>
          <Price>{value}</Price>
        </Button>
      </ButtonsWrapper>

      <ButtonContainer>
        <ActionButton
          onClick={() => {
            Defaults.modals.promoCodeModal?.hide()
            navigate(AppRoutePath.BONUSMODE())
          }}
          color="green"
          label={t('sidebar.claim')}
          data-testid={`${BONUSES_TEST_IDS.list.action}.rakeback.claim`}
          style={{ height: '32px' }}
        />
      </ButtonContainer>
    </div>
  )
}

export default RakeBackModal

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
    font-size: ${fontSize.sm} !important;
  }
`

const ImgStyle = styled.img`
  width: 80px;
  height: 80px;
  position: absolute;
  top: 16px;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
`
