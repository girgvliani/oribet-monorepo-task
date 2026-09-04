import { getActiveCurrencySymbol } from '@oribet/core/util/currency'
import { IconBetTable } from '@oribet/assets/icons/IconBetTable'
import { getRanks } from '@oribet/core/util/UserProfileHelper'

import { lang } from '@oribet/core/util/appRoutePath'
import { useIsMobile } from '@oribet/core/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled, { css, keyframes, useTheme } from 'styled-components'
import { IBetsTableItem } from '@oribet/core/types/common.type'
import { fontSize } from '@oribet/ui'
import { DISCOVERY_TEST_IDS } from '@oribet/test-ids'

interface IBetTable {
  tableData: IBetsTableItem[]
  tableHeader: string[]
  newBetIds: Set<string>
}

const BetsTable = ({ tableData, tableHeader, newBetIds }: IBetTable) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const ranks = getRanks(theme)
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const getRankImgSrc = (rankName: string) => {
    return ranks.find(item => item.name.toLowerCase() === rankName.toLowerCase())?.img
  }

  return (
    <Root>
      <Header $isMobile={isMobile}>
        <HeaderTitle $isMobile={isMobile}>
          <IconBetTable size={isMobile ? 16 : 20} />
          <span style={{ textTransform: 'uppercase' }}>{t('profile.bets')}</span>
        </HeaderTitle>
      </Header>
      <div>
        <TableHeader>
          {tableHeader.map((header: string, index: number) => {
            return <TableHeaderCell key={index}>{header}</TableHeaderCell>
          })}
        </TableHeader>
        <TableBodyWrapper>
          <TableBodyContainer>
            <TableBody>
              {tableData.map((row: IBetsTableItem, index: number) => (
                <TableRow
                  key={`${row.player_id}-${row.game_id}-${row.create_dt}-${index}`}
                  $isNew={newBetIds.has(`${row.player_id}-${row.game_id}-${row.create_dt}`)}
                >
                  <TableCell>
                    <GameName
                      onClick={() => row.slug && navigate(`/${lang()}/games/${row.slug}`)}
                      data-testid={`${DISCOVERY_TEST_IDS.liveFeed.betRow}.${index}`}
                    >
                      {row.game_name}
                    </GameName>
                  </TableCell>
                  <TableCell>
                    <PlayerInfo>
                      <img
                        src={'/imgs/rank/' + getRankImgSrc(row.player_rank.rank)}
                        alt={'rank img'}
                        width={'22px'}
                        height={'24px'}
                      />
                      {row.player_name}
                    </PlayerInfo>
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <span>
                        {getActiveCurrencySymbol(row.currency)}
                        {Number(row.bet) === 0 ? '_' : Number(row.bet).toFixed(2)}
                      </span>
                    </TableCell>
                  )}
                  <TableCellLast>
                    <WinAmount $isHighWin={Number(Number(row.win).toFixed(2)) >= 25}>
                      {getActiveCurrencySymbol(row.currency)}
                      {Number(row.win).toFixed(2)}
                    </WinAmount>
                  </TableCellLast>
                </TableRow>
              ))}
            </TableBody>
          </TableBodyContainer>
          <Gradient />
        </TableBodyWrapper>
      </div>
    </Root>
  )
}

export default BetsTable

const Root = styled.div`
  width: 100%;
`

const Header = styled.div<{ $isMobile: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 16px 16px 24px 16px;
  color: ${({ theme }) => theme.colors.text.primary};

  & path {
    fill: ${({ theme }) => theme.colors.text.primary};
  }
`

const HeaderTitle = styled.div<{ $isMobile: boolean }>`
  display: flex;
  gap: 8px;
  align-items: center;
  font-weight: 600;
  font-size: ${({ $isMobile }) => ($isMobile ? fontSize.base : fontSize.lg)};
  line-height: 24px;
`

const TableHeader = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 700;
  font-size: ${fontSize.sm};
  line-height: 24px;
  text-transform: uppercase;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 8px;
`

const TableHeaderCell = styled.div`
  flex: 1;
  padding: 8px 16px;

  &:last-child {
    text-align: right;
  }
`

const TableBodyWrapper = styled.div`
  position: relative;
  height: 500px;
  margin-top: 8px;
  border-radius: 8px;
`

const TableBodyContainer = styled.div`
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
`

const Gradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    ${({ theme }) => theme.colors.bg.primary} 100%
  );
  width: 100%;
  height: 82px;
  z-index: 1;
  pointer-events: none;
`

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-radius: 8px;
`

const slideInBet = keyframes`
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const TableRow = styled.div<{ $isNew?: boolean }>`
  display: flex;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  font-size: ${fontSize.sm};
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text.secondary};
  ${({ $isNew }) =>
    $isNew &&
    css`
      animation: ${slideInBet} 0.3s ease-out forwards;
    `}
`

const TableCell = styled.div`
  display: flex;
  flex: 1;
  padding: 12px 16px;
  align-items: center;
  gap: 8px;

  & rect {
    fill: ${({ theme }) => theme.colors.surface.border};
  }
`

const TableCellLast = styled(TableCell)`
  justify-content: flex-end;
  color: ${({ theme }) => theme.colors.text.primary};
`

const GameName = styled.span`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
`

const PlayerInfo = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
`

const WinAmount = styled.span<{ $isHighWin: boolean }>`
  color: ${({ $isHighWin, theme }) =>
    $isHighWin ? theme.colors.success : theme.colors.text.primary};
`
