import type { IReactIcon } from '@oribet/shared-types'

export const IconChat = ({
  ref,
  size = 20,
  width,
  height,
  style
}: IReactIcon) => {
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
        d="M8.33341 2.5H11.6667C15.3487 2.5 18.3334 5.48477 18.3334 9.16667C18.3334 12.8486 15.3487 15.8333 11.6667 15.8333V18.75C7.50008 17.0833 1.66675 14.5833 1.66675 9.16667C1.66675 5.48477 4.65151 2.5 8.33341 2.5Z"
        fill="currentColor"
      />
    </svg>
  )
}
