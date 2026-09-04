import type { IReactIcon } from '@oribet/shared-types'

export const IconInstantGame = ({ ref, size = 16, width, height, style }: IReactIcon) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.2868 8.16105C15.2233 8.05613 15.1045 7.99128 14.9757 7.99127H10.2907L11.0762 2.37197C11.0935 2.21717 10.9953 2.0714 10.8386 2.01939C10.682 1.96738 10.5076 2.02267 10.417 2.15314L4.7196 11.4994C4.65176 11.6027 4.64889 11.7323 4.71209 11.8382C4.77529 11.9441 4.89468 12.0097 5.02421 12.0097H9.63913L9.01668 17.6374C9.0041 17.7916 9.10527 17.9341 9.26203 17.9828C9.41878 18.0315 9.59085 17.9741 9.67928 17.8435L15.2825 8.49818C15.3487 8.39472 15.3503 8.26595 15.2868 8.16105Z"
        fill="currentColor"
      />
    </svg>
  )
}
