import type { IReactIcon } from '@oribet/shared-types'

export const IconTableGame = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        d="M11.3333 1.33331H4.66667C3.93333 1.33331 3.33333 1.93331 3.33333 2.66665V13.3333C3.33333 14.0666 3.93333 14.6666 4.66667 14.6666H11.3333C12.0667 14.6666 12.6667 14.0666 12.6667 13.3333V2.66665C12.6667 1.93331 12.0667 1.33331 11.3333 1.33331ZM8.4 10.5333L8 10.8666L7.6 10.5333C6.26667 9.26665 5.33333 8.46665 5.33333 7.46665C5.33333 6.66665 6 5.99998 6.8 5.99998C7.26667 5.99998 7.73333 6.19998 8 6.53331C8.26667 6.19998 8.73333 5.99998 9.2 5.99998C10 5.99998 10.6667 6.59998 10.6667 7.46665C10.6667 8.46665 9.73333 9.26665 8.4 10.5333Z"
        fill="currentColor"
      />
    </svg>
  )
}
