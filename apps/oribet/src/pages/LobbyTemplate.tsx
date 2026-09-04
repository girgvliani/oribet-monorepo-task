import { LobbyContainer } from '@oribet/templates/lobby'
import { EditablePage } from '@oribet/modules/page-editor'
import type { seoType } from '@oribet/core/types/seo.type'

interface LobbyTemplateProps {
  seo?: seoType
}

const LobbyTemplate = ({ seo }: LobbyTemplateProps) => (
  <LobbyContainer seo={seo}>
    <EditablePage pageId="lobby" />
  </LobbyContainer>
)

export default LobbyTemplate
