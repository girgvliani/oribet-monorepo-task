import { ReactNode } from 'react'
import styled from 'styled-components'

interface IBoxContainer {
  children: ReactNode
  zIndex?: number | string
}

const BoxContainer = ({ zIndex = 'initial', children }: IBoxContainer) => {
  return <StyledContainer style={{ zIndex }}>{children}</StyledContainer>
}

export default BoxContainer

const StyledContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
`
