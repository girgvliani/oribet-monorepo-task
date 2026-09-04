import { IconChevronLeft, IconChevronRight } from '../../icons'
import React, { FC, useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { fontSize, fontWeight } from '../../tokens'

interface OribetPaginationProps {
  initialPage: number
  rowsPerPage: number
  totalAmount: number
  onPageChange: (page: number) => void
  testId?: string
}

const OribetPagination: FC<OribetPaginationProps> = ({
  initialPage,
  rowsPerPage,
  totalAmount,
  onPageChange,
  testId
}) => {
  const [activePage, setActivePage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(25)

  useEffect(() => {
    setActivePage(initialPage)
  }, [initialPage])

  useEffect(() => {
    setLimit(totalAmount)
  }, [totalAmount])

  const totalPages = Math.ceil(limit / rowsPerPage)

  const pageChangeHandler = (page: number) => {
    if (page < 1 || page > totalPages) return
    setActivePage(page)
    onPageChange(page)
  }

  // Generate page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = []
    const siblingCount = 1

    // Always show first page
    pages.push(1)

    // Calculate range around current page
    const leftSibling = Math.max(activePage - siblingCount, 2)
    const rightSibling = Math.min(activePage + siblingCount, totalPages - 1)

    // Add ellipsis after first page if needed
    if (leftSibling > 2) {
      pages.push('ellipsis')
    }

    // Add pages around current page
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i)
      }
    }

    // Add ellipsis before last page if needed
    if (rightSibling < totalPages - 1) {
      pages.push('ellipsis')
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }, [activePage, totalPages])

  const showPrevButton = activePage > 1
  const showNextButton = totalAmount > 0 && activePage < totalPages

  if (totalPages <= 0) return null

  return (
    <PaginationContainer data-testid={testId}>
      <PaginationWrapper>
        {showPrevButton && (
          <PageButton
            onClick={() => pageChangeHandler(activePage - 1)}
            aria-label="Go to previous page"
            data-testid={testId ? `${testId}.prev` : undefined}
          >
            <IconChevronLeft size={20} />
          </PageButton>
        )}

        {pageNumbers.map((page, index) =>
          page === 'ellipsis' ? (
            <Ellipsis key={`ellipsis-${index}`}>…</Ellipsis>
          ) : (
            <PageButton
              key={page}
              $isActive={page === activePage}
              onClick={() => pageChangeHandler(page)}
              aria-label={`Go to page ${page}`}
              aria-current={page === activePage ? 'page' : undefined}
              data-testid={testId ? `${testId}.page.${page}` : undefined}
            >
              {page}
            </PageButton>
          )
        )}

        {showNextButton && (
          <PageButton
            onClick={() => pageChangeHandler(activePage + 1)}
            aria-label="Go to next page"
            data-testid={testId ? `${testId}.next` : undefined}
          >
            <IconChevronRight size={20} />
          </PageButton>
        )}
      </PaginationWrapper>
    </PaginationContainer>
  )
}

export default OribetPagination

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0px;
`

const PaginationWrapper = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
`

const PageButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: none;
  border-radius: 8px;
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.surface.hover : 'transparent'};
  color: ${({ $isActive, theme }) => ($isActive ? theme.colors.text.primary : theme.colors.text.secondary)};
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.medium};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface.hover};
  }
`

const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${fontSize.base};
  pointer-events: none;
  user-select: none;
`
