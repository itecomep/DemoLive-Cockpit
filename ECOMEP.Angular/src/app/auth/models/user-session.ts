import { Contact } from "src/app/contact/models/contact";
import { BaseEntity } from "src/app/shared/models/base-entity.model";

export class UserSession extends BaseEntity {
    contactID!: number;
    userName!: string;
    token!: string;
    ipAddress!: string;
    userAgent!: string;
    os!: string;
    browserName!: string;
    device!: string;
    deviceType!: string;
    logoutDateTime?: any;
    currentSessionisActive: boolean = false;
    contact?: Contact;
    isOTPRequired: boolean = false;
    isOTPVerified: boolean = false;
    otp!: string;
    geoLocation!: any;

    constructor(init?: Partial<UserSession>) {
        super(init);
        Object.assign(this, init);
    }
}

export class GeoLocation {
    timestamp?: number;
    coords!: Coordinates;
}

export class Coordinates {
    accuracy?: number;
    altitude?: number;
    altitudeAccuracy?: number;
    heading?: number;
    latitude?: number;
    longitude?: number;
    speed?: number;
}