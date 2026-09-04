import type { IReactIcon } from '@oribet/shared-types'

export const AtomRankBeginJourneyIcon = ({ ref, size = 64, width, height, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <circle cx="34" cy="34" r="25.5" stroke="white" strokeOpacity="0.1" />
      <circle cx="34" cy="34" r="19.5" stroke="white" strokeOpacity="0.05" />
      <g filter="url(#filter0_di_2441_9433)">
        <path
          d="M34 46C27.3726 46 22 40.6274 22 34C22 27.3726 27.3726 22 34 22C40.6274 22 46 27.3726 46 34C46 40.6274 40.6274 46 34 46ZM32.8 32.8H28V35.2H32.8V40H35.2V35.2H40V32.8H35.2V28H32.8V32.8Z"
          fill="url(#paint0_linear_2441_9433)"
        />
      </g>
      <g filter="url(#filter1_f_2441_9433)">
        <path
          d="M32.5 18L33.7154 21.2846L37 22.5L33.7154 23.7154L32.5 27L31.2846 23.7154L28 22.5L31.2846 21.2846L32.5 18Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_di_2441_9433"
          x="22"
          y="22"
          width="24"
          height="25"
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
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0666667 0 0 0 0 0.0941176 0 0 0 0 0.152941 0 0 0 1 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2441_9433" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2441_9433"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0" />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_2441_9433" />
        </filter>
        <filter
          id="filter1_f_2441_9433"
          x="26"
          y="16"
          width="13"
          height="13"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_2441_9433" />
        </filter>
        <linearGradient
          id="paint0_linear_2441_9433"
          x1="34"
          y1="22"
          x2="34"
          y2="46"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F9FAFF" />
          <stop offset="1" stopColor="#74AC25" />
        </linearGradient>
      </defs>
    </svg>
  )
}
