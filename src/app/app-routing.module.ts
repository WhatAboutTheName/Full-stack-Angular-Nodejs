import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogInComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ShopComponent } from './shop/shop.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard';
import { AddProductComponent } from './add-product/add-product.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  { path: '', component: ShopComponent, canActivate: [AuthGuard]},
  { path: 'add-product', component: AddProductComponent, canActivate: [AuthGuard, AdminGuard]},
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LogInComponent},
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard]
})
export class AppRoutingModule { }
