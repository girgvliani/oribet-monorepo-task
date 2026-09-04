import { media } from '@oribet/ui'
import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.colors.bg.primary};
    overflow: hidden !important;
  }

  html {
    font-size: 16px;

    ${media.sm} {
      font-size: 15px;
    }
  }

  html,
  body,
  #root {
    height: 100%;
    width: 100%;
  }

  * {
    margin: 0;
    padding: 0;
    font-family: 'Titillium Web', sans-serif !important;
  }

  *:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent.primary};
    outline-offset: 2px;
  }

  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }

  ::-webkit-scrollbar-track {
    background: 0 0 !important;
  }

  ::-webkit-scrollbar-thumb {
    background-color: transparent !important;
    border-radius: 0 !important;
    border: none !important;
  }

  #chat-widget-container {
    visibility: visible !important;
  }

  @media not all and (min-resolution: 0.001dpcm) {
    @supports (-webkit-appearance: none) {
      &[style*='overflow:hidden'],
      &[style*='overflow: hidden'] {
        position: fixed;
        touch-action: none;
        -ms-touch-action: none;
        -webkit-overflow-scrolling: touch;
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  .MuiModal-root {
    overflow-y: scroll !important;
  }

  @media only screen and (max-width: 600px) {
    #chat-widget-container iframe {
      user-select: none;
      pointer-events: none;
    }
  }
`
