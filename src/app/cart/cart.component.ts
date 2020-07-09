import { Component, OnInit } from '@angular/core';
import { AllRoutsService } from '../service/all-routs.service';
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CartEditComponent } from './cart-edit/cart-edit.component';

interface order {
  userId: string,
  prodData: [{ prodId: string, prodQuantity: number }]
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  products: any[];
  order: order;
  allSum: number = 0;
  private cartList: Subscription;
  
  constructor(
    private allRouts: AllRoutsService,
    private auth: AuthService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getProduct();
  }

  edit(prodId: string, quantity: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      prodId: prodId,
      quantity: quantity
    };
    this.dialog.open(CartEditComponent, dialogConfig).afterClosed().subscribe(el => {
      this.cartList.unsubscribe();
      this.getProduct();
    });
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
          this.allSum = 0;
          let prodData: order['prodData'] | any[] = [];
          this.products.forEach(el => {
            this.allSum += Number(el.quantity) * Number(el.price);
            prodData.push({ prodId: el._id, prodQuantity: el.quantity });
          });
          this.order = {userId: this.auth.getUserId(), prodData: prodData as order['prodData']};
        }
      });
  }

  postOrder() {
    this.allRouts.orderCreate(this.order.userId, this.order.prodData);
  }

  ngOnDestroy() {
    this.cartList.unsubscribe();
  }
}
