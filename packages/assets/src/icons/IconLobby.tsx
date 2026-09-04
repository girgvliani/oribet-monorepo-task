import type { IReactIcon } from '@oribet/shared-types'

export const IconLobby = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
      <path
        d="M14 2C14.3682 2 14.6667 2.29848 14.6667 2.66667V13.3333C14.6667 13.7015 14.3682 14 14 14H2C1.63181 14 1.33333 13.7015 1.33333 13.3333V2.66667C1.33333 2.29848 1.63181 2 2 2H14ZM12.6667 4H3.33333V5.33333H12.6667V4Z"
        fill="currentColor"
      />
    </svg>
  )
}
