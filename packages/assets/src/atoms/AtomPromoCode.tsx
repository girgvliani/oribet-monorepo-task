import type { IReactIcon } from '@oribet/shared-types'

export const AtomPromoCode = ({ ref, size, width = 24, height = 18, style }: IReactIcon) => {
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
      <g filter="url(#filter0_i_0_3)">
        <rect width="24" height="18" rx="6" fill="url(#paint0_linear_0_3)" />
      </g>
      <rect x="0.5" y="0.5" width="23" height="17" rx="5.5" stroke="url(#paint1_linear_0_3)" />
      <g filter="url(#filter1_d_0_3)">
        <path
          d="M8 6.50904L11.7535 4.07268C11.9028 3.97577 12.0972 3.97577 12.2465 4.07268L16 6.50904V12.5673C16 12.8063 15.801 13 15.5556 13H8.44444C8.19899 13 8 12.8063 8 12.5673V6.50904ZM12 8.23996C12.4909 8.23996 12.8889 7.85249 12.8889 7.3745C12.8889 6.89652 12.4909 6.50904 12 6.50904C11.5091 6.50904 11.1111 6.89652 11.1111 7.3745C11.1111 7.85249 11.5091 8.23996 12 8.23996Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_i_0_3"
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
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_0_3" />
        </filter>
        <filter
          id="filter1_d_0_3"
          x="8"
          y="4"
          width="8"
          height="10"
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
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_3" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_3" result="shape" />
        </filter>
        <linearGradient
          id="paint0_linear_0_3"
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
          id="paint1_linear_0_3"
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
