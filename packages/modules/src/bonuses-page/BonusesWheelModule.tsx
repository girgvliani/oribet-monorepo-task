import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { fontSize, media } from '@oribet/ui'
import { BonusWheel } from '@oribet/modules/app-header'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'

/**
 * "Spin & Invite" section — wraps the `<BonusWheel>` shell module in the page's standard
 * heading + grid layout. The wheel itself owns its own state; this is just chrome.
 */
const BonusesWheelModule = () => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Wrapper>
      <Heading>{t('bonus.spinAndInvite')}</Heading>
      <Grid>
        <BonusWheel
          isUserAuthenticated={true}
          callBack={() => {}}
          backgroundColor={theme.colors.bg.secondary}
          fullWidth
          partialBorder
          ctaTestId={BONUSES_TEST_IDS.wheel.banner}
        />
      </Grid>
    </Wrapper>
  )
}

export default BonusesWheelModule

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Heading = styled.span`
  font-weight: 600;
  font-size: ${fontSize.lg};
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-left: 16px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  ${media.sm} {
    grid-template-columns: 1fr;
  }
`
