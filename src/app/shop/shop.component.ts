import { Component, OnInit, OnDestroy } from '@angular/core';
import { AllRoutsService } from '../service/all-routs.service';
import { Product } from '../interface/product';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { WebsocketService } from '../service/websocket.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {
  products: Product[];
  private productsList: Subscription;

  test;

  constructor(
    private allRouts: AllRoutsService,
    private auth: AuthService,
    private websoket: WebsocketService
  ) { }

  ngOnInit() {
    this.websoket.listen('newProduct').subscribe((data: {action: string, product: any}) => {
      this.products.push(data.product);
    });
    this.allRouts.getProducts();
    this.productsList = this.allRouts.getProductListener()
      .subscribe((products: Product[]) => {
        this.products = products;
      });
  }

  addToCart(id: string) {
    this.allRouts.addToCart(id, this.auth.getUserId());
  }

  ngOnDestroy() {
    this.productsList.unsubscribe();
  }
}
