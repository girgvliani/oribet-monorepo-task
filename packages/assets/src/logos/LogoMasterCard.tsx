import type { IReactIcon } from '@oribet/shared-types'

export const LogoMasterCard = ({ ref, size, width = 39, height = 24, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 39 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        opacity="0.9"
        d="M12.0056 24C18.633 24 24.0056 18.6274 24.0056 12C24.0056 5.37258 18.633 0 12.0056 0C5.3782 0 0.00561523 5.37258 0.00561523 12C0.00561523 18.6274 5.3782 24 12.0056 24Z"
        fill="currentColor"
      />
      <path
        opacity="0.8"
        d="M26.5002 24C33.1277 24 38.5002 18.6274 38.5002 12C38.5002 5.37258 33.1277 0 26.5002 0C19.8728 0 14.5002 5.37258 14.5002 12C14.5002 18.6274 19.8728 24 26.5002 24Z"
        fill="currentColor"
      />
      <path
        opacity="0.5"
        d="M19.25 2.41675C22.1393 4.60618 23.9997 8.07577 23.9997 11.9761C23.9997 15.8764 22.1393 19.3519 19.25 21.5414C16.3607 19.3519 14.5002 15.8823 14.5002 11.9761C14.5002 8.06979 16.3666 4.60618 19.25 2.41675Z"
        fill="currentColor"
      />
    </svg>
  )
}
