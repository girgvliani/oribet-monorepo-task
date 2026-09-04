import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { CustomModal, CustomPrimaryButton, fontSize } from '@oribet/ui'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { selectSystemSettings } from '@oribet/core/redux/selectors'
import { redirectToGoogleAuth } from '@oribet/core/util/googleAuth'
import { AUTH_TEST_IDS } from '@oribet/test-ids'

interface CurrencySelectionModalProps {
  open: boolean
  onClose: () => void
}

/**
 * Step shown on the `/currency-selection` route during the Google sign-up flow: the
 * user picks the wallet currency (it can't be changed later), then CONFIRM hands the
 * choice to the Google redirect. The currency list is the backend-provided
 * multi-currency list; single-currency brands still show their one currency.
 *
 * Theme-driven, so it adopts each brand's palette (e.g. gold on oribet-korea).
 */
const CurrencySelectionModal = ({ open, onClose }: CurrencySelectionModalProps) => {
  const { t } = useTranslation()
  const systemSettings = useAppSelector(selectSystemSettings)

  const supported = systemSettings?.multi_currency?.supported_currencies
  const currencies = supported?.length
    ? supported
    : systemSettings?.main_currency
      ? [systemSettings.main_currency]
      : []

  const [selected, setSelected] = useState('')

  // Default to the first available currency once the list resolves / the modal opens.
  useEffect(() => {
    if (open && !selected && currencies.length) setSelected(currencies[0])
  }, [open, currencies, selected])

  const onConfirm = () => {
    // Retry the Google flow with the chosen currency (`player_cur`); the backend then
    // registers the new player with this wallet and returns the token.
    redirectToGoogleAuth({ playerCur: selected || undefined })
  }

  return (
    <CustomModal open={open} onClose={onClose} testId={AUTH_TEST_IDS.currencySelection.modal}>
      <Shell>
        <Title>{t('auth.selectCurrencyTitle')}</Title>
        <Description>{t('auth.selectCurrencyDescription')}</Description>

        <Grid>
          {currencies.map(currency => (
            <Option
              key={currency}
              type="button"
              $active={selected === currency}
              aria-pressed={selected === currency}
              data-testid={`${AUTH_TEST_IDS.currencySelection.option}.${currency.toLowerCase()}`}
              onClick={() => setSelected(currency)}
            >
              {currency}
            </Option>
          ))}
        </Grid>

        <CustomPrimaryButton
          style={{ width: '100%' }}
          onClick={onConfirm}
          testId={AUTH_TEST_IDS.currencySelection.confirm}
        >
          {t('common.confirm')}
        </CustomPrimaryButton>
      </Shell>
    </CustomModal>
  )
}

export default CurrencySelectionModal

const Shell = styled.div`
  width: min(480px, 100vw - 32px);
  box-sizing: border-box;
  padding: 32px;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Title = styled.h2`
  margin: 0;
  text-align: center;
  font-size: ${fontSize.xl};
  font-weight: 700;
`

const Description = styled.p`
  margin: 0;
  text-align: center;
  font-size: ${fontSize.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 8px 0;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const Option = styled.button<{ $active: boolean }>`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.accent.brand : 'transparent')};
  cursor: pointer;
  font-family: inherit;
  font-size: ${fontSize.base};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.accent.brand : theme.colors.bg.primary};
  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.accent.brand : theme.colors.surface.hover};
  }
`
