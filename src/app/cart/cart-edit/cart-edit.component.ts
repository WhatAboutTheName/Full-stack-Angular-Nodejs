import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AllRoutsService } from 'src/app/service/all-routs.service';
import { Product } from 'src/app/interface/product';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-cart-edit',
  templateUrl: './cart-edit.component.html',
  styleUrls: ['./cart-edit.component.scss']
})
export class CartEditComponent implements OnInit, OnDestroy {

  form: FormGroup;
  product: Product;
  quantity: number;
  private prodId: string;
  private method: any;
  private productSub: Subscription;

  constructor(
    private dialogRef: MatDialogRef<CartEditComponent>,
    private auth: AuthService,
    private allRouts: AllRoutsService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.prodId = data.prodId;
    this.quantity = data.quantity;
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
    this.allRouts.cartProductEdit(
      this.auth.getUserId(),
      this.prodId,
      this.form.value.quantity === '0' ? this.form.value.quantity = '1' : this.form.value.quantity
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
