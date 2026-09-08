import type { IReactIcon } from '@oribet/shared-types'

export const IconTether = ({ ref, size = 16, width, height, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 15.3 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M0 0l15 0 0 3.8-5.6 0 0 2.34c3.4 0.26 5.9 1.1 5.9 2.12 0 1.2-3.4 2.17-7.3 2.17-3.9 0-7.3-0.97-7.3-2.17 0-1.02 2.5-1.86 5.9-2.12l0-2.34-6.6 0 0-3.8z m7.5 8.9c2.94 0 5.32-0.5 5.32-1.1 0-0.47-1.5-0.88-3.42-1.03l0 1.5c-0.6 0.05-1.24 0.08-1.9 0.08-0.66 0-1.3-0.03-1.9-0.08l0-1.5c-1.93 0.15-3.42 0.56-3.42 1.03 0 0.6 2.38 1.1 5.32 1.1z m-1.9 1.7c0.6 0.04 1.24 0.07 1.9 0.07 0.66 0 1.3-0.03 1.9-0.07l0 5.4-3.8 0 0-5.4z"
        fill="currentColor"
      />
    </svg>
  )
}
