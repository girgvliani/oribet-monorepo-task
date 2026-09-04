import type { IReactIcon } from '@oribet/shared-types'

export const IconPalette = ({ ref, size = 16, width, height, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C12.83 22 13.5 21.33 13.5 20.5C13.5 20.12 13.37 19.77 13.14 19.51C12.92 19.25 12.8 18.92 12.8 18.55C12.8 17.72 13.47 17.05 14.3 17.05H16C19.31 17.05 22 14.36 22 11.05C22 6.02 17.51 2 12 2ZM6.5 13C5.67 13 5 12.33 5 11.5C5 10.67 5.67 10 6.5 10C7.33 10 8 10.67 8 11.5C8 12.33 7.33 13 6.5 13ZM9.5 9C8.67 9 8 8.33 8 7.5C8 6.67 8.67 6 9.5 6C10.33 6 11 6.67 11 7.5C11 8.33 10.33 9 9.5 9ZM14.5 9C13.67 9 13 8.33 13 7.5C13 6.67 13.67 6 14.5 6C15.33 6 16 6.67 16 7.5C16 8.33 15.33 9 14.5 9ZM17.5 13C16.67 13 16 12.33 16 11.5C16 10.67 16.67 10 17.5 10C18.33 10 19 10.67 19 11.5C19 12.33 18.33 13 17.5 13Z"
        fill="currentColor"
      />
    </svg>
  )
}
