import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { AllRoutsService } from '../service/all-routs.service';
import { Product } from '../interface/product';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { WebsocketService } from '../service/websocket.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { EditComponent } from './edit/edit.component';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {

  adminAuth = false;
  products: Product[];
  userId: string;
  private productsList: Subscription;

  constructor(
    private allRouts: AllRoutsService,
    private auth: AuthService,
    private websoket: WebsocketService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userId = this.auth.getUserId();
    this.adminAuth = this.auth.getAdminValue();
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
    this.allRouts.addToCart(id, this.userId);
  }

  edit(prodId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      prodId: prodId,
    };
    this.dialog.open(EditComponent, dialogConfig);
  }

  ngOnDestroy() {
    this.productsList.unsubscribe();
  }
}
