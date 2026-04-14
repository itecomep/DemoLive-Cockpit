import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SwPush } from "@angular/service-worker";
import { firstValueFrom, Observable } from "rxjs";
import { AppConfig } from "src/app/app.config";
import { environment } from "src/environments/environment";
import { WebPushSubscription } from "./web-push-subscription.model";
import { DeviceDetectorService } from "ngx-device-detector";
import { Router } from "@angular/router";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class WebPushApiService
{
    subscription?: PushSubscription;
    vapidKey = environment.vapidPublicKey;
    private readonly swPush = inject(SwPush);
    private readonly config = inject(AppConfig);
    private readonly http = inject(HttpClient);
    private readonly deviceService = inject(DeviceDetectorService);
    private readonly router = inject(Router);
    private readonly utilityService = inject(UtilityService);
    private readonly authService=inject(AuthService);
    private apiRoute: string = this.config.apiWebPushSubscription;


    async subscribe()
    {

        try
        {
            if (!this.swPush.isEnabled)
            {
                console.log("Notification is not enabled.");
                return;
            }

            this.subscription = await this.swPush.requestSubscription({
                serverPublicKey: this.vapidKey
            });
            console.log(this.subscription);
            if (this.subscription)
            {
                console.log('Successfully subscribed', this.subscription);
                const data = new WebPushSubscription({
                    subscription: JSON.stringify(this.subscription),
                    username:this.authService.currentUserStore?.username,
                    os: this.deviceService.os,
                    browser: this.deviceService.browser,
                    device: this.deviceService.device,
                    deviceType: this.deviceService.deviceType,
                });

                const result = await firstValueFrom(this.create(data));
                localStorage.setItem('web-push-subscription', JSON.stringify(result));
                this.utilityService.showSwalToast('Success', "Subscribed successfully");
            }

        } catch (err)
        {
            console.log('Failed to subscribe', err);
        }
    }

    async unSubscribe()
    {
        try
        {
            await this.swPush.unsubscribe();

            console.log('Successfully unsubscribed', this.subscription);
            const result = localStorage.getItem('web-push-subscription');
            if (result)
            {
                const subscription: WebPushSubscription = JSON.parse(result);
                await firstValueFrom(this.delete(subscription.id));
                this.utilityService.showSwalToast('Success', "Un-Subscribed successfully");
            }
        } catch (error)
        {
            console.log('Failed to unsubscribe', error);
        }

    }

    create(value: WebPushSubscription): Observable<any>
    {
        return this.http.post<any>(this.apiRoute, value, { headers: { 'No-loader': 'true' } });
    }

    getById(value: string): Observable<any>
    {
        return this.http.get<any>(`${this.apiRoute}/${value}`, { headers: { 'No-loader': 'true' } });
    }

    getByUsername(value: string): Observable<any>
    {
        return this.http.get<any>(`${this.apiRoute}/Username/${value}`, { headers: { 'No-loader': 'true' } });
    }

    delete(value: string): Observable<any>
    {
        return this.http.delete<any>(`${this.apiRoute}/${value}`, { headers: { 'No-loader': 'true' } });
    }

    deleteByUsername(value: string): Observable<any>
    {
        return this.http.delete<any>(`${this.apiRoute}/Username/${value}`, { headers: { 'No-loader': 'true' } });
    }

}