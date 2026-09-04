import type { IReactIcon } from '@oribet/shared-types'

export const IconAccountInfo = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        d="M13.3334 14.6667H2.66675V13.3333C2.66675 11.4924 4.15913 10 6.00008 10H10.0001C11.841 10 13.3334 11.4924 13.3334 13.3333V14.6667ZM8.00008 8.66667C5.79094 8.66667 4.00008 6.87581 4.00008 4.66667C4.00008 2.45753 5.79094 0.666672 8.00008 0.666672C10.2092 0.666672 12.0001 2.45753 12.0001 4.66667C12.0001 6.87581 10.2092 8.66667 8.00008 8.66667Z"
        fill="currentColor"
      />
    </svg>
  )
}
