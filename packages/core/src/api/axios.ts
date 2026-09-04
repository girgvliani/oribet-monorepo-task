import { getBaseUrl } from './baseUrl'
import axios, { AxiosInstance } from 'axios'
import qs from 'qs'
import { getUserLanguage } from '../util/appUtil'

const instance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  paramsSerializer: function (params) {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  },
})

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Language is sent on every request via Accept-Language (backend localizes by header,
    // so endpoints no longer take a `/{lang}` path segment).
    config.headers['Accept-Language'] = getUserLanguage()
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default instance
