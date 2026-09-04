/**
 * Authentication test-id registry — the SINGLE SOURCE OF TRUTH.
 *
 * - `AUTH_TEST_IDS`: import these constants in components; never hand-write the
 *   string (point A: write once, no drift).
 * - `AUTH_STRUCTURE`: the union structure across every app. The id-map generator
 *   prunes it per app using each node's `presentWhen` rule.
 *
 * Convention: dot-scoped namespace, kebab-case leaf. The string IS the rendered
 * `data-testid` value.
 */
import type { IdNode, TestIdRegistry } from './types'

export const AUTH_TEST_IDS = {
  /** Logged-out header entry points that open the auth modal. */
  header: {
    loginButton: 'auth.header.login-button',
    registerButton: 'auth.header.register-button',
  },
  /** The login/registration modal shell. */
  modal: {
    root: 'auth.modal.root',
    closeDesktop: 'auth.modal.close-desktop',
    closeMobile: 'auth.modal.close-mobile',
  },
  tab: {
    login: 'auth.tab.login',
    register: 'auth.tab.register',
  },
  login: {
    emailInput: 'auth.login.email-input',
    /** Inline error region — auto-emitted by CustomInput as `${testId}-error`. */
    error: 'auth.login.email-input-error',
    passwordInput: 'auth.login.password-input',
    forgotPassword: 'auth.login.forgot-password',
    submit: 'auth.login.submit',
  },
  google: {
    button: 'auth.google.button',
  },
  /** Currency-selection step shown on its own route during the Google sign-up flow. */
  currencySelection: {
    modal: 'auth.currency-selection.modal',
    /** Repeated per supported currency — instances are `${option}.<currency>`. */
    option: 'auth.currency-selection.option',
    confirm: 'auth.currency-selection.confirm',
  },
  register: {
    usernameInput: 'auth.register.username-input',
    /** Optional display name — Korea sign-up only. */
    nicknameInput: 'auth.register.nickname-input',
    currencySelect: 'auth.register.currency-select',
    emailInput: 'auth.register.email-input',
    passwordInput: 'auth.register.password-input',
    marketingCheckbox: 'auth.register.marketing-checkbox',
    termsCheckbox: 'auth.register.terms-checkbox',
    termsLink: 'auth.register.terms-link',
    submit: 'auth.register.submit',
  },
  /**
   * Inline phone-verification field in the Korea sign-up form (shown when the brand
   * requires phone confirmation). States: enter phone → enter code → verified.
   */
  phoneVerify: {
    root: 'auth.phone-verify.root',
    countryCode: 'auth.phone-verify.country-code',
    phoneInput: 'auth.phone-verify.phone-input',
    sendCode: 'auth.phone-verify.send-code',
    changeNumber: 'auth.phone-verify.change-number',
    pinInput: 'auth.phone-verify.pin-input',
    resend: 'auth.phone-verify.resend',
    verify: 'auth.phone-verify.verify',
    verified: 'auth.phone-verify.verified',
    error: 'auth.phone-verify.error',
  },
  /** Post-registration welcome modal (Korea) — claim deposit bonus or dismiss. */
  welcome: {
    root: 'auth.welcome.root',
    claim: 'auth.welcome.claim',
    maybeLater: 'auth.welcome.maybe-later',
  },
  /** "Forgot password" request modal. */
  resetModal: {
    root: 'auth.reset-modal.root',
    emailInput: 'auth.reset-modal.email-input',
    submit: 'auth.reset-modal.submit',
    close: 'auth.reset-modal.close',
  },
  /** Set-new-password page / verify step reached from the emailed link or code. */
  resetPage: {
    root: 'auth.reset-page.root',
    /** Verification code field (Korea forgot-password verify step). */
    codeInput: 'auth.reset-page.code-input',
    newPasswordInput: 'auth.reset-page.new-password-input',
    confirmPasswordInput: 'auth.reset-page.confirm-password-input',
    change: 'auth.reset-page.change',
    close: 'auth.reset-page.close',
  },
} as const

const T = AUTH_TEST_IDS

/**
 * Union structure across all apps. `runtimeConditional` marks nodes whose presence
 * depends on runtime/API state (mobile vs desktop layout, multi-currency API flag,
 * a validation error being shown) — present in the union, never hard-failed on.
 */
