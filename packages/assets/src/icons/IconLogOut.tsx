import type { IReactIcon } from '@oribet/shared-types'

export const IconLogOut = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        d="M3.33329 1.33331H12.6666C13.0348 1.33331 13.3333 1.63179 13.3333 1.99998V14C13.3333 14.3682 13.0348 14.6666 12.6666 14.6666H3.33329C2.96511 14.6666 2.66663 14.3682 2.66663 14V1.99998C2.66663 1.63179 2.96511 1.33331 3.33329 1.33331ZM5.99996 7.33331V5.33331L2.66663 7.99998L5.99996 10.6666V8.66665H9.99996V7.33331H5.99996Z"
        fill="currentColor"
      />
    </svg>
  )
}
