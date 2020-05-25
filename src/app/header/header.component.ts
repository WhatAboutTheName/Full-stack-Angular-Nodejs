import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userAuth = false;
  adminAuth = false;
  private authListener: Subscription;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.authListener = this.auth
      .getAuthListener()
      .subscribe(auth => {
        this.userAuth = auth;
        this.adminAuth = this.auth.getAdminValue();
      });
  }

  Logout() {
    this.auth.Logout();
  }

  ngOnDestroy() {
    this.authListener.unsubscribe();
  }
}
