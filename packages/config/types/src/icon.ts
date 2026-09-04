import type { Ref } from 'react'

export interface IReactIcon {
  ref?: Ref<SVGSVGElement>
  size?: number
  width?: number | string
  height?: number
  style?: React.CSSProperties
  className?: string
  onClick?: () => void
}

export interface ISvgIcon {
  size?: number
  className?: string
  pathClassName?: string
  ref?: Ref<SVGSVGElement>
  fill?: string
  color?: string
  width?: number
  height?: number
  style?: React.CSSProperties
}
