declare interface IOrderRes {
  shortId: string
  address: string
  userId: string
  total: number
  dateCreated: string
  status: string
}

declare interface IProdPagination {
  products: IProdRes[]
  numOfProds: number
}
