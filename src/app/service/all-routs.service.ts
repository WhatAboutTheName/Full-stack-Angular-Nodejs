import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Product } from '../interface/product';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + 'all/';

@Injectable({providedIn: 'root'})
export class AllRoutsService {

  private products: Product[];
  private productInCart;
  private productsList = new Subject<Product[]>();
  private cartList = new Subject();
  private product = new Subject<Product>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getProducts() {
    this.http.get<{ message: string, product: any }>(BACKEND_URL + 'get-products')
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
        this.products = product;
        this.productsList.next([...this.products]);
    });
  }

  getProduct(prodId: string) {
    this.http.get<{ message: string, product: Product }>(BACKEND_URL + `get-product/:?prodId=${prodId}`)
        .subscribe(req => {
          let product: Product = req.product;
          this.product.next(product);
      });
      return this.product.asObservable();
  }

  addToCart(productId: string, userId: string) {
    const id = {productId: productId, userId: userId};
    this.http.patch<{massage: string}>(BACKEND_URL + 'add-cart-product', id)
      .subscribe();
  }

  getProductInCart(userId: string, prodId?: string) {
    this.http.get<{massage: string, product: any}>(BACKEND_URL + `get-cart-product/:?id=${userId}`)
      .subscribe(req => {
        const item = req.product.filter(prod => prod.productId._id !== prodId);
        this.productInCart = item;
        this.cartList.next(this.productInCart);
      });
  }

  deletCartProduct(userId: string, prodId: string) {
    const id = {prodId: prodId, userId: userId};
    this.http.post<{massage: string}>(BACKEND_URL + 'delete-cart-product', id)
      .subscribe();
  }

  orderCreate(userId: string, prodData: [{ prodId: string, prodQuantity: number }]) {
    const order = {userId: userId, prodData: prodData};
    this.http.patch<{massage: string}>(BACKEND_URL + 'order-create', order)
      .subscribe(req => this.router.navigate(['/order']));
  }

  getOrder(userId: string) {
    this.http.get<{userData: {data: any[]}}>(BACKEND_URL + `all-order/:?id=${userId}`)
      .subscribe();
  }

  deleteOrder(userId: string, orderId: string, activUserId: string) {
    const id = {userId: userId, orderId: orderId, activUserId: activUserId};
    this.http.patch<{massage: string}>(BACKEND_URL + 'delete-order', id)
      .subscribe();
  }

  updateOrderProduct(prodId: string, quantity: number, userId: string, orderId: string) {
    const product = { prodId: prodId, quantity: quantity, userId: userId, orderId: orderId };
    this.http.put<{massage: string}>(BACKEND_URL + 'update-order-product', product)
      .subscribe();
  }

  cartProductEdit(userId: string, prodId: string, quantity: number) {
    const product = { userId: userId, prodId: prodId, quantity: quantity };
    this.http.put<{massage: string}>(BACKEND_URL + 'update-cart-product', product)
      .subscribe();
  }

  getProductListener() {
    return this.productsList.asObservable();
  }

  getCartListener() {
    return this.cartList.asObservable();
  }
}