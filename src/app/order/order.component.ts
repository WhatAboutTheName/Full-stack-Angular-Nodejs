import { Component, OnInit } from '@angular/core';
import { AllRoutsService } from '../service/all-routs.service'
import { AuthService } from '../service/auth.service';
import { WebsocketService } from '../service/websocket.service';
import { AdminRoutsService } from '../service/admin-routs.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  adminAuth = false;
  userData;

  constructor(
    private allRouts: AllRoutsService,
    private auth: AuthService,
    private websoket: WebsocketService,
    private adminRouts: AdminRoutsService
  ) { }

  ngOnInit() {
    this.adminAuth = this.auth.getAdminValue();
    this.allRouts.getOrder(this.auth.getUserId());
    this.websoket.listen('Order').subscribe((data: {action: string ,data: any}) => {
      if (data.action === 'getOrders') {
        this.userData = data.data;
      }
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

  executeOrder(userId: string, orderId: string) {
    let data = this.userData;
    this.adminRouts.executeOrder(userId, orderId);
    this.userData = data.filter(item => item.orderId.toString() !== orderId.toString());
  }
}