export const AUTH_STRUCTURE: IdNode[] = [
  // Header entry points — rendered in the app header, not inside any tagged container.
  { id: T.header.loginButton, role: 'button', label: 'Header: open login modal' },
  { id: T.header.registerButton, role: 'button', label: 'Header: open registration modal' },

  // Login / registration modal.
  {
    id: T.modal.root,
    role: 'dialog',
    label: 'Authorization modal',
    children: [
      {
        id: T.modal.closeDesktop,
        role: 'button',
        label: 'Close (desktop)',
        runtimeConditional: true,
      },
      {
        id: T.modal.closeMobile,
        role: 'button',
        label: 'Close (mobile)',
        runtimeConditional: true,
      },
      { id: T.tab.login, role: 'tab', label: 'Login tab' },
      { id: T.tab.register, role: 'tab', label: 'Register tab' },

      // Login panel.
      { id: T.login.emailInput, role: 'textbox', label: 'Login: email/username' },
      {
        id: T.login.error,
        role: 'alert',
        label: 'Login: inline error',
        runtimeConditional: true,
      },
      { id: T.login.passwordInput, role: 'password', label: 'Login: password' },
      { id: T.login.forgotPassword, role: 'button', label: 'Login: forgot password' },
      { id: T.login.submit, role: 'button', label: 'Login: submit' },

      // Social login — always rendered (Google auth is hardcoded on).
      {
        id: T.google.button,
        role: 'button',
        label: 'Sign in with Google',
      },

      // Registration panel.
      { id: T.register.usernameInput, role: 'textbox', label: 'Register: username' },
      {
        id: T.register.nicknameInput,
        role: 'textbox',
        label: 'Register: nickname (Korea)',
        runtimeConditional: true,
      },
      {
        id: T.register.currencySelect,
        role: 'combobox',
        label: 'Register: wallet currency',
        runtimeConditional: true,
      },
      { id: T.register.emailInput, role: 'textbox', label: 'Register: email' },
      { id: T.register.passwordInput, role: 'password', label: 'Register: password' },
      {
        id: T.register.marketingCheckbox,
        role: 'checkbox',
        label: 'Register: marketing consent',
      },
      { id: T.register.termsCheckbox, role: 'checkbox', label: 'Register: T&C consent' },
      { id: T.register.termsLink, role: 'link', label: 'Register: T&C link' },
      { id: T.register.submit, role: 'button', label: 'Register: submit' },
    ],
  },

  // Currency-selection step (Google sign-up flow) — own route + modal, only mounted
  // at runtime, so the whole subtree is runtimeConditional (keeps every app green).
  {
    id: T.currencySelection.modal,
    role: 'dialog',
    label: 'Currency selection (Google flow)',
    runtimeConditional: true,
    children: [
      {
        id: T.currencySelection.option,
        role: 'button',
        label: 'Currency option',
        collection: true,
        runtimeConditional: true,
      },
      {
        id: T.currencySelection.confirm,
        role: 'button',
        label: 'Confirm currency',
        runtimeConditional: true,
      },
    ],
  },

  // Forgot-password request modal.
  {
    id: T.resetModal.root,
    role: 'dialog',
    label: 'Reset password request modal',
    children: [
      { id: T.resetModal.emailInput, role: 'textbox', label: 'Reset request: email' },
      { id: T.resetModal.submit, role: 'button', label: 'Reset request: submit' },
      { id: T.resetModal.close, role: 'button', label: 'Reset request: close' },
    ],
  },

  // Set-new-password page (from emailed link).
  {
    id: T.resetPage.root,
    role: 'dialog',
    label: 'Reset password page',
    children: [
      {
        id: T.resetPage.codeInput,
        role: 'textbox',
        label: 'Reset page: verification code',
        runtimeConditional: true,
      },
      { id: T.resetPage.newPasswordInput, role: 'password', label: 'Reset page: new password' },
      {
        id: T.resetPage.confirmPasswordInput,
        role: 'password',
        label: 'Reset page: confirm password',
      },
      { id: T.resetPage.change, role: 'button', label: 'Reset page: change password' },
      { id: T.resetPage.close, role: 'button', label: 'Reset page: close' },
    ],
  },

  // Inline phone-verification field in the Korea sign-up form — only mounted when the
  // brand requires phone confirmation, so the whole subtree is runtimeConditional.
  {
    id: T.phoneVerify.root,
    role: 'group',
    label: 'Phone verification field (Korea sign-up)',
    runtimeConditional: true,
    children: [
      {
        id: T.phoneVerify.countryCode,
        role: 'combobox',
        label: 'Phone verify: country code',
        runtimeConditional: true,
      },
      {
        id: T.phoneVerify.phoneInput,
        role: 'textbox',
        label: 'Phone verify: phone number',
        runtimeConditional: true,
      },
      {
        id: T.phoneVerify.sendCode,
        role: 'button',
        label: 'Phone verify: send code',
        runtimeConditional: true,
      },
      {
        id: T.phoneVerify.changeNumber,
        role: 'button',
        label: 'Phone verify: change number',
        runtimeConditional: true,
      },
      {
        id: T.phoneVerify.pinInput,
        role: 'textbox',
        label: 'Phone verify: 4-digit code',
        runtimeConditional: true,
      },
      {
        id: T.phoneVerify.resend,
        role: 'button',
        label: 'Phone verify: resend code',
        runtimeConditional: true,
      },
      {
        id: T.phoneVerify.verify,
        role: 'button',
        label: 'Phone verify: verify',
        runtimeConditional: true,
      },
      {
        id: T.phoneVerify.verified,
        role: 'text',
        label: 'Phone verify: verified confirmation',
        runtimeConditional: true,
      },
      {
        id: T.phoneVerify.error,
        role: 'alert',
        label: 'Phone verify: inline error',
        runtimeConditional: true,
      },
    ],
  },

  // Post-registration welcome modal (Korea) — only mounted at runtime after sign-up.
  {
    id: T.welcome.root,
    role: 'dialog',
    label: 'Welcome modal (Korea)',
    runtimeConditional: true,
    children: [
      {
        id: T.welcome.claim,
        role: 'button',
        label: 'Welcome: claim bonus',
        runtimeConditional: true,
      },
      {
        id: T.welcome.maybeLater,
        role: 'button',
        label: 'Welcome: maybe later',
        runtimeConditional: true,
      },
    ],
  },
]

export const AUTH_REGISTRY: TestIdRegistry = {
  feature: 'authentication',
  structure: AUTH_STRUCTURE,
}
