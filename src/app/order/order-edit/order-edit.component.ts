import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Product } from 'src/app/interface/product';
import { AllRoutsService } from 'src/app/service/all-routs.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit, OnDestroy {

  form: FormGroup;
  quantity: number;
  product: Product;
  private prodId: string;
  private userId: string;
  private orderId: string;
  private productSub: Subscription;

  constructor(
    private dialogRef: MatDialogRef<OrderEditComponent>,
    private allRouts: AllRoutsService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.prodId = data.prodId;
    this.quantity = data.quantity;
    this.userId = data.userId;
    this.orderId = data.orderId;
  }

  ngOnInit(): void {
    this.productSub = this.allRouts.getProduct(this.prodId)
      .subscribe((product: Product) => {
        this.product = product;
      });
    this.form = new FormGroup({
      quantity: new FormControl(null, { validators: [
        Validators.required,
        Validators.minLength(1)
      ] })
    });
  }

  updateProduct() {
    this.allRouts.updateOrderProduct(
      this.prodId,
      this.form.value.quantity,
      this.userId,
      this.orderId
    );
    this.form.reset();
    this.close();
  }

  close() {
    this.productSub.unsubscribe();
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.productSub.unsubscribe();
  }
}
