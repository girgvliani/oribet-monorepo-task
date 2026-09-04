import type { IReactIcon } from '@oribet/shared-types'

export const IconDoubleChevron = ({ ref, size = 14, width, height, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M12.8477 8.13806L8.70964 4L7.76684 4.94281L10.9621 8.13806L7.76684 11.3333L8.70964 12.2761L12.8477 8.13806ZM9.0811 8.13806L4.94305 4L4.00024 4.94281L7.1955 8.13806L4.00024 11.3333L4.94305 12.2761L9.0811 8.13806Z"
        fill="currentColor"
      />
    </svg>
  )
}
