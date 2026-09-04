import type { IReactIcon } from '@oribet/shared-types'

export const IconRestore = ({
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
      <path
        d="M14 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm-2-9a9 9 0 00-9 9H0l4 4 4-4H5c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.51 0-2.91-.49-4.06-1.3l-1.42 1.44A8.96 8.96 0 0012 21a9 9 0 000-18z"
        fill="currentColor"
      />
    </svg>
  )
}
