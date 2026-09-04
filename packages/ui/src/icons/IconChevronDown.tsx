import { IReactIcon } from '../types/icon'

export const IconChevronDown = ({
  ref,
  size = 24,
  width,
  height,
  style,
  className,
  onClick
}: IReactIcon) => {
  return (
    // idmap-ignore: icon definition; interactive call sites are tagged where they are used.
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
      onClick={onClick}
    >
      <path
        d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
        fill="currentColor"
      />
    </svg>
  )
}
