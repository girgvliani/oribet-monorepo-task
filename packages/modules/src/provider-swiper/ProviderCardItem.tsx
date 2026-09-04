import { resolveImageUrl } from '@oribet/core/api/baseUrl'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { DISCOVERY_TEST_IDS } from '@oribet/test-ids'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { fontSize } from '@oribet/ui'
import styled from 'styled-components'
import { IProvider } from '@oribet/core/types/Game.type'

export type ProviderCardVariant = 'full' | 'imageOnly'

interface IProviderCardItem {
  provider: IProvider
  /**
   * `full` (default): image + title + game count, 180×158.
   * `imageOnly`: just the logo, 180×80.
   */
  variant?: ProviderCardVariant
  /** Base path the card links to (`?provider=<id>` is appended). Defaults to the slots list. */
  to?: string
}

const ProviderCardItem = ({ provider, variant = 'full', to }: IProviderCardItem) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const imgUrl = resolveImageUrl(provider.img)

  const handleClick = () => {
    navigate(`${to ?? AppRoutePath.GAMELIST()}?provider=${provider.id}`)
  }

  return (
    <Card
      onClick={handleClick}
      $variant={variant}
      data-testid={`${DISCOVERY_TEST_IDS.provider.card}.${String(provider.id)}`}
    >
      <ImageWrapper>
        <img src={imgUrl} alt={provider.title} />
      </ImageWrapper>
      {variant === 'full' && (
        <TextWrapper>
          <Title>{provider.title}</Title>
          <GameCount>
            {provider.games_count}{' '}
            {provider.games_count === 1 || provider.games_count === 0
              ? t('game')
              : t('games.label')}
          </GameCount>
        </TextWrapper>
      )}
    </Card>
  )
}

export default ProviderCardItem

const Card = styled.div<{ $variant: ProviderCardVariant }>`
  width: 180px;
  height: ${({ $variant }) => ($variant === 'imageOnly' ? '80px' : '158px')};
  max-width: 180px;
  max-height: ${({ $variant }) => ($variant === 'imageOnly' ? '80px' : '158px')};
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: ${({ $variant }) => ($variant === 'imageOnly' ? '12px 16px' : '16px')};
  align-items: center;
  justify-content: ${({ $variant }) => ($variant === 'imageOnly' ? 'center' : 'space-between')};
  box-sizing: border-box;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.bg.secondary};
  transition: background 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.surface.hover};
  }
`

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;

  img {
    max-width: 100%;
    height: auto;
    min-width: 0;
    min-height: 0;
  }
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  text-align: center;
`

const Title = styled.h3`
  line-height: 24px;
  font-weight: 600;
  font-size: ${fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`

const GameCount = styled.p`
  line-height: 16px;
  font-weight: 600;
  font-size: ${fontSize.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  margin: 4px 0 0;
`
