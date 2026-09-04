import HeadSection from './HeadSection'
import { getLocalStorageValue, SupportedLanguage } from '@oribet/core/util/appUtil'
import { Defaults } from '@oribet/core/util/defaults'
import { seoType } from '@oribet/core/types/seo.type'

function SeoContainer({ screen }: { screen: seoType }) {
  return (
    <HeadSection
      title={
        screen.translations[
          getLocalStorageValue('language', Defaults.defaultLanguage) as SupportedLanguage
        ]?.title || ''
      }
    />
  )
}

export default SeoContainer
