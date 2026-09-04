import type { IReactIcon } from '@oribet/shared-types'

export const FlagRussian = ({ ref, size = 24, width, height, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 56 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <mask
        id="mask0_20_1668"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="-1"
        y="0"
        width="57"
        height="57"
      >
        <circle cx="27.8328" cy="28.498" r="27.8333" fill="#C4C4C4" />
      </mask>
      <g mask="url(#mask0_20_1668)">
        <path d="M69.6496 0.664673H-13.8584V56.3313H69.6496V0.664673Z" fill="#F50D39" />
        <path d="M69.6496 0.664673H-13.8584V37.7811H69.6496V0.664673Z" fill="#0062D9" />
        <path d="M69.6496 0.664673H-13.8584V19.2149H69.6496V0.664673Z" fill="white" />
      </g>
    </svg>
  )
}
