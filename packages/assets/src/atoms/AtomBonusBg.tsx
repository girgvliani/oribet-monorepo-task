import type { ISvgIcon } from '@oribet/shared-types'

export const AtomBonusBg = ({
  className,
  pathClassName,
  fill = '#FFF',
  width = 80,
  height = 80,
}: ISvgIcon) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 80 80"
      fill="none"
      className={className}
    >
      <g style={{ mixBlendMode: 'overlay' }}>
        <path
          d="M66.68 43.34v23.33c0 1.84-1.49 3.33-3.33 3.33H16.68c-1.84 0-3.34-1.49-3.34-3.33V43.34h53.34ZM48.35 6.67a11.67 11.67 0 0 1 10.54 16.67h11.13c1.84 0 3.33 1.49 3.33 3.33v10c0 1.84-1.49 3.34-3.33 3.34H10.03a3.33 3.33 0 0 1-3.33-3.34v-10c0-1.84 1.49-3.33 3.33-3.33h11.13A11.67 11.67 0 0 1 40 6.67a11.6 11.6 0 0 1 8.35-.003ZM31.68 13.34a5 5 0 0 0-.48 9.98l.48.02h5v-5a5 5 0 0 0-4.52-4.98l-.48-.02Zm16.67 0-.48.02a5 5 0 0 0-4.5 4.5l-.02.48v5h5l.48-.02a5 5 0 0 0 0-9.96l-.48-.02Z"
          fill={fill}
          fillOpacity="0.2"
          className={pathClassName}
        />
      </g>
    </svg>
  )
}
