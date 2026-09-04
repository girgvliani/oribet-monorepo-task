import type { IReactIcon } from '@oribet/shared-types'

export const AtomRakeBack = ({ ref, size, width = 24, height = 18, style }: IReactIcon) => {
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
      <g filter="url(#filter0_i_1_86)">
        <rect width="24" height="18" rx="6" fill="url(#paint0_linear_1_86)" />
      </g>
      <rect x="0.5" y="0.5" width="23" height="17" rx="5.5" stroke="url(#paint1_linear_1_86)" />
      <g filter="url(#filter1_d_1_86)">
        <path
          d="M11.9748 7.19989L11.2641 7.82843L9.99027 6.70133L9.9899 12.5556H8.98485L8.98522 6.70133L7.71068 7.82843L7 7.19989L9.48737 5L11.9748 7.19989ZM17 10.8001L14.5126 13L12.0253 10.8001L12.7359 10.1716L14.0105 11.2987L14.0101 5.44444H15.0151L15.0155 11.2987L16.2893 10.1716L17 10.8001Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_i_1_86"
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
            values="0 0 0 0 0.216204 0 0 0 0 0.354688 0 0 0 0 0.0335233 0 0 0 1 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1_86" />
        </filter>
        <filter
          id="filter1_d_1_86"
          x="7"
          y="5"
          width="10"
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
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_86" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_86" result="shape" />
        </filter>
        <linearGradient
          id="paint0_linear_1_86"
          x1="12"
          y1="0"
          x2="12"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#65A30D" />
          <stop offset="1" stopColor="#4D7C0F" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_86"
          x1="12"
          y1="0"
          x2="12"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4D7C0F" />
          <stop offset="1" stopColor="#65A30D" />
        </linearGradient>
      </defs>
    </svg>
  )
}
