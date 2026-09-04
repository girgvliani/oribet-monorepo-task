import type { IReactIcon } from '@oribet/shared-types'

export const IconDoubleChevronRight = ({
  ref,
  size = 24,
  width,
  height,
  style,
  className,
  onClick,
}: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
      onClick={onClick}
    >
      <path d="M6.41 6L5 7.41 9.58 12 5 16.59 6.41 18l6-6z" fill="currentColor" />
      <path d="M13 6l-1.41 1.41L16.17 12l-4.58 4.59L13 18l6-6z" fill="currentColor" />
    </svg>
  )
}
