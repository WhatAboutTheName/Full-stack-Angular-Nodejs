import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { 
  MatInputModule,
  MatToolbarModule,
  MatButtonModule
} from '@angular/material';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LogInComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { ShopComponent } from './shop/shop.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';

import { AuthIntercepter } from './intercepter/auth-intercepter';
import { AddProductComponent } from './add-product/add-product.component';
import { CartComponent } from './cart/cart.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LogInComponent,
    HeaderComponent,
    ShopComponent,
    AddProductComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FormsModule,
    MatToolbarModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCardModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthIntercepter, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
