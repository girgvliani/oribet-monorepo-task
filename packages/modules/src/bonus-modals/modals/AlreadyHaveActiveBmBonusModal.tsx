import { Defaults } from '@oribet/core/util/defaults'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'
import { useTranslation } from 'react-i18next'
import { fontSize, media } from '@oribet/ui'
import styled from 'styled-components'

function AlreadyHaveActiveBmBonusModal() {
  const { t } = useTranslation()

  return (
    <div>
      <BgImageContainerStyle>
        <BgImageStyle src="/imgs/bonus/layer.svg" alt="insurence1" />
        <ImgStyle alt="Gift Box Icon" src="/imgs/bonus/welcome-icon.png" />
      </BgImageContainerStyle>

      <Paragraph>
        Bonus in Progress.<br />
        You already have an active bonus being wagered. Any new bonus will be added to your bonus
        queue and will activate once the current one ends.
      </Paragraph>

      <ButtonContainer>
        <OkButton
          data-testid={`${BONUSES_TEST_IDS.modal.action}.already-active.ok`}
          onClick={() => Defaults.modals.alreadyHaveActiveBmBonusContainer?.hide()}
        >
          {t('common.ok')}
        </OkButton>
      </ButtonContainer>
    </div>
  )
}

export default AlreadyHaveActiveBmBonusModal

const Paragraph = styled.p`
  font-size: ${fontSize.base};
  font-weight: 600;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 16px;
`

const ButtonContainer = styled.div`
  padding: 8px;
`

const OkButton = styled.button`
  width: 100%;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: ${fontSize.sm};
  font-weight: 700;
  text-transform: uppercase;
  background: ${({ theme }) => theme.colors.button.primary.bg};
  color: ${({ theme }) => theme.colors.button.primary.text};
  border: ${({ theme }) => theme.colors.button.primary.border};

  &:hover {
    background: ${({ theme }) => theme.colors.button.primary.bgHover};
  }
`

const ImgStyle = styled.img`
  width: 80px;
  height: 80px;
  position: absolute;
  top: 50%;
  bottom: 16px;
  left: 50%;
  transform: translate(-50%, -50%);
`

const BgImageStyle = styled.img`
  mix-blend-mode: overlay;

  ${media.sm} {
    width: 100%;
  }
`
const BgImageContainerStyle = styled.div`
  position: relative;
  height: 112px;
  background: ${({ theme }) => theme.colors.gradient.bonusModalHeader};

  ${media.sm} {
    height: 136px;
  }
`
