import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { ShopComponent } from './shop/shop.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthIntercepter } from './auth/auth-intercepter';
import { AddProductComponent } from './add-product/add-product.component';
import { CartComponent } from './cart/cart.component';
import { AngularMaterialModule } from './angular-material.module';
import { OrderComponent } from './order/order.component';
import { EditComponent } from './shop/edit/edit.component';
import { MatDialogModule } from '@angular/material';
import { OrderEditComponent } from './order/order-edit/order-edit.component';
import { CartEditComponent } from './cart/cart-edit/cart-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ShopComponent,
    AddProductComponent,
    CartComponent,
    OrderComponent,
    EditComponent,
    OrderEditComponent,
    CartEditComponent,
  ],
  imports: [
    AngularMaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthIntercepter,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    EditComponent,
    OrderEditComponent,
    CartEditComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
