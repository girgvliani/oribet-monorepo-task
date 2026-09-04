import type { IReactIcon } from '@oribet/shared-types'

export const FlagTurkey = ({ ref, size = 24, width, height, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <mask id="mask0_3000_7143" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <circle cx="12" cy="12" r="12" fill="#C4C4C4" />
      </mask>
      <g mask="url(#mask0_3000_7143)">
        <path d="M31.5652 0H-4.43481V25.5652H31.5652V0Z" fill="#F50D39" />
        <path
          d="M9.8892 16.7494C7.24309 16.7494 5.10558 14.6051 5.10558 11.9658C5.10558 9.31973 7.24997 7.18223 9.8892 7.18223C11.2982 7.18223 12.5697 7.79393 13.4425 8.76989C12.3841 7.09975 10.5146 5.98633 8.39087 5.98633C5.09183 5.98633 2.41138 8.6668 2.41138 11.9658C2.41138 15.2717 5.09183 17.9453 8.39087 17.9453C10.5146 17.9453 12.3841 16.8388 13.4425 15.1618C12.5697 16.1377 11.2982 16.7494 9.8892 16.7494Z"
          fill="white"
        />
        <path
          d="M17.2569 11.9659L18.5353 10.2064L16.4734 10.88L15.195 9.12048V11.2923L13.1262 11.9659L15.195 12.6395V14.8113L16.4734 13.0518L18.5353 13.7254L17.2569 11.9659Z"
          fill="white"
        />
      </g>
    </svg>
  )
}
