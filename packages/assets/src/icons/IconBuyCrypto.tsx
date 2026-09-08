import type { IReactIcon } from '@oribet/shared-types'

export const IconBuyCrypto = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
      <rect
        x="1"
        y="2.3"
        width="10.2"
        height="7.6"
        rx="1.3"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect x="1" y="4.5" width="10.2" height="1.5" fill="currentColor" />
      <circle cx="12.3" cy="11.3" r="3.2" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M12.3 9.9v2.8M10.9 11.3h2.8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}
