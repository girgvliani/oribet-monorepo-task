// Canonical singleton store with all 6 slices registered.
//
// This is the default store for apps that want every slice. Per-client apps
// that need to drop slices should instead call `createAppStore(reducers)`
// from @oribet/core/redux/createAppStore — see that file for details.
//
// Note: this file keeps the inline literal `reducer: { ... }` form
// intentionally. Wrapping the store creation in a generic factory loses
// TypeScript's per-slice state inference, which breaks strict selector
// typing (e.g., `state.game.providers.find(p => p.slug)` needing `p` to be
// inferred as `IProvider`). The factory works fine when consumers accept
// slightly looser types; this singleton prioritizes tight inference.
//
// If you're writing a new client app:
//   - All slices needed ⇒ import `{ store, RootState }` from this file.
//   - Drop slices to trim bundle ⇒ use `createAppStore({ pickYourReducers })`.

import { configureStore } from '@reduxjs/toolkit'
import blogsReducer from './slices/blogsSlice'
import configReducer from './slices/configSlice'
import gameReducer from './slices/gameSlice'
import settingsReducer from './slices/settingsSlice'
import sportsReducer from './slices/sportsSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    config: configReducer,
    user: userReducer,
    game: gameReducer,
    blogs: blogsReducer,
    settings: settingsReducer,
    sports: sportsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
