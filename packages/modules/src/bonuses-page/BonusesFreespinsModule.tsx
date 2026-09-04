import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { fontSize, media } from '@oribet/ui'
import { useBonusesPageData } from '@oribet/core/hooks/bonus/useBonusesPageData'
import FreespinCard from './FreespinCard'

/**
 * Freespin bonuses grid. Renders nothing when the list is empty so the page collapses
 * naturally rather than showing an empty heading.
 */
const BonusesFreespinsModule = () => {
  const { t } = useTranslation()
  const { freespinBonuses } = useBonusesPageData()

  if (freespinBonuses.length === 0) return null

  return (
    <Wrapper>
      <Heading>{t('bonus.freespins')}</Heading>
      <Grid>
        {freespinBonuses.map((bonus: any) => (
          <FreespinCard key={bonus.id} bonus={bonus} />
        ))}
      </Grid>
    </Wrapper>
  )
}

export default BonusesFreespinsModule

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
