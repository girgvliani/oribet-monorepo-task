import type { IReactIcon } from '@oribet/shared-types'

export const AtomCashback = ({ ref, size, width = 24, height = 18, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <g filter="url(#filter0_i_80_3843)">
        <rect width="24" height="18" rx="6" fill="url(#paint0_linear_80_3843)" />
      </g>
      <rect x="0.5" y="0.5" width="23" height="17" rx="5.5" stroke="url(#paint1_linear_80_3843)" />
      <g filter="url(#filter1_d_80_3843)">
        <path
          d="M13.6 10.4737H12L14 13L16 10.4737H14.4V8.36842C14.4 6.50809 12.9673 5 11.2 5C9.43269 5 8 6.50809 8 8.36842V12.1579H8.8V8.36842C8.8 6.97317 9.87452 5.84211 11.2 5.84211C12.5255 5.84211 13.6 6.97317 13.6 8.36842V10.4737Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_i_80_3843"
          x="0"
          y="0"
          width="24"
          height="22"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.285366 0 0 0 0 0.252021 0 0 0 0 0.607699 0 0 0 1 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_80_3843" />
        </filter>
        <filter
          id="filter1_d_80_3843"
          x="8"
          y="5"
          width="8"
          height="9"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_80_3843" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_80_3843"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_80_3843"
          x1="12"
          y1="0"
          x2="12"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#877CF2" />
          <stop offset="1" stopColor="#665DBD" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_80_3843"
          x1="12"
          y1="0"
          x2="12"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#665DBD" />
          <stop offset="1" stopColor="#877CF2" />
        </linearGradient>
      </defs>
    </svg>
  )
}
