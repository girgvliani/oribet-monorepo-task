import { getPrizeWithPromo } from '@oribet/core/api/services/Bonus.api'
import { extractApiError } from '@oribet/core/util/extractApiError'
import { AtomPromoCodeCard } from '@oribet/assets/atoms/AtomPromoCodeCard'
import PromoCodeModal from './PromoCodeModal'
import { DepositButton, CustomInput, fontSize } from '@oribet/ui'
import { lang } from '@oribet/core/util/appRoutePath'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'

const PromoCode = () => {
  const { t } = useTranslation()
  const [promoCode, setPromoCode] = useState<any>('')
  const [open, setOpen] = useState<boolean>(false)
  const [isFreeSpin, setIsFreeSpin] = useState<boolean>(true)
  const [amount, setAmount] = useState<string>('')
  const [gameName, setGameName] = useState<string>('')
  const [gameId, setGameId] = useState<string>('')
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const onActive = () => {
    getPrizeWithPromo({ promo_code: promoCode })
      .then(response => {
        if (response.data.data.bonus_data.bonus_type === 'free spin') {
          setAmount(String(response.data.data.bonus_data.amount))
          setIsFreeSpin(true)
          setGameName(response.data.data.game_data.name)
          setGameId(response.data.data.game_data.game_slug)
        } else {
          setAmount(String(response.data.data.bonus_data.amount))
          setIsFreeSpin(false)
          setGameName('')
          setGameId('')
        }
        setOpen(true)
        enqueueSnackbar(response.data.data.message, {
          variant: 'success',
        })
      })
      .catch(error => {
        enqueueSnackbar(extractApiError(error), {
          variant: 'error',
        })
      })
  }

  const onOpenGamePage = () => {
    setOpen(false)
    navigate(`/${lang()}/games/${gameId}`)
  }

  return (
    <Root>
      <IconWrapper>
        <AtomPromoCodeCard />
      </IconWrapper>
      <ContentContainer>
        <Title>{t('bonus.doYouHavePromoCode')}</Title>
        <CustomInput
          onChange={event => {
            setPromoCode(event.target.value && event.target.value.slice(0, 10))
          }}
          size={'small'}
          placeholder={t('bonus.enterPromoCode')}
          startAdornment={<div />}
          value={promoCode}
          testId={BONUSES_TEST_IDS.list.promoInput}
          endAdornment={
            <DepositButton
              onClick={() => Boolean(promoCode) && onActive()}
              testId={BONUSES_TEST_IDS.list.promoSubmit}
              style={{
                minWidth: 83,
              }}
            >
              {t('bonus.activate')}
            </DepositButton>
          }
        />
      </ContentContainer>
      {open && (
        <PromoCodeModal
          open={open}
          setOpen={() => setOpen(false)}
          amount={amount}
          gameName={gameName}
          isFreeSpin={isFreeSpin}
          onClickButton={() => (isFreeSpin ? onOpenGamePage() : setOpen(false))}
        />
      )}
    </Root>
  )
}

export default PromoCode

const Root = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #ffffff0d;
  height: 100%;
  gap: 24px;
  align-items: center;
  background: ${({ theme }) => theme.colors.gradient.promoCode};
`

const IconWrapper = styled.div`
  & svg {
    height: 100%;
  }
`

const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 80px;
`

const Title = styled.div`
  font-weight: 700;
  font-size: ${fontSize.base};
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text.primary};
`
