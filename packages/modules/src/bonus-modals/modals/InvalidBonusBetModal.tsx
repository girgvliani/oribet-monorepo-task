import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { fontSize } from '@oribet/ui'
import { ActionButton } from '@oribet/modules/app-sidebar'
import { Defaults } from '@oribet/core/util/defaults'
import { type BetBounds, selectBetMessage } from './selectBetMessage'

/** Shown when the socket reports an out-of-range bonus bet (`invalidBonusBet`). */
function InvalidBonusBetModal({ minBet, maxBet }: BetBounds) {
  const { t } = useTranslation()
  const msg = selectBetMessage({ minBet, maxBet })
  return (
    <div>
      <Message>{t(msg.key, { defaultValue: msg.defaultValue, ...msg.params })}</Message>
      <ButtonContainer>
        <ActionButton
          color="orange"
          buttonType=""
          withIcon={false}
          onClick={() => Defaults.modals.invalidBonusBetModal?.hide()}
          label={t('common.ok', { defaultValue: 'OK' })}
          style={{ height: '32px' }}
        />
      </ButtonContainer>
    </div>
  )
}

export default InvalidBonusBetModal

const Message = styled.p`
  font-size: ${fontSize.base};
  font-weight: 600;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 16px;
`

const ButtonContainer = styled.div`
  padding: 8px;

  .button__label {
    font-size: 12px !important;
  }
`
