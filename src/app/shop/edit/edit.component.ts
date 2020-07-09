import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminRoutsService } from 'src/app/service/admin-routs.service';
import { Product } from 'src/app/interface/product';
import { AllRoutsService } from 'src/app/service/all-routs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  form: FormGroup;
  product: Product;
  imagePreview: string;
  prodId: string;
  private productSub: Subscription;

  constructor(
    private dialogRef: MatDialogRef<EditComponent>,
    private allRouts: AllRoutsService,
    private adminRouts: AdminRoutsService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.prodId = data.prodId;
  }

  ngOnInit(): void {
    this.productSub = this.allRouts.getProduct(this.prodId)
      .subscribe((product: Product) => {
        this.product = product;
      });
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [
        Validators.required,
        Validators.minLength(3)
      ] }),
      price: new FormControl(null, { validators: [
        Validators.required,
        Validators.minLength(1)
      ] }),
      image: new FormControl(null, { validators: [
        Validators.required
      ] })
    });
  }

  imagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  updateProduct() {
    this.adminRouts.updateProduct(
      this.prodId,
      this.form.value.title,
      this.form.value.price,
      (this.form.value.image ? this.form.value.image : this.product.image)
    );
    this.allRouts.getProducts();
    this.form.reset();
    this.dialogRef.close();
  }

  close() {
    this.productSub.unsubscribe();
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.productSub.unsubscribe();
  }
}
