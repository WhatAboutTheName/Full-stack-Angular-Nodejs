import { Component, OnInit, OnDestroy } from '@angular/core';
import { AllRoutsService } from '../service/all-routs.service';
import { Product } from '../interface/product';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {
  products: Product[];
  private productList: Subscription;

  constructor(private allRouts: AllRoutsService, private auth: AuthService) { }

  ngOnInit() {
    this.allRouts.getProduct();
    this.productList = this.allRouts.getProductListener()
      .subscribe((products: Product[]) => {
        this.products = products;
      });
  }

  addToCart(id: string) {
    this.allRouts.addToCart(id, this.auth.getUserId());
  }

  ngOnDestroy() {
    this.productList.unsubscribe();
  }
}
