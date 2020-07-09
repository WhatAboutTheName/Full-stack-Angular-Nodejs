import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + 'admin/';

@Injectable({providedIn: 'root'})
export class AdminRoutsService {

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    addProduct(title: string, price: string, image: File) {
        const product = new FormData();
        product.append("title", title);
        product.append("price", price);
        product.append("image", image, title);
        this.http.post<{message: string}>(BACKEND_URL + 'addProduct', product)
            .subscribe(responseData => {
                this.router.navigate(["/"]);
            });
    }

    executeOrder(userId: string, orderId: string) {
        const id = { userId: userId, orderId: orderId };
        this.http.patch<{massage: string}>(BACKEND_URL + 'execute-order', id)
          .subscribe();
    }

    updateProduct(prodId: string, title: string, price: string, image: File | string) {
        const product = new FormData();
        product.append("prodId", prodId);
        product.append("title", title);
        product.append("price", price);
        typeof image === 'string' ? product.append("image", image) : product.append("image", image, title);
        this.http.put<{massage: string}>(BACKEND_URL + 'update-product', product)
          .subscribe();
    }

    inProcessing(userId: string, orderId: string) {
        const id = { userId: userId, orderId: orderId };
        this.http.put<{massage: string}>(BACKEND_URL + 'in-processing', id)
            .subscribe();
    }
}