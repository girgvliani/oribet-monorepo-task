import type { IReactIcon } from '@oribet/shared-types'

export const IconPopular = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        d="M7.99969 0.333328L10.817 4.45561L15.6082 5.86119L12.5582 9.81446L12.702 14.8055L7.99969 13.1265L3.29741 14.8055L3.44115 9.81446L0.391235 5.86119L5.18236 4.45561L7.99969 0.333328ZM6.66635 8H5.33302C5.33302 9.47273 6.52693 10.6667 7.99969 10.6667C9.42783 10.6667 10.5938 9.54399 10.6631 8.13306L10.6664 8H9.33303C9.33303 8.73639 8.73609 9.33333 7.99969 9.33333C7.29676 9.33333 6.72089 8.7894 6.67003 8.09953L6.66635 8Z"
        fill="currentColor"
      />
    </svg>
  )
}
