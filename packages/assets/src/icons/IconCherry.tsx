import type { IReactIcon } from '@oribet/shared-types'

export const IconCherry = ({
  ref,
  size = 16,
  width,
  height,
  // style = { color: '#FFFFFF80' }
  style,
}: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <style>
        {`
          .cherry-path {
            transition: fill 0.3s;
          }
        `}
      </style>
      <g clipPath="url(#clip0_1212_191)">
        <g filter="url(#filter0_d_1212_191)">
          <path
            className="cherry-path"
            d="M12.1611 1.48438C12.1611 1.48438 11.8243 1.71952 11.4319 2.08333C11.1523 2.34262 10.8877 2.75979 10.6507 3.17708C9.94365 3.48332 8.84134 3.94286 7.86423 5C6.8855 6.05889 6.1113 7.70291 5.88506 10.1562C5.67851 10.0657 5.42198 10 5.12985 10C3.91069 10 2.08298 10.6233 2.08298 13.6458C2.08298 16.235 4.27714 18.3333 6.66631 18.3333C8.90131 18.3333 11.2496 16.235 11.2496 13.6458C11.2496 10.6025 9.01027 10 8.20277 10C7.94927 10 7.73626 10.0598 7.55173 10.1302C7.7655 8.07082 8.38931 6.87591 9.08819 6.11979C9.38635 5.79721 9.70534 5.5656 10.0257 5.36458C9.84221 8.09239 11.0504 10.2507 11.6924 11.5365C11.9351 12.1037 12.083 12.7986 12.083 13.6458C12.083 15.0342 11.5378 16.266 10.7028 17.2135C11.9653 18.3602 13.813 18.7038 15.5205 17.8646C17.4563 16.9138 18.5613 14.1946 17.4996 12.0313C16.2505 9.48875 14.1019 9.92125 13.4111 10.2604C13.2574 10.3359 13.1268 10.427 13.0205 10.5208C12.2121 8.89971 11.1677 6.80314 11.9528 4.08854C11.9951 3.94394 12.2595 3.57827 12.5517 3.30729C12.844 3.03631 13.0986 2.86458 13.0986 2.86458L12.1611 1.48438ZM12.9163 4.21875C12.9163 4.21875 12.1101 5.84458 12.9684 7.65625C13.8776 8.48792 15.4021 8.38854 16.2496 8.15104C16.2496 8.15104 15.9121 6.29854 14.8955 5.44271C13.8346 4.55104 12.9163 4.21875 12.9163 4.21875Z"
            fill="currentColor"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_1212_191"
          x="0.0829773"
          y="0.484375"
          width="19.8291"
          height="20.849"
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
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1212_191" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1212_191"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_1212_191">
          <rect width="20" height="20" fill="white" transform="translate(0.416321)" />
        </clipPath>
      </defs>
    </svg>
  )
}
