import { Ref } from 'react'

export interface IReactIcon {
  ref?: Ref<SVGSVGElement>
  size?: number
  width?: number | string
  height?: number
  style?: React.CSSProperties
  className?: string
  onClick?: () => void
}
