import type { IReactIcon } from '@oribet/shared-types'

export const FlagUnitedKingdom = ({ ref, size = 24, width, height, style }: IReactIcon) => {
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
      <mask
        id="mask0_1_7094"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={size}
        height={size}
      >
        <circle cx="8" cy="8" r="8" fill="#C4C4C4" />
      </mask>
      <g mask="url(#mask0_1_7094)">
        <path d="M20.5043 -0.224915H-4.28577V16.3002H20.5043V-0.224915Z" fill="#004AAF" />
        <path
          d="M0.330601 14.9612L-1.93383 15.0419L-1.98605 13.537L5.78733 7.95156L-2 2.37626L-1.93354 0.895125L0.326146 0.971082L7.92787 6.4135L15.555 0.933121L17.8147 0.857178L17.8669 2.36204L10.0816 7.95547L17.8909 13.5465L17.8245 15.0276L15.5648 14.9517L7.94096 9.49345L0.330601 14.9612Z"
          fill="white"
        />
        <path
          d="M11.2017 5.60441L9.69207 5.65663L16.2765 0.90939L17.7814 0.857178L11.2017 5.60441Z"
          fill="#F50D39"
        />
        <path
          d="M-0.456896 15.0039L-1.96652 15.0561L4.6179 10.3089L6.12752 10.2567L-0.456896 15.0039Z"
          fill="#F50D39"
        />
        <path
          d="M17.7907 15.0419L17.824 14.0355L12.7112 10.3754L11.2016 10.3232L17.7907 15.0419Z"
          fill="#F50D39"
        />
        <path
          d="M-2 1.9158L-1.96677 0.909389L4.62239 5.62814L3.11752 5.57592L-2 1.9158Z"
          fill="#F50D39"
        />
        <path
          d="M6.12339 -0.571411H9.89745V5.50032H19.4436V10.5846H9.89745V16.6516H6.12339V10.5846H-3.42859V5.50032H6.12339V-0.571411Z"
          fill="white"
        />
        <path
          d="M6.87842 -0.285706H9.14286V6.52661H19.4436V9.57434H9.14286V16.3913H6.87842V9.57434H-3.42859V6.52661H6.87842V-0.285706Z"
          fill="#F50D39"
        />
      </g>
    </svg>
  )
}
