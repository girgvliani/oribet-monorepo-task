import type { IReactIcon } from '@oribet/shared-types'

export const IconClock = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
      <g opacity="0.92" filter="url(#filter0_d_800_1506)">
        <path
          d="M7.99988 14C4.68617 14 1.99988 11.3137 1.99988 8C1.99988 4.68629 4.68617 2 7.99988 2C11.3136 2 13.9999 4.68629 13.9999 8C13.9999 11.3137 11.3136 14 7.99988 14ZM8.59988 8V5H7.39988V9.2H10.9999V8H8.59988Z"
          fill="currentColor"
          shapeRendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_800_1506"
          x="1.99988"
          y="2"
          width="12"
          height="13"
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
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_800_1506" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_800_1506"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}
