import type { IReactIcon } from '@oribet/shared-types'

export const IconTransaction = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        d="M8.00323 14.6686C4.32132 14.6686 1.33655 11.6839 1.33655 8.00194C1.33655 4.32006 4.32132 1.3353 8.00323 1.3353C11.6851 1.3353 14.6699 4.32006 14.6699 8.00194C14.6699 11.6839 11.6851 14.6686 8.00323 14.6686ZM4.66988 6.00196H6.00321V8.66861H7.33656V6.00196H8.66989L6.66989 3.66863L4.66988 6.00196ZM11.3366 10.0019H10.0032V7.33528H8.66989V10.0019H7.33656L9.33656 12.3353L11.3366 10.0019Z"
        fill="currentColor"
      />
    </svg>
  )
}
