import type { IReactIcon } from '@oribet/shared-types'

// Unit 5-point star (outer radius 10) centred at the origin.
const STAR =
  '0,-10 2.25,-3.09 9.51,-3.09 3.63,1.18 5.88,8.09 0,3.82 -5.88,8.09 -3.63,1.18 -9.51,-3.09 -2.25,-3.09'

export const FlagChina = ({ ref, size = 24, width, height, style }: IReactIcon) => {
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
        <clipPath id="cn_flag_circle">
          <circle cx="48" cy="48" r="48" />
        </clipPath>
      </defs>
      <g clipPath="url(#cn_flag_circle)">
        <path fill="#de2910" d="M0 0h96v96H0z" />
        <g fill="#ffde00">
          <polygon points={STAR} transform="translate(26 30) scale(1.6)" />
          <polygon points={STAR} transform="translate(54 14) scale(0.5)" />
          <polygon points={STAR} transform="translate(64 28) scale(0.5)" />
          <polygon points={STAR} transform="translate(62 46) scale(0.5)" />
          <polygon points={STAR} transform="translate(50 58) scale(0.5)" />
        </g>
      </g>
    </svg>
  )
}
