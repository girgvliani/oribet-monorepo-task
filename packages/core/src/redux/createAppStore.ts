import { configureStore, type Reducer } from '@reduxjs/toolkit'

/**
 * Factory to build a per-client Redux store from a caller-provided map of
 * reducers. Each client app picks which slices to register — unused slices
 * simply aren't in the store.
 *
 * Usage:
 *   import { createAppStore } from '@oribet/core/redux/createAppStore'
 *   import { userReducer, gameReducer } from '@oribet/core/redux/slices'
 *
 *   export const store = createAppStore({
 *     user: userReducer,
 *     game: gameReducer,
 *     // omit slices you don't need — tree-shaking drops them from the bundle.
 *   })
 *   export type RootState = ReturnType<typeof store.getState>
 *
 * The generic `R` preserves per-reducer state inference — `RootState` on the
 * returned store has the specific slice shapes, not `any`.
 */
export const createAppStore = <R extends Record<string, Reducer>>(reducers: R) =>
  configureStore({
    reducer: reducers,
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
  })
