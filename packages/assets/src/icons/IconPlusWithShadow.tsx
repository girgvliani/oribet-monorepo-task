import type { IReactIcon } from '@oribet/shared-types'

export const IconPlusWithShadow = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
      <g filter="url(#filter0_d_21_1076)">
        <path
          d="M7.33331 7.33333V3.33333H8.66665V7.33333H12.6666V8.66667H8.66665V12.6667H7.33331V8.66667H3.33331V7.33333H7.33331Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_21_1076"
          x="1.33331"
          y="2.33333"
          width="13.3333"
          height="13.3333"
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
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_21_1076" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_21_1076"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}
