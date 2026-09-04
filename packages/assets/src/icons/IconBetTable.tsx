import type { IReactIcon } from '@oribet/shared-types'

export const IconBetTable = ({ ref, size = 20, width, height, style }: IReactIcon) => {
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
        d="M9.9996 7.08341L11.7629 11.323L16.3399 11.69L12.8528 14.6772L13.9181 19.1435L9.9996 16.7501L6.08099 19.1435L7.14639 14.6772L3.65918 11.69L8.2362 11.323L9.9996 7.08341ZM6.66622 1.66675V9.16675H4.99955V1.66675H6.66622ZM14.9996 1.66675V9.16675H13.3329V1.66675H14.9996ZM10.8329 1.66675V5.83341H9.16626V1.66675H10.8329Z"
        fill="currentColor"
      />
    </svg>
  )
}
