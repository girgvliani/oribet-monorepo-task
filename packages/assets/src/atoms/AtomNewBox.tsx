import type { IReactIcon } from '@oribet/shared-types'

export const AtomNewBox = ({
  ref,
  size,
  width = 30,
  height = 14,
  style = { color: '#7469DC' },
}: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 30 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <rect width="30" height="14" rx="5" fill="currentColor" />
      <path
        d="M4.79 11V4.15H6.73L8.81 10.02H8.96V4.15H10.07V11H8.17L6.04 5.12H5.9V11H4.79ZM11.6455 11V4.15H15.9655V5.12H12.7555V7.06H15.3655V8.02H12.7555V10.02H15.9655V11H11.6455ZM16.6228 4.15H17.7928L18.7728 10.04H18.9828L20.2828 4.17H21.5828L22.8828 10.04H23.1028L24.0828 4.15H25.2528L23.9028 11H22.1128L20.9328 5.51L19.7628 11H17.9628L16.6228 4.15Z"
        fill="white"
      />
    </svg>
  )
}
