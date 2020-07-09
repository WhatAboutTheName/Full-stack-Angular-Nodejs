import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  constructor(private auth: AuthService) { }

  signup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.auth.signup(form.value.name, form.value.email, form.value.password, form.value.phoneNumber);
  }
}
