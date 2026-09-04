import type { IReactIcon } from '@oribet/shared-types'

export const IconPlus = ({ ref, size = 16, width, height, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M7.33337 7.33337V3.33337H8.66671V7.33337H12.6667V8.66671H8.66671V12.6667H7.33337V8.66671H3.33337V7.33337H7.33337Z"
        fill="currentColor"
      />
    </svg>
  )
}
