import { getUserLanguage } from '@oribet/core/util/appUtil'
import { Defaults } from '@oribet/core/util/defaults'
import { fontSize } from '@oribet/ui'
import styled from 'styled-components'
// import styled from 'styled-components';

function MarketPlaceCardModal({
  data,
}: {
  data: {
    description: unknown
  }
}) {
  const getDescription = (description: any) => {
    // Backend may send a per-language map either as an object or a JSON-encoded string.
    let arr = description
    if (typeof description === 'string') {
      try {
        arr = JSON.parse(description)
      } catch {
        return description
      }
    }
    if (arr && typeof arr === 'object') {
      return arr[getUserLanguage()] ?? arr[Defaults.defaultLanguage] ?? ''
    }
    return arr ?? ''
  }

  return <P>{getDescription(data?.description)}</P>
}

export default MarketPlaceCardModal

const P = styled.p`
  font-size: ${fontSize.base};
  line-height: 16px;
  font-weight: 600;
  padding: 16px;
  text-align: left;
  color: ${({ theme }) => theme.colors.text.tertiary};
`
