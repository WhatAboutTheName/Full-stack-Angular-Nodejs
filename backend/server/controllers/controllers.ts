import { WSocketIO } from '../socket';
import { ProductModel, IProductModel } from '../models/product.model';
import { UserModel, IUserModel } from '../models/user.model';
import { Request, Response, NextFunction} from 'express';

export class Controllers {

  constructor() {}

  async getProducts (req: Request, res: Response, next: NextFunction) {
    try {
      const prod = await ProductModel.find();
      res.status(200).json({
        message: 'Fetched product successfully.',
        product: prod
      });
    } catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  async addToCart (req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUserModel | null = await UserModel.findOne({_id: req.body.userId});
      const prod: IProductModel | null = await ProductModel.findById(req.body.productId);
      if (prod) {
        user?.addToCart(prod);
        res.status(200).json({
          message: 'Product add in cart!'
        });
      }
    } catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  async productInCart (req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUserModel | null = await UserModel.findOne({_id: req.query.id});
      const inCart = await user?.populate('cart.items.productId').execPopulate();
      res.status(200).json({
        message: 'Product in cart!',
        product: inCart?.cart.items
      });
    } catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  
  async deleteCartProduct (req: Request, res: Response, next: NextFunction) {
    const userId = req.body.userId;
    const prodId = req.body.prodId;
    try {
      const user: IUserModel | null = await UserModel.findOne({_id: userId});
      await user?.deleteItemFromCart(prodId);
      res.status(200).json({
        message: 'Product delete!'
      });
    } catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  
  async orderCreate (req: Request, res: Response, next: NextFunction) {
    const userId = req.body.userId;
    const prodId = req.body.prodId;
    const allSum = req.body.allSum;
    try {
      const admin: IUserModel | null = await UserModel.findOne({admin: true});
      const user: IUserModel | null = await UserModel.findById(userId);
      await user?.deleteCart();
      user?.addToOrder(userId, prodId, allSum);
      const orderId = await user?.order[user?.order.length - 1]._id;
      admin?.addToOrder(userId, prodId, allSum, orderId);
      res.status(200).json({message: 'Order create!'});
    } catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  
  async allOrder (req: Request, res: Response, next: NextFunction) {
    let prodArr = [],
        data = [];
    try {
      const person: IUserModel | null = await UserModel.findById(req.query.id);
      for (let i = 0; i < (person ? person.order.length : 0); i++) {
        prodArr = []
        for (let z = 0; z < (person ? person.order[i].prodId.length : 0); z++) {
          const prod = await ProductModel.findById(person?.order[i].prodId[z]);
          prodArr.push(prod);
        }
        if (person?.admin) {
          const user: IUserModel | null = await UserModel.findById(person?.order[i].userId);
          data.push({
            name: user?.name,
            email: user?.email,
            phoneNumber: user?.phoneNumber,
            allSum: person.order[i].allSum,
            order: prodArr,
            userId: user?._id,
            orderId: person.order[i].orderId
          });
        } else {
          data.push({
            name: person?.name,
            email: person?.email,
            phoneNumber: person?.phoneNumber,
            allSum: person?.order[i].allSum,
            order: prodArr,
            userId: person?._id,
            orderId: person?.order[i]._id
          });
        }
      }
      WSocketIO.getIO().emit('Order', {action: 'getOrders', data: data});
      res.status(200).json({message: 'Get order!'});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  
  async deleteOrder (req: Request, res: Response, next: NextFunction) {
    let prodArr = [],
    data = [];
    const userId = req.body.userId;
    const orderId = req.body.orderId;
    const activUserId = req.body.activUserId;
    try {
      const admin: IUserModel | null = await UserModel.findOne({admin: true});
      const user: IUserModel | null = await UserModel.findById(userId);
      await user?.orderStatisticsAll(false);
      await admin?.deleteOrder(orderId, admin.admin);
      await user?.deleteOrder(orderId, user.admin);
      const activUser: IUserModel | null = await UserModel.findById(activUserId);
      for(let personOrder of (activUser ? activUser.order : [])) {
        for (let i = 0; i < personOrder.prodId.length; i++) {
          const prod = await ProductModel.findById(personOrder.prodId[i]);
          prodArr.push(prod);
        }
        data.push({
          name: activUser?.name,
          email: activUser?.email,
          phoneNumber: activUser?.phoneNumber,
          allSum: personOrder.allSum,
          order: prodArr,
          userId: activUser?._id,
          orderId: personOrder._id
        });
      }
      WSocketIO.getIO().emit('Order', {action: 'deleteOrders', data: data});
      res.status(200).json({message: 'Delete order!'});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
}
