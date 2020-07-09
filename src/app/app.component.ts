import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { Subscription } from 'rxjs';
import { AutoAuthI } from './interface/auto-auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private autoAuthListener: Subscription;

  constructor(
    private auth: AuthService,
  ) {}

  ngOnInit() {
    this.auth.autoAuth();
    this.autoAuthListener = this.auth.authCheck().subscribe((data: AutoAuthI) => {
      if (data.isLogin) {
        this.auth.login(data.email, data.password);
      }
    });
  }

  ngOnDestroy() {
    this.autoAuthListener.unsubscribe();
  }
}
