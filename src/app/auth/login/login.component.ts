import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LogInComponent {

  constructor(private auth: AuthService) { }

  login(form: NgForm){
    if (form.invalid) {
      return;
    }
    this.auth.login(form.value.email, form.value.password);
  }

}
