import type { IReactIcon } from '@oribet/shared-types'

export const FlagKorean = ({ ref, size = 24, width, height, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <defs>
        <clipPath id="kr_flag_cut">
          <path d="M 0 0 L 96 96 H 0 Z" />
        </clipPath>
        <clipPath id="kr_flag_circle">
          <circle cx="48" cy="48" r="48" />
        </clipPath>
      </defs>
      <g clipPath="url(#kr_flag_circle)">
        <path fill="#fff" d="M0 0h96v96H0z" />
        <circle fill="#c13" cx="48" cy="48" r="24" />
        <circle fill="#037" cx="48" cy="48" r="24" clipPath="url(#kr_flag_cut)" />
        <g transform="rotate(45 48 48)">
          <circle fill="#c13" cx="36" cy="48" r="12" />
          <circle fill="#037" cx="60" cy="48" r="12" />
        </g>
        <g fill="#111" transform="rotate(45 48 48)">
          <g transform="translate(36 0)">
            <rect width="11" height="4" x="0" y="0" />
            <rect width="11" height="4" x="13" y="0" />
            <rect width="24" height="4" x="0" y="6" />
            <rect width="11" height="4" x="0" y="12" />
            <rect width="11" height="4" x="13" y="12" />
          </g>
          <g transform="translate(80 36)">
            <rect width="4" height="11" x="0" y="0" />
            <rect width="4" height="11" x="6" y="0" />
            <rect width="4" height="11" x="12" y="0" />
            <rect width="4" height="11" x="0" y="13" />
            <rect width="4" height="11" x="6" y="13" />
            <rect width="4" height="11" x="12" y="13" />
          </g>
          <g transform="translate(36 80)">
            <rect width="24" height="4" x="0" y="0" />
            <rect width="11" height="4" x="0" y="6" />
            <rect width="11" height="4" x="13" y="6" />
            <rect width="24" height="4" x="0" y="12" />
          </g>
          <g transform="translate(0 36)">
            <rect width="4" height="24" x="0" y="0" />
            <rect width="4" height="24" x="6" y="0" />
            <rect width="4" height="24" x="12" y="0" />
          </g>
        </g>
      </g>
    </svg>
  )
}
