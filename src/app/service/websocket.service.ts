import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import io from 'socket.io-client';
import { Observable } from 'rxjs';

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class WebsocketService {

    socket: any;

    constructor() {
        this.socket = io(BACKEND_URL);
    }

    listen(eventName: string) {
        return new Observable(subscriber => {
            this.socket.on(eventName, data => {
                subscriber.next(data);
            })
        });
    }

    emit(eventName: string, data: any){
        this.socket.emit(eventName, data);
    }
}