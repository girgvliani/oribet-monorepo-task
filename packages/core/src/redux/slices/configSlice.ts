import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppConfig } from '../types/types'

const initialState: AppConfig = {
  apiUrl: '',
  socketUrl: '',
  giphySdkApiKey: '',
  airCrashSlug: '',
  chatSocketUrl: '',
  sportBookLibrarySrc: '',
}

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setConfig(state, action: PayloadAction<AppConfig>) {
      return { ...state, ...action.payload }
    },
  },
})

export const { setConfig } = configSlice.actions
export default configSlice.reducer
