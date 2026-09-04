import { type ReactNode } from 'react'
import styled from 'styled-components'
import { Container } from '@oribet/ui'
import { useAppSelector } from '@oribet/core/redux/hooks'
import { SeoContainer } from '@oribet/modules/head-section'
import { AuthorizedHeroBannerModule } from '@oribet/modules/authorized-hero-banner'
import type { seoType } from '@oribet/core/types/seo.type'

interface LobbyContainerProps {
  children: ReactNode
  seo?: seoType
}

/**
 * Lobby chrome. Renders the authed hero banner outside the inner padded
 * `<Container>` so it spans the full lobby width (edge-to-edge), then drops the
 * caller's children inside the padded column.
 */
const LobbyContainer = ({ children, seo }: LobbyContainerProps) => {
  const isUserAuthenticated = useAppSelector(s => !!s.user.isUserAuthorized)

  return (
    <Root>
      {seo && <SeoContainer screen={seo} />}
      <Container p={24} flex flexDirection="column" gap={24}>
        {children}
      </Container>
    </Root>
  )
}

export default LobbyContainer

const Root = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.bg.primary};
`
