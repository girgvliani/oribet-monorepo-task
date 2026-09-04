import type { IReactIcon } from '@oribet/shared-types'

export const AtomDiamondYellow = ({ ref, size, width = 24, height = 18, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        fill="#FACB71"
        d="M20.758 1.572 16.169 0H7.831L3.032 1.571l4.462 1.647H16.3l3.352-1.238 1.106-.408Z"
      />
      <path fill="#FBD998" d="m24 4.598-3.242-3.026-1.106.408L16.3 3.219l3.352 4.34L24 4.598Z" />
      <path fill="#F7AD21" d="M7.494 3.218 4.58 7.56h15.072L16.3 3.22l-8.806-.001Z" />
      <path fill="#F8BC49" d="M7.494 3.218 3.032 1.571 0 4.598l4.58 2.961 2.914-4.34Z" />
      <path fill="#E79A08" d="M4.58 7.56 12 18l.63-.888 7.022-9.553H4.58Z" />
      <path fill="#9A6606" d="M12 18 24 4.598l-4.348 2.961-7.021 9.553L12 18Z" />
      <path fill="#BF7F07" d="M4.58 7.56 0 4.598l11.998 13.4L12 18 4.58 7.56Z" />
    </svg>
  )
}
