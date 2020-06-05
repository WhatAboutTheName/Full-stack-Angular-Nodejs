import { Component, OnInit } from '@angular/core';
import { AllRoutsService } from '../service/all-routs.service';
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';

interface order {
  userId: string,
  prodId: string[],
  allSum: number
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  products;
  order: order;
  private cartList: Subscription;
  
  constructor(
    private allRouts: AllRoutsService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.getProduct();
  }

  delete(id: string) {
    this.allRouts.deletCartProduct(this.auth.getUserId(), id);
    this.getProduct(id);
  }

  getProduct(id?: string) {
    this.allRouts.getProductInCart(this.auth.getUserId(), id);
    this.cartList = this.allRouts.getCartListener()
      .subscribe((products: any[]) => {
        this.products = products.map(item => {
          item.productId['quantity'] = item.quantity;
          return item.productId;
        });
        if (this.products) {
          let allSum = 0,
            prodId = [];
          this.products.forEach(el => {
            allSum += Number(el.price) * Number(el.quantity);
            prodId = [...prodId, el._id]
          });
          this.order = {userId: this.auth.getUserId(), prodId: prodId, allSum: allSum};
        }
      });
  }

  postOrder() {
    this.allRouts.orderCreate(this.order.userId, this.order.prodId, this.order.allSum);
  }

  ngOnDestroy() {
    this.cartList.unsubscribe();
  }
}
