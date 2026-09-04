import instance from '../axios'

export const getUserInfo = () => {
  return instance.get('/user')
}

export const getRanks = () => {
  return instance.get('ranks')
}

export const updateUserProfilePicture = (body: FormData) => {
  return instance.post('/players', body)
}

export const getLastWins = () => {
  return instance.get('last_winnings')
}

export const getLastBets = () => {
  return instance.get('/last_bets')
}

export const changeBackendLanguage = (langCode: string) => {
  return instance.get(`/setLang?lang=${langCode}`)
}
