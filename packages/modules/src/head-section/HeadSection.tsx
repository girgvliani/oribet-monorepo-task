import React from 'react'
import { Defaults } from '@oribet/core/util/defaults'

interface HeadSectionProps {
  title?: string
}

const HeadSection: React.FC<HeadSectionProps> = ({ title }) => {
  // Read the brand at render time so the app's configured brand (Defaults.brandName)
  // is applied regardless of module import order.
  return <title>{title ?? `${Defaults.brandName} - Crypto Casino`}</title>
}

export default HeadSection
