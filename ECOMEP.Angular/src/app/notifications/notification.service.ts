import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { SignalRService } from "../shared/services/signalr.service";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "src/app/app.config";

export interface Notification {
  id: number;
  message: string;
  source: string;
  isRead: boolean;

  createdAt: Date;
}

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private notifications: Notification[] = [];

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(
    private signalR: SignalRService,
    private http: HttpClient,
    private config: AppConfig,
  ) {
    // Listen for SignalR messages from backend
    this.signalR.notifications$.subscribe((n: any) => {
      if (!n) return;

      const newNotification: Notification = {
        id: n.id || Date.now(),
        message: n.message,
        source: n.source,
        isRead: false,
        createdAt: new Date(n.createdAt),
      };

      // Add newest notification on top
      this.notifications.unshift(newNotification);

      // Emit updated list
      this.notificationsSubject.next(this.notifications);
    });
  }

  // 🔹 Get real-time notifications stream
  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  // 🔹 Load notifications from backend database
  loadNotificationsFromApi(): void {
    this.http
      .get<Notification[]>(this.config.apiEndpoint + "/api/Notification")
      .subscribe((res) => {
        this.notifications = res.map((n) => ({
          ...n,
          createdAt: new Date(n.createdAt),
        }));

        this.notificationsSubject.next(this.notifications);
      });
  }

  // 🔹 Mark notification as read
  markAsRead(id: number) {
    const notif = this.notifications.find((n) => n.id === id);

    if (notif) {
      notif.isRead = true;

      // 🔥 IMPORTANT: trigger UI update everywhere (header + page)
      this.notifications = [...this.notifications];
      this.notificationsSubject.next(this.notifications);

      // Update DB
      this.markAsReadInApi(id).subscribe();
    }
  }

  markAsReadInApi(id: number) {
    return this.http.put(
      `${this.config.apiEndpoint}/api/Notification/${id}/read`,
      {},
    );
  }
}
