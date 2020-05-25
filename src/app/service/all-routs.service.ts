import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Product } from '../interface/product';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + 'all/';

@Injectable({providedIn: 'root'})
export class AllRoutsService {
  private product: Product[];
  private productInCart;
  private productsList = new Subject<Product[]>();
  private cartList = new Subject();

  constructor(private http: HttpClient, private router: Router) {}

  getProduct() {
    this.http
      .get<{ message: string, product: any }>(BACKEND_URL + 'get-product')
      .pipe(map((prodData) => {
        return prodData.product.map(prod => {
          return {
            title: prod.title,
            price: prod.price,
            image: prod.image,
            id: prod._id
          };
        });
      }))
      .subscribe(product => {
        this.product = product;
        this.productsList.next([...this.product]);
    });
  }

  addToCart(productId: string, userId: string) {
    const id = {productId: productId, userId: userId};
    this.http
      .patch<{massage: string}>(BACKEND_URL + 'add-cart-product', id)
        .subscribe(massage => {
          console.log(massage);
        });
  }

  getProductInCart(userId: string, prodId?: string) {
    this.http
      .get<{massage: string, product: any}>(BACKEND_URL + `get-cart-product/:?id=${userId}`)
        .subscribe(req => {
          const item = req.product.filter(prod => prod.productId._id !== prodId);
          this.productInCart = item;
          this.cartList.next(this.productInCart);
        });
  }

  deletCartProduct(userId: string, prodId: string) {
    const id = {prodId: prodId, userId: userId};
    this.http
      .post<{massage: string}>(BACKEND_URL + 'delete-cart-product', id)
        .subscribe();
  }

  orderCreate(userId: string, sum: number) {
    const order = {userId: userId, sum: sum};
    this.http
      .patch<{massage: string}>(BACKEND_URL + 'order-create', order)
        .subscribe();
  }

  getProductListener() {
    return this.productsList.asObservable();
  }

  getCartListener() {
    return this.cartList.asObservable();
  }
}