import type { IReactIcon } from '@oribet/shared-types'

export const IconFacebook = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        xmlns="http://www.w3.org/2000/svg"
        d="M9.33335 8.99998H11L11.6667 6.33331H9.33335V4.99998C9.33335 4.31373 9.33335 3.66665 10.6667 3.66665H11.6667V1.42671C11.4496 1.39788 10.6287 1.33331 9.76195 1.33331C7.95229 1.33331 6.66669 2.43789 6.66669 4.46645V6.33331H4.66669V8.99998H6.66669V14.6666H9.33335V8.99998Z"
        fill="currentColor"
      />
    </svg>
  )
}
