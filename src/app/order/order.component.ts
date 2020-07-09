import { Component, OnInit } from '@angular/core';
import { AllRoutsService } from '../service/all-routs.service'
import { AuthService } from '../service/auth.service';
import { WebsocketService } from '../service/websocket.service';
import { AdminRoutsService } from '../service/admin-routs.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { OrderEditComponent } from './order-edit/order-edit.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  allSumArr: number[] = [];
  adminAuth: boolean = false;
  userData: any[];

  constructor(
    private allRouts: AllRoutsService,
    private auth: AuthService,
    private websoket: WebsocketService,
    private adminRouts: AdminRoutsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.adminAuth = this.auth.getAdminValue();
    this.allRouts.getOrder(this.auth.getUserId());
    this.websoket.listen('Order').subscribe((data: {action: string ,data: any}) => {
      this.allSumArr = [];
      this.userData = [];
      this.userData = data.data;
      this.userData.forEach(item => {
        let sum: number = 0;
        for (let i = 0; i < item.order.length; i++) {
          sum += Number(item.order[i].quantity) * Number(item.order[i].prod.price);
        }
        this.allSumArr = [...this.allSumArr, sum];
      });
    });
    this.websoket.listen('Order').subscribe((data: {action: string ,data: any}) => {
      if (data.action === 'deleteOrders') {
        this.userData = data.data;
      }
    });
  }

  cancelOrder(userId: string, orderId: string) {
    this.allRouts.deleteOrder(userId, orderId, this.auth.getUserId());
  }

  edit(prodId: string, quantity: number, userId: string, orderId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      prodId: prodId,
      quantity: quantity,
      userId: userId,
      orderId: orderId
    };
    this.dialog.open(OrderEditComponent, dialogConfig)
      .afterClosed()
      .subscribe(el => {
        this.allRouts.getOrder(this.auth.getUserId());
      });
  }

  delete (prodId: string, quantity: number, userId: string, orderId: string) {
    this.allRouts.updateOrderProduct(prodId, quantity, userId, orderId);
    if (this.userData) {
      this.userData.forEach(item => {
        let arr = item.order.filter(el => {
          if (el.prod._id !== prodId) {
            return el;
          };
        });
        item.order = arr;
        arr = {};
        return item;
      });
      this.userData.forEach(item => {
        if (item.order.length === 0) {
          this.cancelOrder(userId, orderId);
        }
      });
    }
  }

  executeOrder(userId: string, orderId: string) {
    let data = this.userData;
    this.adminRouts.executeOrder(userId, orderId);
    this.userData = data.filter(item => item.orderId.toString() !== orderId.toString());
  }

  inProcessing(userId: string, orderId: string) {
    this.adminRouts.inProcessing(userId, orderId);
  }
}
