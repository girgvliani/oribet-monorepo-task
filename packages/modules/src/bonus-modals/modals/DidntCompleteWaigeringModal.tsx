import { ActionButton, BUTTON_TYPE } from '@oribet/modules/app-sidebar'
import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { fontSize, media } from '@oribet/ui'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'
import styled from 'styled-components'

function DidntCompleteWaigeringModal() {
  return (
    <div>
      <BgImageContainerStyle>
        <BgImageStyle src="/imgs/bonus/layer.svg" alt="insurence1" />
        <ImgStyle src="/imgs/bonus/modal-img-2.png" alt="bonus money" />
      </BgImageContainerStyle>

      <Paragraph>Unfortunately bonus balance ran out before you met the requirement.</Paragraph>

      <ButtonContainer>
        <ActionButton
          data-testid={`${BONUSES_TEST_IDS.modal.action}.didnt-complete-wagering.ok`}
          color="blue"
          withIcon={false}
          onClick={() => {
            window.location.href = AppRoutePath.HOME()
          }}
          buttonType={BUTTON_TYPE.Claim}
          label="Back to Real Money"
          style={{ height: '32px' }}
        />
      </ButtonContainer>
    </div>
  )
}

export default DidntCompleteWaigeringModal

const Paragraph = styled.p`
  font-size: ${fontSize.base};
  font-weight: 600;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 16px;
`

const ButtonContainer = styled.div`
  padding: 8px;

  .button__label {
    font-size: ${fontSize.sm} !important;
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

  ${media.sm} {
    height: 136px;
  }
`
