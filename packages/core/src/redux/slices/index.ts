// Reducer barrel for per-client store composition.
// Usage with `createAppStore` factory:
//
//   import { createAppStore } from '@oribet/core/redux/createAppStore'
//   import { userReducer, gameReducer } from '@oribet/core/redux/slices'
//
//   const store = createAppStore({ user: userReducer, game: gameReducer })
//
// Action creators / individual actions are NOT re-exported here to avoid
// name collisions across slices. Import actions from their specific slice
// file instead: `from '@oribet/core/redux/slices/userSlice'`.

export { default as blogsReducer } from './blogsSlice'
export { default as configReducer } from './configSlice'
export { default as gameReducer } from './gameSlice'
export { default as settingsReducer } from './settingsSlice'
export { default as sportsReducer } from './sportsSlice'
export { default as userReducer } from './userSlice'
