import type { IReactIcon } from '@oribet/shared-types'

export const IconFavorite = ({
  ref,
  size = 16,
  width,
  height,
  style,
  className,
  onClick,
}: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
      onClick={onClick}
    >
      <path
        d="M8.00067 3.01902C9.56667 1.61333 11.9867 1.66 13.4951 3.17157C15.0035 4.68315 15.0553 7.09133 13.6524 8.662L7.99993 14.3233L2.34759 8.662C0.944699 7.09133 0.997139 4.67934 2.50491 3.17157C4.01438 1.6621 6.43013 1.61125 8.00067 3.01902Z"
        fill="currentColor"
      />
    </svg>
  )
}
