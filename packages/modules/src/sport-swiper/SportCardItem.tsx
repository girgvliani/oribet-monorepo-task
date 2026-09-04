import { sportSwiperData } from '../sport-swiper/SportSwiperModule'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { fontSize } from '@oribet/ui'
import { DISCOVERY_TEST_IDS } from '@oribet/test-ids'

interface ISportCardItem {
  sport: sportSwiperData
}

const SportCardItem = ({ sport }: ISportCardItem) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(AppRoutePath.SPORT())
  }

  return (
    <CardContainer
      data-testid={`${DISCOVERY_TEST_IDS.sportCard}.${sport.text}`}
      onClick={handleClick}
    >
      <IconWrapper>
        <sport.icon />
      </IconWrapper>
      <TitleWrapper>
        <Title>{t(sport.text)}</Title>
      </TitleWrapper>
    </CardContainer>
  )
}

export default SportCardItem

const CardContainer = styled.div`
  width: 180px;
  height: 158px;
  max-height: 96px;
  max-width: 180px;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 16px;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.bg.secondary};
  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: rgb(32, 41, 58);
  }

  svg {
    width: 24px;
    height: 24px;

    path {
      fill: ${({ theme }) => theme.colors.text.primary};
    }
  }
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
`

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40px;
`

const Title = styled.h3`
  line-height: 24px;
  font-weight: 600;
  font-size: ${fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};
`
