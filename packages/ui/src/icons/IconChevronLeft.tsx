import { IReactIcon } from '../types/icon'

export const IconChevronLeft = ({
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
        d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
        fill="currentColor"
      />
    </svg>
  )
}
