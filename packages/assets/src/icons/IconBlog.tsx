import type { IReactIcon } from '@oribet/shared-types'

export const IconBlog = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        d="M13.3333 14.6666H2.66667C2.29848 14.6666 2 14.3682 2 14V1.99998C2 1.63179 2.29848 1.33331 2.66667 1.33331H13.3333C13.7015 1.33331 14 1.63179 14 1.99998V14C14 14.3682 13.7015 14.6666 13.3333 14.6666ZM5.33333 4.66665V5.99998H10.6667V4.66665H5.33333ZM5.33333 7.33331V8.66665H10.6667V7.33331H5.33333ZM5.33333 9.99998V11.3333H8.66667V9.99998H5.33333Z"
        fill="currentColor"
      />
    </svg>
  )
}
