import type { IReactIcon } from '@oribet/shared-types'

export const LogoMasterCardColored = ({
  ref,
  size,
  width = 25,
  height = 16,
  style,
}: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 25 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.12769 2.73486H15.4295V12.9608H9.12769V2.73486Z"
        fill="#FF5F00"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.77696 7.84875C9.77538 5.85359 10.6973 3.96852 12.277 2.73667C9.59328 0.641275 5.73942 0.946488 3.42376 3.43782C1.1081 5.92915 1.1081 9.77015 3.42376 12.2615C5.73942 14.7528 9.59328 15.058 12.277 12.9626C10.6967 11.7304 9.77482 9.84453 9.77696 7.84875Z"
        fill="#EB001B"
      />
      <path
        d="M22.2549 12.1387V11.7138H22.3549V11.6259H22.1169V11.7138H22.2109V12.1387H22.2549ZM22.7169 12.1387V11.6259H22.6449L22.5609 11.9922L22.4769 11.6259H22.4049V12.1387H22.4569V11.7504L22.5349 12.0838H22.5889L22.6669 11.7504V12.1387H22.7169Z"
        fill="#F79E1B"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.8678 7.84869C22.8678 10.3385 21.4367 12.6097 19.1826 13.6978C16.9285 14.7858 14.247 14.4996 12.2769 12.9608C13.8559 11.7279 14.7778 9.84305 14.7778 7.84779C14.7778 5.85253 13.8559 3.9677 12.2769 2.73481C14.247 1.19597 16.9285 0.909797 19.1826 1.99783C21.4367 3.08586 22.8678 5.35708 22.8678 7.84689V7.84869Z"
        fill="#F79E1B"
      />
    </svg>
  )
}
