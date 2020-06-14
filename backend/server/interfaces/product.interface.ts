export interface IProduct {
    title: string,
    price: string,
    image: string
}

export interface IOrderItem {
  _id: string,
  userId: string,
  prodId: string,
  allSum: number,
  orderId: string
}