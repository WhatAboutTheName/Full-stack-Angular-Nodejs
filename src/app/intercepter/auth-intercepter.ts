import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';


@Injectable()
export class AuthIntercepter implements HttpInterceptor {
    constructor(private auth: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token = this.auth.getToken();
        const changeRequest = req.clone({
            headers: req.headers.set("Authorization", "Bearer " + token)
        });
        return next.handle(changeRequest);
    }
}