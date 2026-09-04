import { AppRoutePath } from '@oribet/core/util/appRoutePath'
import { Defaults } from '@oribet/core/util/defaults'
import Cookies from 'js-cookie'
import { ErrorBoundary } from '@oribet/ui'
import { ENGAGEMENT_TEST_IDS } from '@oribet/test-ids'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

/**
 * Lobby-only route table.
 *
 * This build is a vertical slice: the lobby in its signed-out and signed-in states, and
 * nothing else. Every other page (casino, games, bonuses, promotions, blog, settings,
 * sport, play-game, …) has been removed along with its modules, so anything that used to
 * link to one now falls through the catch-all back to the lobby rather than 404ing.
 *
 * Sign-IN is supported; sign-UP is not — the registration and Google currency-selection
 * opener routes are gone with it.
 */
const LobbyTemplate = lazy(() => import('@pages/LobbyTemplate'))

const GoogleAuthContainer = lazy(() =>
  import('@oribet/modules/authorization').then(m => ({ default: m.GoogleAuthContainer }))
)

interface IAppRoutes {
  isUserAuthorized: boolean
  screens: any
}

const AppRoutes = ({ screens }: IAppRoutes) => {
  return (
    <ErrorBoundary retryTestId={ENGAGEMENT_TEST_IDS.errorBoundary.retry}>
      <Suspense fallback={null}>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to={`/${Cookies.get('language') || Defaults.defaultLanguage}`} replace />
            }
          />
          <Route path={AppRoutePath.HOME()} element={<LobbyTemplate seo={screens.home} />} />
          {/* Google sign-in lands here with the provider token. */}
          <Route
            path={AppRoutePath.SOCIAL_AUTH(':type', ':access_token')}
            element={<GoogleAuthContainer screen={screens.googleAuth} />}
          />
          {/* No not-found page in this slice — every unknown path is the lobby. */}
          <Route
            path="*"
            element={
              <Navigate to={`/${Cookies.get('language') || Defaults.defaultLanguage}`} replace />
            }
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default AppRoutes
