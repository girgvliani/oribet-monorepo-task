import type { IReactIcon } from '@oribet/shared-types'

export const IconMarketplace = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        fill="currentColor"
        d="M14.667 13.333v1.334H1.333v-1.334H2V8.828a2.997 2.997 0 0 1-.911-4.03l1.808-3.131a.667.667 0 0 1 .577-.334h9.052c.238 0 .458.127.577.334l1.802 3.12A2.997 2.997 0 0 1 14 8.828v4.506h.667ZM3.859 2.667 2.237 5.475a1.667 1.667 0 1 0 2.977 1.478.667.667 0 0 1 1.238 0 1.667 1.667 0 0 0 3.096 0 .667.667 0 0 1 1.238 0 1.667 1.667 0 1 0 2.97-1.488l-1.615-2.798H3.859Z"
      />
    </svg>
  )
}
