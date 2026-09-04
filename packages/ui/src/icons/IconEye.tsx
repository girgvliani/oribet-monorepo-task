import { IReactIcon } from '../types/icon'

interface IIconEye extends IReactIcon {
  type: any
}

export const IconEye = ({
  type,
  ref,
  size = 16,
  width,
  height,
  style
}: IIconEye) => {
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
      {type === 'text' ? (
        <path
          fill="currentColor"
          d="M.788 8.962a7.336 7.336 0 0 1 14.425 0 7.336 7.336 0 0 1-14.425 0ZM8 12.295a3.333 3.333 0 1 0 0-6.667 3.333 3.333 0 0 0 0 6.667Zm0-1.334a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
        />
      ) : (
        <>
          <g clipPath="url(#a)">
            <path
              fill="currentColor"
              d="M3.014 3.956.929 1.872l.943-.943 13.2 13.2-.944.942-2.206-2.207A7.336 7.336 0 0 1 .788 8a7.321 7.321 0 0 1 2.226-4.044Zm6.824 6.825-.976-.976a2 2 0 0 1-2.667-2.667l-.976-.976a3.333 3.333 0 0 0 4.62 4.62ZM5.316 2.507A7.336 7.336 0 0 1 15.212 8a7.3 7.3 0 0 1-1.34 3.062l-2.574-2.574a3.333 3.333 0 0 0-3.786-3.786L5.316 2.507Z"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="currentColor" d="M0 0h16v16H0z" />
            </clipPath>
          </defs>
        </>
      )}
    </svg>
  )
}
