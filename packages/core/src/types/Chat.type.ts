export interface IMessageDataType {
  _id: string
  room: string
  username: string
  player_id: number
  avatar: string
  level: number
  type: string
  data: {
    message: string
  }
  likes: number
  show: boolean
  createdAt: string
  updatedAt: string
  __v: number
}
