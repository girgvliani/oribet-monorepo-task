import type { IReactIcon } from '@oribet/shared-types'

export const AtomRankExclusiveAccess = ({ ref, size = 64, width, height, style }: IReactIcon) => {
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
      <circle cx="34" cy="34" r="25.5" stroke="url(#paint0_linear_770_765)" strokeOpacity="0.3" />
      <circle cx="34" cy="34" r="15.5" stroke="url(#paint1_linear_770_765)" strokeOpacity="0.3" />
      <circle cx="34" cy="34" r="20.5" stroke="url(#paint2_linear_770_765)" strokeOpacity="0.3" />
      <mask id="path-4-inside-1_770_765" fill="white">
        <path d="M18.1999 27.3301C18.1999 25.1209 19.9907 23.3301 22.1999 23.3301H46.1999C48.409 23.3301 50.1999 25.1209 50.1999 27.3301V41.3301C50.1999 43.5392 48.409 45.3301 46.1999 45.3301H22.1999C19.9907 45.3301 18.1999 43.5392 18.1999 41.3301V27.3301Z" />
      </mask>
      <path
        d="M18.1999 27.3301C18.1999 25.1209 19.9907 23.3301 22.1999 23.3301H46.1999C48.409 23.3301 50.1999 25.1209 50.1999 27.3301V41.3301C50.1999 43.5392 48.409 45.3301 46.1999 45.3301H22.1999C19.9907 45.3301 18.1999 43.5392 18.1999 41.3301V27.3301Z"
        fill="#FBB42A"
      />
      <path
        d="M18.1999 27.3301C18.1999 25.1209 19.9907 23.3301 22.1999 23.3301H46.1999C48.409 23.3301 50.1999 25.1209 50.1999 27.3301V41.3301C50.1999 43.5392 48.409 45.3301 46.1999 45.3301H22.1999C19.9907 45.3301 18.1999 43.5392 18.1999 41.3301V27.3301Z"
        fill="url(#paint3_linear_770_765)"
        fillOpacity="0.2"
      />
      <path
        d="M18.1999 27.3301C18.1999 24.5687 20.4384 22.3301 23.1999 22.3301H45.1999C47.9613 22.3301 50.1999 24.5687 50.1999 27.3301C50.1999 25.6732 48.409 24.3301 46.1999 24.3301H22.1999C19.9907 24.3301 18.1999 25.6732 18.1999 27.3301ZM50.1999 45.3301H18.1999H50.1999ZM18.1999 45.3301V23.3301V45.3301ZM50.1999 23.3301V45.3301V23.3301Z"
        fill="white"
        fillOpacity="0.3"
        mask="url(#path-4-inside-1_770_765)"
      />
      <g opacity="0.92" filter="url(#filter0_d_770_765)">
        <path
          d="M29.2719 28.4501H31.5919L29.0639 39.3301H24.9839L22.4559 28.4501H24.7759L26.6639 37.4101H27.3839L29.2719 28.4501ZM33.0245 39.3301V28.4501H35.2325V39.3301H33.0245ZM41.6026 36.1621H39.8106V39.3301H37.6026V28.4501H41.6026C44.1839 28.4501 45.4746 29.7087 45.4746 32.2261C45.4746 33.4954 45.1439 34.4714 44.4826 35.1541C43.8319 35.8261 42.8719 36.1621 41.6026 36.1621ZM39.8106 34.2741H41.5866C42.6853 34.2741 43.2346 33.5914 43.2346 32.2261C43.2346 31.5541 43.1013 31.0741 42.8346 30.7861C42.5679 30.4874 42.1519 30.3381 41.5866 30.3381H39.8106V34.2741Z"
          fill="white"
        />
      </g>
      <g filter="url(#filter1_f_770_765)">
        <path
          d="M47.5 20L47.5032 24.4968L52 24.5L47.5032 24.5032L47.5 29L47.4968 24.5032L43 24.5L47.4968 24.4968L47.5 20Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_770_765"
          x="22.4559"
          y="28.4501"
          width="23.0188"
          height="11.88"
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
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_770_765" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_770_765"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_f_770_765"
          x="41"
          y="18"
          width="13"
          height="13"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_770_765" />
        </filter>
        <linearGradient
          id="paint0_linear_770_765"
          x1="34"
          y1="8"
          x2="34"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC735" />
          <stop offset="1" stopColor="#FFD465" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_770_765"
          x1="34"
          y1="18"
          x2="34"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC735" />
          <stop offset="1" stopColor="#FFD465" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_770_765"
          x1="34"
          y1="13"
          x2="34"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC735" />
          <stop offset="1" stopColor="#FFD465" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_770_765"
          x1="33.6159"
          y1="23.3301"
          x2="37.4048"
          y2="44.7847"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
