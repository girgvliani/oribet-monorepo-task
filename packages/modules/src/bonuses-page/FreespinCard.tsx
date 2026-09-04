import { ActionButton, BUTTON_TYPE, BonusCard } from '@oribet/modules/app-sidebar'
import { CustomModal, fontSize } from '@oribet/ui'
import { lang } from '@oribet/core/util/appRoutePath'
import { getLocalizedString } from '@oribet/core/util/appUtil'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { IFreespinBonus } from '@oribet/core/types/Bonus.type'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'

interface FreespinCardProps {
  bonus: IFreespinBonus
}

const FreespinCard: FC<FreespinCardProps> = ({ bonus }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [showGameSelect, setShowGameSelect] = useState(false)

  const games = bonus.bonus?.bonus_games || []

  const handleClaim = () => {
    if (games.length === 1) {
      navigate(`/${lang()}/games/${games[0].game.slug}`)
    } else if (games.length > 1) {
      setShowGameSelect(true)
    }
  }

  return (
    <>
      <BonusCard
        icon={<SpinIcon>🎰</SpinIcon>}
        title={getLocalizedString(bonus.bonus?.name) || t('bonus.freespins')}
        infoText={`${bonus.amount} spins`}
        backgroundColor={theme.colors.bg.secondary}
        partialBorder
        fullWidth
        testId={`${BONUSES_TEST_IDS.list.card}.${bonus.id}`}
        footerContent={
          <ActionButton
            color="green"
            buttonType={BUTTON_TYPE.Claim}
            label={t('bonus.claimFreespin')}
            disabled={games.length === 0}
            onClick={handleClaim}
            data-testid={`${BONUSES_TEST_IDS.list.freespinGames}.${bonus.id}`}
            style={{ marginTop: '4px' }}
          />
        }
      />

      {/* idmap-ignore: structural modal wrapper */}
      <CustomModal open={showGameSelect} onClose={() => setShowGameSelect(false)}>
        <GameSelectModal>
          <GameSelectHeader>
            <GameSelectTitle>{t('bonus.selectGame')}</GameSelectTitle>
            <GameSelectDesc>{t('bonus.selectGameDesc')}</GameSelectDesc>
          </GameSelectHeader>
          <GameList>
            {games.map(bg => (
              <GameButton
                key={bg.game.id}
                data-testid={`${BONUSES_TEST_IDS.list.freespinPlay}.${bg.game.id}`}
                onClick={() => {
                  setShowGameSelect(false)
                  navigate(`/${lang()}/games/${bg.game.slug}`)
                }}
              >
                {bg.game.game_title}
              </GameButton>
            ))}
          </GameList>
        </GameSelectModal>
      </CustomModal>
    </>
  )
}

export default FreespinCard

const SpinIcon = styled.span`
  font-size: ${fontSize.lg};
  line-height: 1;
`

const GameSelectModal = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: 12px;
  width: 340px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const GameSelectHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const GameSelectTitle = styled.h3`
  font-size: ${fontSize.lg};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`

const GameSelectDesc = styled.p`
  font-size: ${fontSize.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;
`

const GameList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const GameButton = styled.button`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.surface.border};
  background: ${({ theme }) => theme.colors.bg.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.sm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.surface.hover};
    border-color: ${({ theme }) => theme.colors.accent.brand};
  }
`
