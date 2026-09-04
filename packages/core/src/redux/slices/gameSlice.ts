import { addGameToFavourites, removeGameFromFavourites } from '../../api/services/Game.api'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { t } from 'i18next'
import { enqueueSnackbar } from 'notistack'
import { ICategory, IGameSchema, IProvider } from '../../types/Game.type'

interface GameState {
  categories: ICategory[]
  providers: IProvider[]
  favourite: IGameSchema[]
}

const initialState: GameState = {
  categories: [],
  providers: [],
  favourite: [],
}

export const addGameToFavourite = createAsyncThunk('game/addToFavourite', async (id: string) => {
  const resp = await addGameToFavourites(Number(id))
  enqueueSnackbar(t('games.addedToFavourites'), {
    variant: 'success',
  })
  return resp.data.data
})

export const removeGameFromFavourite = createAsyncThunk(
  'game/removeFromFavourite',
  async (id: string) => {
    const resp = await removeGameFromFavourites(Number(id))
    enqueueSnackbar(t('games.removedFromFavourites'), {
      variant: 'success',
    })
    return resp.data.data
  }
)

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    changeGameCategories(state, action: PayloadAction<ICategory[]>) {
      state.categories = action.payload
    },
    changeProviders(state, action: PayloadAction<IProvider[]>) {
      state.providers = action.payload
    },
    changeInitFavouriteGame(state, action: PayloadAction<IGameSchema[]>) {
      state.favourite = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addGameToFavourite.fulfilled, (state, action) => {
        state.favourite = action.payload
      })
      .addCase(removeGameFromFavourite.fulfilled, (state, action) => {
        state.favourite = action.payload
      })
  },
})

export const { changeGameCategories, changeProviders, changeInitFavouriteGame } = gameSlice.actions
export default gameSlice.reducer
