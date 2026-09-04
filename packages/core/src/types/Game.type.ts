export interface ICategory {
  id: number
  slug: string
  title: string
  img: null | string | any
  games_count?: number
}

export interface IProvider {
  id: number
  slug: string
  slotgator_name: string
  title: string
  parent_provider: string | null
  img: string | null
  is_active: number
  create_dt: string
  update_dt: string
  games_count: number | null
}

export interface IGameFilterParams {
  per_page?: string
  device?: string
  sort?: string
  category?: number
  search_name?: string
  provider?: string
  page?: number
  show_available_only?: number
}

export interface IGamePage {
  onChangeSearchValue: (value: string) => void
  onChangeBlockedGames: (value: string) => void
  onChangeProviders: (provider: number) => void
  onChangeSort: (value: string) => void
  currentSearchValue: string
  selectedBlockGame: string
  selectedProviders: string[]
  selectedSortBy: string
  totalResult: number
  games: IGameSchema[]
  loading: boolean
  loadMoreLoading: boolean
  loadMoreGames: () => void
  firstLoading: boolean
  onClearParams: () => void
  pageName: string
  hideBlockedGameFilter?: boolean
  hideGameProviderFilter?: boolean
  hideGameSortByFilter?: boolean
  isOriginalGame?: boolean
  hideFooter?: boolean
  favourite: IGameSchema[]
  addToFavoriteGameList: (gameId: string) => void
  removeFromFavoriteGameList: (gameId: string) => void
  showSwitcher?: boolean
  categorySlug?: string | null
  comesFromBonusMode?: boolean
  showSearch?: boolean
}

export interface IGameSchema {
  id: number
  game_id: string
  slug?: string
  game_title: string
  parent_provider: string
  provider: string
  provider_id?: number
  technology?: string
  type?: string
  has_lobby: number
  is_mobile: number
  has_freespins: number
  has_tables: number
  is_tranding?: number
  freespin_valid_until_full_day?: number
  parameters?: string
  devices?: string
  lang?: string
  currency?: string
  is_active: number
  image: string | null
  agregator_image?: string
  modify_uid: number | null
  create_dt: string
  update_dt: string
  is_restricted?: boolean
  coming_soon?: number
  game_name: string
  launched?: number
  show?: number
  freespins_valid_until_full_day?: number
  is_live?: number
  category_id?: number
  ggr?: string
  total_in?: string
  total_out?: string
}

export interface IGameBlock {
  id: number
  slug: string
  name: string
  logo: string | null
  position: number
  show_in_lobby: boolean
  show_in_casino: boolean
  show_in_game: boolean
  show_in_sidebar: boolean
  games: IGameSchema[]
}
