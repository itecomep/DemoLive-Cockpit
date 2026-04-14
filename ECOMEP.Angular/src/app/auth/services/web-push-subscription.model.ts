export class WebPushSubscription
{
    id!: string;
    username?: string;
    os?: string;
    browser?: string;
    device?: string;
    deviceType?: string;
    subscription!: string;

    constructor(init?: Partial<WebPushSubscription>)
    {
        Object.assign(this, init);
    }
}