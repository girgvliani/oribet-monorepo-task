import type { IReactIcon } from '@oribet/shared-types'

export const IconDoubleChevronWithShadow = ({
  ref,
  size = 14,
  width,
  height,
  style,
}: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <g clipPath="url(#clip0_1316_106)">
        <g filter="url(#filter0_d_1316_106)">
          <path
            d="M6.69014 3.12932L3.06934 6.75013L3.89429 7.57508L6.69014 4.77922L9.486 7.57508L10.3109 6.75013L6.69014 3.12932ZM6.69014 6.4251L3.06934 10.0459L3.89429 10.8708L6.69014 8.075L9.486 10.8709L10.3109 10.0459L6.69014 6.4251Z"
            fill="currentColor"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_1316_106"
          x="1.06934"
          y="2.12932"
          width="11.2416"
          height="11.7415"
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
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1316_106" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1316_106"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_1316_106">
          <rect
            width="14"
            height="14"
            fill="currentColor"
            transform="translate(14 14) rotate(-180)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}
