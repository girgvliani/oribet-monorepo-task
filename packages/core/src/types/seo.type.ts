type seoType = {
  path: string
  key: string
  translations: {
    [key: string]: {
      title: string
      description?: string
    }
  }
}

export type { seoType }
