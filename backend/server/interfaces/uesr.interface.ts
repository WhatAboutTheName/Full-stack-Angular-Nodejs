import * as mongoose from 'mongoose';

export interface IUser {
  name: string,
  email: string,
  password: string,
  phoneNumber: string,
  admin: boolean,
  cart: {
    items: [
      {
        productId: string,
        quantity: number
      }
    ]
  },
  orderStatistics: {
    Successful: number,
    Unsuccessful: number
  },
  order: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      userId: string,
      prodId: string[],
      allSum: number,
      orderId?: string
    }
  ],
}