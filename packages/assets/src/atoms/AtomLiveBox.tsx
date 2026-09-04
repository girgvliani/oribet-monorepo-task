import type { IReactIcon } from '@oribet/shared-types'

export const AtomLiveBox = ({
  ref,
  size,
  width = 27,
  height = 14,
  style = { color: '#E6374B' },
}: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 27 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <rect width="27" height="14" rx="5" fill="currentColor" />
      <path
        d="M8.63 11H4.79V4.15H5.9V10.01H8.63V11ZM9.53609 11V4.15H10.6461V11H9.53609ZM16.0116 4.15H17.1716L15.4916 11H13.3116L11.6316 4.15H12.7916L14.1516 10.02H14.6516L16.0116 4.15ZM18.1591 11V4.15H22.4791V5.12H19.2691V7.06H21.8791V8.02H19.2691V10.02H22.4791V11H18.1591Z"
        fill="white"
      />
    </svg>
  )
}
