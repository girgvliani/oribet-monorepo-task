import type { IReactIcon } from '@oribet/shared-types'

export const FlagGerman = ({ ref, size = 24, width, height, style }: IReactIcon) => {
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
      <mask
        id="mask0_1_7103"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <circle cx="8" cy="8" r="8" fill="#C4C4C4" />
      </mask>
      <g mask="url(#mask0_1_7103)">
        <path d="M16.199 0H-0.530396V15.8648H16.199V0Z" fill="#050807" />
        <path d="M16.199 5.30328H-0.530396V15.8616H16.199V5.30328Z" fill="#F50D39" />
        <path d="M16.199 10.5584H-0.530396V16.6331H16.199V10.5584Z" fill="#FFDC00" />
      </g>
    </svg>
  )
}
