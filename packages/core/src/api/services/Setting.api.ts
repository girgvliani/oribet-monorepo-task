import instance from '../axios'

export const getGeneralSettings = () => {
  return instance.get(`/settings`)
}

export const getSystemSettings = () => {
  return instance.get(`/settings/system`)
}
