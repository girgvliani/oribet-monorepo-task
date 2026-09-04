export interface IAction {
  type: string
  payload: unknown
}

export interface ILanguage {
  icon: React.FC | null
  label: string
  value: string
}

export interface IAuthorizationInfo {
  isLoginOpen: boolean
  isRegistrationOpen: boolean
}

export interface IErrorResponse {
  response: {
    data: {
      data: string
    }
  }
}

export interface ISuccessResponse<T = unknown> {
  data: {
    data: T
  }
}
