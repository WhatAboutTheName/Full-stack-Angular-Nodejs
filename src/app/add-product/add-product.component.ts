import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminRoutsService } from '../service/admin-routs.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  form: FormGroup;
  imagePreview: string;


  constructor(private adminRouts: AdminRoutsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [
        Validators.required,
        Validators.minLength(3)
      ] }),
      price: new FormControl(null, { validators: [
        Validators.required,
        Validators.minLength(1)
      ] }),
      image: new FormControl(null, { validators: [Validators.required]
      })
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

  addProduct() {
    if (this.form.invalid) {
      return;
    }
    this.adminRouts.addProduct(this.form.value.title, this.form.value.price, this.form.value.image);
    this.form.reset();
  }
}
