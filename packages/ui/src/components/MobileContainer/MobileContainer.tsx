import { zIndex } from '../../tokens'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const HEADER_INFO = 0
const HEADER_HEIGHT = 64
const MOBILE_MENU_HEIGHT = 60

interface IMobileContainer {
  open: boolean
  setOpen: (open: boolean) => void
  children?: React.ReactNode
  trackBottomClick?: boolean
  extendToBottom?: boolean
}

export const MobileContainer = ({
  open,
  setOpen,
  trackBottomClick = false,
  extendToBottom = false,
  children,
}: IMobileContainer) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Add effect to handle clicks outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only proceed if sidebar is open
      if (!open) return

      // Check if click is in header area (top 96px of the page)
      const isInHeaderArea = event.clientY <= 64

      const isInMobileMenuArea = event.clientY >= window.innerHeight - 60 && trackBottomClick

      // Check if click is outside of sidebar
      const isOutsideSidebar =
        containerRef.current && !containerRef.current.contains(event.target as Node)

      // Close sidebar if click is both outside sidebar and in header area
      if (isOutsideSidebar && (isInHeaderArea || isInMobileMenuArea)) {
        // small delay so you can toggle container with the
        // header or bottom menu buttons
        setTimeout(() => {
          if (open) setOpen(false)
        }, 50)
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside)

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, setOpen])

  return (
    <RootMobileContainer ref={containerRef} $isSidebarOpen={open} $extendToBottom={extendToBottom}>
      {children}
    </RootMobileContainer>
  )
}

const RootMobileContainer = styled.div<{
  $isSidebarOpen: boolean
  $extendToBottom: boolean
}>`
  position: fixed;
  top: ${HEADER_HEIGHT + HEADER_INFO}px;
  left: 0;
  height: ${({ $extendToBottom }) =>
    $extendToBottom
      ? `calc(100% - ${HEADER_HEIGHT + HEADER_INFO}px - env(safe-area-inset-bottom))`
      : `calc(100% - ${HEADER_HEIGHT + HEADER_INFO + MOBILE_MENU_HEIGHT}px - env(safe-area-inset-bottom))`};
  width: 100%;
  background-color: ${({ theme }) => theme.colors.bg.sidebar};
  z-index: ${zIndex.overlay};
  overflow-y: auto;
  transform: ${({ $isSidebarOpen }) => ($isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;

  /* Hide scrollbar but allow scrolling */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  @media (min-width: 1024px) {
    transform: translateX(0);
    position: sticky;
  }
`
