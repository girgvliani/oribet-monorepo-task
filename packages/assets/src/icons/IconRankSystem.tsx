import type { IReactIcon } from '@oribet/shared-types'

export const IconRankSystem = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        d="M2.52205 1.88395L8 0.666626L13.4779 1.88395C13.783 1.95173 14 2.22227 14 2.53474V9.19256C14 10.53 13.3316 11.7789 12.2188 12.5208L8 15.3333L3.7812 12.5208C2.66841 11.7789 2 10.53 2 9.19256V2.53474C2 2.22227 2.21702 1.95173 2.52205 1.88395ZM8 7.33329C8.92047 7.33329 9.66667 6.5871 9.66667 5.66663C9.66667 4.74615 8.92047 3.99996 8 3.99996C7.07953 3.99996 6.33333 4.74615 6.33333 5.66663C6.33333 6.5871 7.07953 7.33329 8 7.33329ZM5.01831 10.6666H10.9817C10.8159 9.16663 9.5442 7.99996 8 7.99996C6.45581 7.99996 5.18413 9.16663 5.01831 10.6666Z"
        fill="currentColor"
      />
    </svg>
  )
}
