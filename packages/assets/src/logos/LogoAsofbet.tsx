import type { IReactIcon } from '@oribet/shared-types'

/**
 * Wallet-modal brand mark (asofbet.png, 70x20) — embedded as a raster `<image>` inside an
 * SVG wrapper so it matches this folder's component API (width/height/style/ref), same as
 * LogoMain. Not a true vector: no tracing tool was available, so this is the original PNG's
 * pixels, not hand-drawn paths — it won't upscale losslessly beyond the source resolution.
 *
 * This shared-package copy exists only so TypeScript (which doesn't see Vite aliases) can
 * resolve the import; apps/oribet/vite.config.ts aliases the actual specifier to the
 * identical app-local file, matching the LogoMain override pattern.
 */
const ASOFBET_LOGO_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAEYAAAAUCAYAAAAwaEt4AAAD8UlEQVR4AdRXS27UQBB9bTgDCpMdEguEAis+EoskB+ACcBhPDgPXyGSFBBISyQLIGpKsOIKb96q77B6PPclMmBFp+bntqurqrlfV7ZkKG27xbOegw6SOZ8LD43jmmMT0PKk3vJSV3N+KmLgQtAerXgFPIlAdd8AUABEOAAfY9Iyp/PHlv7hGidEiEyYjWR4KWgE61okv1OuM2sSYQWIiyxxtpsEMC6GXZWyghdkGnK7lcoEYnQGwMsfWW9i7ONr6pCMTGjHRzoq0ZWinCmG37SvOlJQFxHgQY6zjcrCa03pvaidr2vZ9t36MGCDUylZGYD8HIOYSV98c9vX+DjSHYPP31fpL+T3imBZA9IVO6XYZaurBQHnQY5ndMW3MFqn17feTGMjEAKlqyk/rji+KtjGXeJiFvSsjadi+ah1zEOLpg0fxdPLO8G33tWSCxqp36H0RkxoImos9yiaZUMp8rd67TnaCv1svcohoL/O3qeTE20yMAldQgYsoMT9K2ewkFdnuA8xW7BYS779CwAfD/XCOtlX8HaPAXVDOWWVymxNAcBvrZyGEw0DwrZsHmDGYPilul5PKEemiX/Rt0WvnmRgtTIsQQSXcPC1WWXUJbNs03DoCCkIsy7B2L7ywHvgenv76o2f3MU+yzymL5kRV6aCkDEJngrYDk4JSDrZMKJ/SpXNJdkKSdPf+2E7DJxL/s9JhF/a0v6/abUIdtDD186j2Ze/BSSe7YF8TBSdJo4zoAdz0L/PDl9TrnkjW0xDkz+UDVVBWiZuBgTBBGAtWYxxT2qrqAhabdFQH07FiYuswBVyR4YqlXp4xYEVATT2RbMBDG73mgcUITfDG1DF8tr670Ud6EdEwPxUz7uTCG2X+aP1RSNtobntkAts4aKngbSvJvsDcONqVV5dQSklMEJt8RK6Shuw3/EJctXLMbZvG9ElWBqLA0LUfu48R8T4hfuoUaElBbsEq9oJfo3JOU5bBSlCTBCYOgt5HIbsB1BpAed+vxDXl2qamIzFAypp0MHI868hN72OQSao0KGABauHJ7/Pw7OKj4fnlV8m6eZoiO9EWIv0NIFuhNFV1FEk0lWyGUMxrduXN7U1WBTsfEjla+Argv+KJAfb3wfzxj2CS0Y/pyh72lWlYcVU+q/RlKqvOfJS3GQCRPQptE6RGvxi1A/3Q1gjM/aBt1qXfMSJnVWgiYpVr2lWdto1jYfu0PrlInSlL4ca0VeXcyFZjaD9oK51gW0kPq0JEsgKYpWhZuGY8SblYdvBdM3z76rWJ0VJTBVySHKgsMdLuHCmK41bEyIGQqgcD5ET+NrpblYLc/gkx8lWQ4wSxUqyapL5z+AsAAP//zemCvQAAAAZJREFUAwBDhdxzPLzvQwAAAABJRU5ErkJggg=='

export const LogoAsofbet = ({ ref, size, width = 70, height = 20, style }: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 70 20"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <image href={`data:image/png;base64,${ASOFBET_LOGO_BASE64}`} width="70" height="20" />
    </svg>
  )
}
