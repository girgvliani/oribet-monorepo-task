import type { IReactIcon } from '@oribet/shared-types'

export const AtomRankReapTheRewards = ({ ref, size = 64, width, height, style }: IReactIcon) => {
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
      <g filter="url(#filter0_di_2441_9470)">
        <path
          d="M46 34V36.25C46 39.978 40.6274 43 34 43C27.4909 43 22.1923 40.0849 22.0051 36.4491L22 36.25V34C22 37.728 27.3726 40.75 34 40.75C40.6274 40.75 46 37.728 46 34ZM34 25C40.6274 25 46 28.0221 46 31.75C46 35.478 40.6274 38.5 34 38.5C27.3726 38.5 22 35.478 22 31.75C22 28.0221 27.3726 25 34 25Z"
          fill="url(#paint0_linear_2441_9470)"
        />
      </g>
      <g filter="url(#filter1_f_2441_9470)">
        <path
          d="M34.5 20L35.7154 23.2846L39 24.5L35.7154 25.7154L34.5 29L33.2846 25.7154L30 24.5L33.2846 23.2846L34.5 20Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_di_2441_9470"
          x="22"
          y="25"
          width="24"
          height="19"
          filterUnits="userSpaceOnUse"
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
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2441_9470" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2441_9470"
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
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_2441_9470" />
        </filter>
        <filter
          id="filter1_f_2441_9470"
          x="28"
          y="18"
          width="13"
          height="13"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_2441_9470" />
        </filter>
        <linearGradient
          id="paint0_linear_2441_9470"
          x1="34"
          y1="25"
          x2="34"
          y2="43"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F9FAFF" />
          <stop offset="1" stopColor="#74AC25" />
        </linearGradient>
      </defs>
    </svg>
  )
}
