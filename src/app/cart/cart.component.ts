import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { AllRoutsService } from '../service/all-routs.service';
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  products;
  order = {
    usedId: '',
    sum: 0
  };
  private cartList: Subscription;
  
  constructor(
    private allRouts: AllRoutsService,
    private auth: AuthService,
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
          let allSum = 0;
          this.products.forEach(el => {
            allSum += Number(el.price) * Number(el.quantity);
          });
          this.order = {usedId: String(this.auth.getUserId()) || '', sum: allSum || 0};
        }
      });
  }

  postOrder() {
    this.allRouts.orderCreate(this.order.usedId, this.order.sum);
  }

  ngOnDestroy() {
    this.cartList.unsubscribe();
  }
}
