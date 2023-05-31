export enum OrderStatus {
  Pending = 'pending',
  Delivering = 'delivering',
  Completed = 'completed'
}
declare interface IOrderRes {
  shortId: string
  address: string
  userId: string
  total: number
  status: OrderStatus
}

declare interface IProdPagination {
  products: IProdRes[]
  numOfProds: number
}
