import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LogInComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  Login(form: NgForm){
    if (form.invalid) {
      return;
    }
    this.auth.Login(form.value.email, form.value.password);
  }

}
