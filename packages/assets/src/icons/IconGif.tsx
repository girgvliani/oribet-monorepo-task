import type { IReactIcon } from '@oribet/shared-types'

export const IconGif = ({ ref, size = 16, width, height, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M10.6667 1.33334L13.9998 4.66668L14 13.995C14 14.3659 13.7034 14.6667 13.3377 14.6667H2.66227C2.29651 14.6667 2 14.3631 2 14.0055V1.99454C2 1.62938 2.29833 1.33334 2.66567 1.33334H10.6667ZM8.66667 6.66668H8V10H8.66667V6.66668ZM7.33333 6.66668H6C5.26362 6.66668 4.66667 7.26361 4.66667 8.00001V8.66668C4.66667 9.40308 5.26362 10 6 10H6.66667C7.03487 10 7.33333 9.70154 7.33333 9.33334V8.00001H6V8.66668H6.66667V9.33334H6C5.63181 9.33334 5.33333 9.03488 5.33333 8.66668V8.00001C5.33333 7.63181 5.63181 7.33334 6 7.33334H7.33333V6.66668ZM11.3333 6.66668H9.33333V10H10V8.66668H11.3333V8.00001H10V7.33334H11.3333V6.66668Z"
        fill="currentColor"
        // fill={fill || 'white'}
      />
    </svg>
  )
}
