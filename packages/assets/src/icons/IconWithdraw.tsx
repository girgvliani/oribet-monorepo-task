import type { IReactIcon } from '@oribet/shared-types'

export const IconWithdraw = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        d="M8.00004 1.33334C11.68 1.33334 14.6667 4.32001 14.6667 8.00001C14.6667 11.68 11.68 14.6667 8.00004 14.6667C4.32004 14.6667 1.33337 11.68 1.33337 8.00001C1.33337 4.32001 4.32004 1.33334 8.00004 1.33334ZM8.00004 7.33334V5.33334L5.33337 8.00001L8.00004 10.6667V8.66668H10.6667V7.33334H8.00004Z"
        fill="currentColor"
      />
    </svg>
  )
}
