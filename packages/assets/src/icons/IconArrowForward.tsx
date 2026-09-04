import type { IReactIcon } from '@oribet/shared-types'

export const IconArrowForward = ({
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
      <path d="M6.23 20.23L8 22l10-10L8 2 6.23 3.77 14.46 12z" fill="currentColor" />
    </svg>
  )
}
