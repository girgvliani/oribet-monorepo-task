import type { IReactIcon } from '@oribet/shared-types'

export const AtomRankClimbTheRanks = ({ ref, size = 64, width, height, style }: IReactIcon) => {
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
      <g filter="url(#filter0_di_2441_9457)">
        <path
          d="M24.8701 23.992L34 22L43.1299 23.992C43.6383 24.1029 44 24.5456 44 25.0569V35.9515C44 38.14 42.886 40.1837 41.0313 41.3977L34 46L26.9687 41.3977C25.114 40.1837 24 38.14 24 35.9515V25.0569C24 24.5456 24.3617 24.1029 24.8701 23.992ZM34 32.9091C35.5341 32.9091 36.7778 31.688 36.7778 30.1818C36.7778 28.6756 35.5341 27.4545 34 27.4545C32.4659 27.4545 31.2222 28.6756 31.2222 30.1818C31.2222 31.688 32.4659 32.9091 34 32.9091ZM29.0305 38.3636H38.9694C38.6931 35.9091 36.5737 34 34 34C31.4264 34 29.3069 35.9091 29.0305 38.3636Z"
          fill="url(#paint0_linear_2441_9457)"
        />
      </g>
      <g filter="url(#filter1_f_2441_9457)">
        <path
          d="M32.5 18L33.7154 21.2846L37 22.5L33.7154 23.7154L32.5 27L31.2846 23.7154L28 22.5L31.2846 21.2846L32.5 18Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_di_2441_9457"
          x="24"
          y="22"
          width="20"
          height="25"
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
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2441_9457" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2441_9457"
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
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_2441_9457" />
        </filter>
        <filter
          id="filter1_f_2441_9457"
          x="26"
          y="16"
          width="13"
          height="13"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_2441_9457" />
        </filter>
        <linearGradient
          id="paint0_linear_2441_9457"
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
