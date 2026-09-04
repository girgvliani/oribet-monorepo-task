import type { IReactIcon } from '@oribet/shared-types'

export const AtomRankSystemBackground = ({
  ref,
  size,
  width = '100%',
  height = 403,
  style,
}: IReactIcon) => {
  return (
    <svg
      ref={ref}
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 320 403"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <g opacity="0.05">
        <path
          d="M160.902 68.4754L75.8449 -202.508L145.947 -216.525L169.314 48.8525L315.127 -224L399.249 -181.951L169.314 60.0656L460.004 -138.967L488.98 -70.7541L174.922 68.4754L496.457 -20.2951L503 48.8525L182.4 76.8853L503 95.5738L496.457 150.705L182.4 88.0984L482.437 198.361L471.22 240.41L182.4 95.5738L445.984 289L412.335 334.787L174.922 103.049L357.188 375.902L246.894 403L160.902 108.656L125.384 403L-53.1429 342.262L154.359 103.049L-153.155 258.164L-169.98 182.475L154.359 95.5738L-184 117.066L-177.457 68.4754L154.359 88.0984L-177.457 1.19673L-165.306 -29.6393L154.359 82.4918L-116.702 -70.7541L-100.812 -91.3115L160.902 76.8853L-27.9061 -154.852L2.00407 -172.607L160.902 68.4754Z"
          fill="url(#paint0_linear_2445_10341)"
          style={{ mixBlendMode: 'overlay' }}
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_2445_10341"
          x1="159.5"
          y1="36.5"
          x2="159.5"
          y2="227"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={'white'} />
          <stop offset="1" stopColor={'white'} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
