import type { IReactIcon } from '@oribet/shared-types'

export const IconClose = ({
  ref,
  size = 16,
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
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
      onClick={onClick}
    >
      <path
        fill="currentColor"
        d="m8 7.058 3.3-3.3.942.943-3.3 3.3 3.3 3.3-.942.942-3.3-3.3-3.3 3.3-.943-.943 3.3-3.3-3.3-3.3.943-.942 3.3 3.3Z"
      />
    </svg>
  )
}
