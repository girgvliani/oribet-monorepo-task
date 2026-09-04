import { fontSize, zIndex } from '@oribet/ui'
import { IconClose } from '@oribet/assets/icons/IconClose'
import { Defaults } from '@oribet/core/util/defaults'
import { BONUSES_TEST_IDS } from '@oribet/test-ids'
import styled, { keyframes, useTheme } from 'styled-components'

interface ModalWrapperProps {
  modalTitle: string
  children: React.ReactNode
  onClose: () => void
  width: string
  isVisible: boolean
  backdropAnimationDuration: number
  modalAnimationDuration: number
  animationType: string
}
function ModalWrapper({
  modalTitle,
  children,
  onClose,
  width,
  isVisible,
  backdropAnimationDuration,
  modalAnimationDuration,
  animationType,
}: ModalWrapperProps) {
  const theme = useTheme()
  return (
    <BackDrop
      $backdropAnimationDuration={backdropAnimationDuration}
      className={
        animationType === Defaults.defaultModalShowAnimationType
          ? Defaults.defaultModalShowAnimationType
          : Defaults.defaultModalHideAnimationType
      }
    >
      <ModalWrapperStyle
        $width={width}
        $isVisible={isVisible}
        className={
          animationType === Defaults.defaultModalShowAnimationType
            ? Defaults.defaultModalShowAnimationType
            : Defaults.defaultModalHideAnimationType
        }
        $modalAnimationDuration={modalAnimationDuration}
      >
        <Header>
          <ModalTitle>{modalTitle}</ModalTitle>
          <CloseButton data-testid={BONUSES_TEST_IDS.modal.close} onClick={onClose}>
            <IconClose style={{ color: theme.colors.text.primary }} />
          </CloseButton>
        </Header>

        {children}
      </ModalWrapperStyle>
    </BackDrop>
  )
}

export default ModalWrapper

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -40%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
`

const slideDown = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -40%);
  }
`

const transitionAnimationForOpen = keyframes`
  from {
    background-color: rgba(0, 0, 0, 0);
  }
  to {
    background-color: rgba(0, 0, 0, 0.5);
  }
`

const transitionAnimationForHide = keyframes`
  from {
    background-color: rgba(0, 0, 0, 0.5);
  }
  to {
    background-color: rgba(0, 0, 0, 0);
  }
`

const BackDrop = styled.div<{
  $backdropAnimationDuration: number
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${zIndex.modalWrapper};

  &.Slide_Up {
    animation: ${transitionAnimationForOpen}
      ${({ $backdropAnimationDuration }) => $backdropAnimationDuration}s ease-out forwards;
  }

  &.Slide_Down {
    animation: ${transitionAnimationForHide}
      ${({ $backdropAnimationDuration }) => $backdropAnimationDuration}s ease-out forwards;
  }
`

const ModalWrapperStyle = styled.div<{
  $width: string
  $isVisible: boolean
  $modalAnimationDuration: number
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 16px;
  width: ${({ $width }) => $width};
  box-shadow: inset 0px 0px 0px 1px ${({ theme }) => theme.colors.surface.borderSubtle};
  background:
    linear-gradient(
      0deg,
      ${({ theme }) => theme.colors.bg.primary},
      ${({ theme }) => theme.colors.bg.primary}
    ),
    linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.gradient.modalOverlayTint} 0%,
      rgba(0, 0, 0, 0) 100%
    );

  &.Slide_Up {
    animation: ${slideUp} ${({ $modalAnimationDuration }) => $modalAnimationDuration}s ease forwards;
  }

  &.Slide_Down {
    animation: ${slideDown} ${({ $modalAnimationDuration }) => $modalAnimationDuration}s ease
      forwards;
  }

  @media (max-width: 500px) {
    width: calc(100% - 16px);
  }
`

const Header = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  justify-content: space-between;
`

const ModalTitle = styled.h2`
  font-size: ${fontSize.xl};
  font-weight: 600;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text.primary};
`

const CloseButton = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.gradient.surfaceCard};
  box-shadow:
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.15),
    0px 1px 2px 0px rgba(0, 0, 0, 0.75);
`
