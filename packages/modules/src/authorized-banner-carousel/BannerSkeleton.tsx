import { Skeleton } from '@oribet/ui'
import { FC } from 'react'
import styled from 'styled-components'

interface BannerSkeletonProps {
  slidePerView: number
}

const BannerSkeleton: FC<BannerSkeletonProps> = ({ slidePerView }) => {
  return (
    <SkeletonWrapper>
      <InnerBox>
        {Array.from({ length: slidePerView }).map((_, index) => (
          <StyledSkeleton key={index} variant="rectangular" />
        ))}
      </InnerBox>
    </SkeletonWrapper>
  )
}

export default BannerSkeleton

const SkeletonWrapper = styled.div`
  display: flex;
  width: 100%;
`

const InnerBox = styled.div`
  height: 100%;
  width: 1300px;
  display: flex;
  margin: 0 auto;
  gap: 24px;
  padding-left: 15px;
  padding-right: 15px;
`

const StyledSkeleton = styled(Skeleton)`
  width: 100%;
  height: 220px;
  min-height: 220px;
  max-height: 220px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.bg.secondary};
`
