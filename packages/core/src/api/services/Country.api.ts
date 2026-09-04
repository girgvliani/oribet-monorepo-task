import instance from '../axios'

export const getCountries = () => {
  return instance.get('/countries')
}

export const isCountryRestricted = () => {
  return instance.get('restricted_countries')
}
