import type { IReactIcon } from '@oribet/shared-types'

export const IconPlay = ({ ref, size = 16, width, height, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M7 19.7113V4.82352C7 3.20894 8.81445 2.25984 10.1407 3.1807L19.8501 9.92235C20.9331 10.6743 21.0049 12.25 19.9949 13.0973L10.2855 21.2435C8.98406 22.3354 7 21.4101 7 19.7113Z"
        fill="currentColor"
      />
    </svg>
  )
}
