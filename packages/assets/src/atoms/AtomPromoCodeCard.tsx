import { useTheme } from 'styled-components'
import type { IReactIcon } from '@oribet/shared-types'

export const AtomPromoCodeCard = ({ ref, size = 76, width, height, style }: IReactIcon) => {
  const theme = useTheme()
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 76 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <g filter="url(#filter0_i_3419_3254)">
        <rect
          x="7"
          y="15"
          width="48"
          height="64"
          rx="8"
          transform="rotate(-15 7 15)"
          fill="url(#paint0_linear_3419_3254)"
        />
      </g>
      <rect
        x="5.16288"
        y="13.9393"
        width="51"
        height="67"
        rx="9.5"
        transform="rotate(-15 5.16288 13.9393)"
        stroke="url(#paint1_linear_3419_3254)"
        strokeWidth="3"
      />
      <rect
        x="12.0605"
        y="18.972"
        width="40.2805"
        height="53.7073"
        rx="6"
        transform="rotate(-15 12.0605 18.972)"
        stroke="url(#paint2_linear_3419_3254)"
        strokeWidth="2"
        strokeDasharray="2 2"
      />
      <path
        d="M37.6524 27.1052C36.0995 26.6891 34.4425 27.1331 33.3057 28.2699L27.2699 34.3057C26.1331 35.4425 25.6891 37.0995 26.1052 38.6524L28.3145 46.8974C28.7306 48.4503 29.9435 49.6633 31.4965 50.0794L39.7415 52.2887C41.2944 52.7048 42.9514 52.2608 44.0882 51.124L50.124 45.0882C51.2608 43.9514 51.7047 42.2944 51.2886 40.7415L49.0794 32.4965C48.6633 30.9436 47.4503 29.7306 45.8974 29.3145L37.6524 27.1052Z"
        stroke="url(#paint3_linear_3419_3254)"
        strokeWidth="3"
      />
      <defs>
        <filter
          id="filter0_i_3419_3254"
          x="8.7959"
          y="4.37267"
          width="59.3369"
          height="70.6506"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3419_3254" />
        </filter>
        <linearGradient
          id="paint0_linear_3419_3254"
          x1="31"
          y1="15"
          x2="31"
          y2="79"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1F2937" />
          <stop offset="1" stopColor={theme.colors.bg.secondary} />
        </linearGradient>
        <linearGradient
          id="paint1_linear_3419_3254"
          x1="31"
          y1="15"
          x2="31"
          y2="79"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#57739A" />
          <stop offset="1" stopColor="#243048" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_3419_3254"
          x1="32.2008"
          y1="18.972"
          x2="32.2008"
          y2="72.6793"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#57739A" />
          <stop offset="1" stopColor="#243048" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_3419_3254"
          x1="35.5911"
          y1="28.1058"
          x2="41.8028"
          y2="51.2881"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#57739A" />
          <stop offset="1" stopColor="#243048" />
        </linearGradient>
      </defs>
    </svg>
  )
}
