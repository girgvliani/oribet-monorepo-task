import type { IReactIcon } from '@oribet/shared-types'

export const IconChevronRight = ({
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
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor" />
    </svg>
  )
}
