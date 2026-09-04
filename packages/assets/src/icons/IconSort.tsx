import type { IReactIcon } from '@oribet/shared-types'

export const IconSort = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        d="M3.24594 7.33333H1.77771L4.00004 2H5.33338L7.55564 7.33333H6.08746L5.81424 6.66667H3.51917L3.24594 7.33333ZM4.06562 5.33333H5.2678L4.66671 3.86667L4.06562 5.33333ZM12.6666 10.6667V2H11.3333V10.6667H9.33331L12 14L14.6666 10.6667H12.6666ZM7.33331 8.66667H1.99999V10H5.23614L1.99999 12.6667V14H7.33331V12.6667H4.09741L7.33331 10V8.66667Z"
        fill="currentColor"
      />
    </svg>
  )
}
