import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SportsState {
  currentSportPageUrl: string
}

const initialState: SportsState = {
  currentSportPageUrl: '',
}

const sportsSlice = createSlice({
  name: 'sports',
  initialState,
  reducers: {
    changeSportPageUrl(state, action: PayloadAction<string>) {
      state.currentSportPageUrl = action.payload
    },
  },
})

export const { changeSportPageUrl } = sportsSlice.actions
export default sportsSlice.reducer
