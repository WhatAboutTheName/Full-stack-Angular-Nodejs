import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + 'admin/';

@Injectable({providedIn: 'root'})
export class AdminRoutsService {

    constructor(private http: HttpClient, private router: Router) {}

    addProduct(title: string, price: string, image: File) {
        const postData = new FormData();
        postData.append("title", title);
        postData.append("price", price);
        postData.append("image", image, title);
        this.http.post<{message: string}>(BACKEND_URL + 'addProduct', postData).subscribe(responseData => {
            this.router.navigate(["/"]);
        });
    }

    executeOrder(userId: string, orderId: string) {
        const id = {userId: userId, orderId: orderId};
        this.http
        .patch<{massage: string}>(BACKEND_URL + 'execute-order', id)
          .subscribe()
    }
}