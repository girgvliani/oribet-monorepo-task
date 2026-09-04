/**
 * Account + KYC test-id registry.
 *
 * Covers the account/settings shell (sidebars, mobile menus, sub-page/modal back
 * buttons, settings select), the profile + avatar editor (user-profile), KYC
 * (personal-info level-1 + document uploads), security (change password / 2FA),
 * preferences, and email/phone verification. oribet renders `settings/*` +
 * `account/*`; oribet-korea renders `korea-dashboard/*`. Both share `user-profile`.
 * Almost everything is runtime-conditional (auth + route/modal gated).
 */
import type { IdNode, TestIdRegistry } from './types'

export const ACCOUNT_TEST_IDS = {
  /** Account/settings navigation shell. */
  nav: {
    /** Sidebar / menu row (account, settings, korea dashboard). Collection — `<id>.<key>`. */
    item: 'account.nav.item',
    /** Sub-page / modal back button. Collection — `<id>.<location>`. */
    back: 'account.nav.back',
    /** Settings select trigger. */
    settingsSelect: 'account.nav.settings-select',
    logout: 'account.nav.logout',
    logoutConfirm: 'account.nav.logout-confirm',
    logoutCancel: 'account.nav.logout-cancel',
  },
  /** Profile view / popup. */
  profile: {
    trigger: 'account.profile.trigger',
    username: 'account.profile.username',
    save: 'account.profile.save',
    close: 'account.profile.close',
    learnRank: 'account.profile.learn-rank',
    seeAll: 'account.profile.see-all',
    /** Edit profile (korea personal-information). */
    edit: 'account.profile.edit',
  },
  /** Avatar picker. */
  avatar: {
    open: 'account.avatar.open',
    /** Avatar option. Collection — `<id>.<key>`. */
    option: 'account.avatar.option',
    save: 'account.avatar.save',
  },
  /** KYC. */
  kyc: {
    /** Level-1 personal-info field. Collection — `<id>.<field>`. */
    level1Field: 'kyc.level1.field',
    level1Submit: 'kyc.level1.submit',
    /** Start verification (identity item). */
    start: 'kyc.documents.start',
    /** Document upload input. Collection — `<id>.<doc>` (id-front/back/selfie/proof). */
    upload: 'kyc.documents.upload',
    /** Document modal field. Collection — `<id>.<field>`. */
    field: 'kyc.documents.field',
    /** Document modal submit. Collection — `<id>.<modal>`. */
    submit: 'kyc.documents.submit',
  },
  /** Security. */
  security: {
    changePasswordOpen: 'account.security.change-password-open',
    current: 'account.security.password-current',
    next: 'account.security.password-new',
    confirm: 'account.security.password-confirm',
    /** Show/hide password toggle. Collection — `<id>.<field>`. */
    toggle: 'account.security.password-toggle',
    submit: 'account.security.password-submit',
    cancel: 'account.security.password-cancel',
    twoFaCopy: 'account.security.2fa-copy',
    twoFaSubmit: 'account.security.2fa-submit',
    close: 'account.security.close',
  },
  /** Preferences. */
  preferences: {
    /** Preference field (language/odds/…). Collection — `<id>.<field>`. */
    field: 'account.preferences.field',
    save: 'account.preferences.save',
  },
  /** Email verification. */
  email: {
    input: 'account.email.input',
    submit: 'account.email.submit',
    resend: 'account.email.resend',
    edit: 'account.email.edit',
  },
  /** Phone verification. */
  phone: {
    countryCode: 'account.phone.country-code',
    input: 'account.phone.input',
    submit: 'account.phone.submit',
    otp: 'account.phone.otp',
    confirm: 'account.phone.confirm',
    resend: 'account.phone.resend',
  },
} as const

const T = ACCOUNT_TEST_IDS

const leaf = (id: string, role: IdNode['role'], label: string, collection = false): IdNode => ({
  id,
  role,
  label,
  collection: collection || undefined,
  runtimeConditional: true,
})

export const ACCOUNT_STRUCTURE: IdNode[] = [
  // Nav shell.
  leaf(T.nav.item, 'link', 'Account: nav item', true),
  leaf(T.nav.back, 'button', 'Account: back', true),
  leaf(T.nav.settingsSelect, 'combobox', 'Account: settings select'),
  leaf(T.nav.logout, 'button', 'Account: logout'),
  leaf(T.nav.logoutConfirm, 'button', 'Account: logout confirm'),
  leaf(T.nav.logoutCancel, 'button', 'Account: logout cancel'),

  // Profile.
  leaf(T.profile.trigger, 'button', 'Profile: trigger'),
  leaf(T.profile.username, 'textbox', 'Profile: username'),
  leaf(T.profile.save, 'button', 'Profile: save'),
  leaf(T.profile.close, 'button', 'Profile: close'),
  leaf(T.profile.learnRank, 'button', 'Profile: learn rank'),
  leaf(T.profile.seeAll, 'button', 'Profile: see all'),
  leaf(T.profile.edit, 'button', 'Profile: edit'),

  // Avatar.
  leaf(T.avatar.open, 'button', 'Avatar: open picker'),
  leaf(T.avatar.option, 'button', 'Avatar: option', true),
  leaf(T.avatar.save, 'button', 'Avatar: save'),

  // KYC.
  leaf(T.kyc.level1Field, 'textbox', 'KYC: level-1 field', true),
  leaf(T.kyc.level1Submit, 'button', 'KYC: level-1 submit'),
  leaf(T.kyc.start, 'button', 'KYC: start verification'),
  leaf(T.kyc.upload, 'button', 'KYC: document upload', true),
  leaf(T.kyc.field, 'textbox', 'KYC: document field', true),
  leaf(T.kyc.submit, 'button', 'KYC: document submit', true),

  // Security.
  leaf(T.security.changePasswordOpen, 'button', 'Security: change password'),
  leaf(T.security.current, 'password', 'Security: current password'),
  leaf(T.security.next, 'password', 'Security: new password'),
  leaf(T.security.confirm, 'password', 'Security: confirm password'),
  leaf(T.security.toggle, 'button', 'Security: password toggle', true),
  leaf(T.security.submit, 'button', 'Security: submit'),
  leaf(T.security.cancel, 'button', 'Security: cancel'),
  leaf(T.security.twoFaCopy, 'button', 'Security: 2FA copy'),
  leaf(T.security.twoFaSubmit, 'button', 'Security: 2FA submit'),
  leaf(T.security.close, 'button', 'Security: close'),

  // Preferences.
  leaf(T.preferences.field, 'combobox', 'Preferences: field', true),
  leaf(T.preferences.save, 'button', 'Preferences: save'),

  // Email.
  leaf(T.email.input, 'textbox', 'Email: input'),
  leaf(T.email.submit, 'button', 'Email: submit'),
  leaf(T.email.resend, 'button', 'Email: resend'),
  leaf(T.email.edit, 'button', 'Email: edit'),

  // Phone.
  leaf(T.phone.countryCode, 'combobox', 'Phone: country code'),
  leaf(T.phone.input, 'textbox', 'Phone: input'),
  leaf(T.phone.submit, 'button', 'Phone: submit'),
  leaf(T.phone.otp, 'textbox', 'Phone: OTP'),
  leaf(T.phone.confirm, 'button', 'Phone: confirm'),
  leaf(T.phone.resend, 'button', 'Phone: resend'),
]

export const ACCOUNT_REGISTRY: TestIdRegistry = {
  feature: 'account',
  structure: ACCOUNT_STRUCTURE,
}
