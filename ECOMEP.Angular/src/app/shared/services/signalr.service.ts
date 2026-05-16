import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection!: signalR.HubConnection;

  notifications$ = new BehaviorSubject<any>(null);

  startConnection(token: string) {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5054/notificationHub', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.log('SignalR Error', err));

    this.hubConnection.on('ReceiveNotification', (data) => {
       console.log("Notification received:", data);
      this.notifications$.next(data);
    });
  }
}