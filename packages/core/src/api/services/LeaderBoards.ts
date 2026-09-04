import instance from '../axios'

export const getLeaderBoardBySlug = (slug: string) => {
  return instance.get(`/leaderboards/${slug}`)
}

export const getLeaderBoards = (params: any) => {
  return instance.get(`/leaderboards`, { ...params })
}
