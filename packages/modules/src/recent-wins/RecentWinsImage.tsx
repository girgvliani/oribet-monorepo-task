import { resolveImageUrl } from '@oribet/core/api/baseUrl'
import { useEffect, useState } from 'react'

function RecentWinsImage({ url }: { url: string }) {
  const [imageLoaded, setImageLoaded] = useState<boolean | null>(null)

  useEffect(() => {
    if (url) {
      const img = new Image()
      img.src = resolveImageUrl(url)

      img.onload = () => setImageLoaded(true)
      img.onerror = () => setImageLoaded(false)
    } else {
      setImageLoaded(false)
    }
  }, [url])

  if (imageLoaded === null && url) return null

  return (
    <img
      src={imageLoaded ? resolveImageUrl(url) : '/imgs/common/default-image.png'}
      alt={'game img'}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '8px',
      }}
    />
  )
}

export default RecentWinsImage
