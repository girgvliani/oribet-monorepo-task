import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { fontSize } from '@oribet/ui'
import { useQueryClient } from '@tanstack/react-query'
import { Cashback, RakeBack, useFetchCashBacks, useFetchRakeBacks } from '@oribet/modules/app-header'

/**
 * Rakeback + cashback grid. Each card calls back into React Query invalidation when its
 * data changes (claim/redeem). Hidden if both arrays are empty.
 */
const BonusesRakebackCashbackModule = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { data: CashBacks } = useFetchCashBacks()
  const { data: RakeBacks } = useFetchRakeBacks()

  const hasAny = (RakeBacks?._data?.length ?? 0) + (CashBacks?._data?.length ?? 0) > 0
  if (!hasAny) return null

  return (
    <Wrapper>
      <Heading>{t('bonus.rakebackAndCashback')}</Heading>
      <Grid>
        {RakeBacks?._data?.map(rakeBack => (
          <RakeBack
            key={rakeBack.id}
            rakeBackInfo={rakeBack}
            reloadData={() => queryClient.invalidateQueries({ queryKey: ['rakeback'] })}
            backgroundColor={theme.colors.bg.secondary}
            partialBorder
          />
        ))}
        {CashBacks?._data?.map(cashBack => (
          <Cashback
            key={cashBack.id}
            cashBackInfo={cashBack}
            reloadData={() => queryClient.invalidateQueries({ queryKey: ['cashback'] })}
            backgroundColor={theme.colors.bg.secondary}
            partialBorder
          />
        ))}
      </Grid>
    </Wrapper>
  )
}

export default BonusesRakebackCashbackModule

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
  grid-template-columns: repeat(auto-fill, minmax(244px, 1fr));
  gap: 16px;
`
