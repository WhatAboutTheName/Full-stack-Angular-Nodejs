import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + 'user/';

@Injectable({providedIn: 'root'})
export class AuthService {

    private adminChecked = false;
    private authChecked = false;
    private token: string;
    private tokenTimer: any;
    private userId: string;
    private authListener = new Subject<boolean>();


    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    getToken() {
        return this.token;
    }

    getAuthListener() {
        return this.authListener.asObservable();
    }

    getUserId() {
        return this.userId;
    }

    getAdminValue() {
        return this.adminChecked;
    }

    getAuthValue() {
        return this.authChecked;
    }

    Signup(name: string, email: string, password: string) {
        const user = {name: name, email: email, password: password}
        this.http
            .put(BACKEND_URL + 'signup', user)
            .subscribe(res => {
                console.log(res)
            });
    }

    Login(email: string, password: string) {
        const login = {email: email, password: password}
        this.http
            .post<{token: string, expiresIn: number, admin: boolean, userId: string}>(BACKEND_URL + 'login', login)
            .subscribe(res => {
                const token = res.token;
                this.token = token;
                if (this.token) {
                    this.adminChecked = res.admin;
                    const time = res.expiresIn;
                    this.userId = res.userId;
                    this.authTimer(time);
                    this.authChecked = true;
                    this.authListener.next(true);
                    const now = new Date();
                    const expDate = new Date(now.getTime() + time * 1000);
                    this.saveAuth(token, expDate, this.userId);
                    this.router.navigate(['/']);
                }
            });
    }

    autoAuth() {
        const now = new Date();
        if (!this.getAuthData()) {
            return;
        }
        const time = this.getAuthData().expDate.getTime() - now.getTime();
        if (time > 0) {
            this.token = this.getAuthData().token;
            if (!this.authChecked) {
                this.adminChecked = true;
            } else {
                this.authChecked = true;
            }
            this.userId = this.getAuthData().userId;
            this.authTimer(time / 1000);
            this.authListener.next(true);
        }
    }

    Logout() {
        this.token = null;
        this.authChecked = false;
        this.adminChecked = false;
        this.authListener.next(false);
        this.userId = null;
        clearTimeout(this.tokenTimer);
        this.clearAuth();
        this.router.navigate(['/login']);
    }

    authTimer(time: number) {
        this.tokenTimer = setTimeout(() => {
            this.Logout();
        }, time * 1000);
    }

    saveAuth(token: string, expDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expDate', expDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    clearAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('expDate');
        localStorage.removeItem('userId');
    }

    getAuthData() {
        const token = localStorage.getItem('token');
        const expDate = localStorage.getItem('expDate');
        const userId = localStorage.getItem('userId');

        if (!expDate || !token) {
            return;
        }
        return {
            token: token,
            expDate: new Date(expDate),
            userId: userId
        };
    }
}
