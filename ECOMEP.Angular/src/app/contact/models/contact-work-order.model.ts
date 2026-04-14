import { BaseBlobEntity, BaseEntity } from "src/app/shared/models/base-entity.model";
import { ContactWorkOrderPayment } from "./contact-work-order-payment.model";

export class ContactWorkOrder extends BaseEntity {
    contactID!: number;
    companyID?: number;
    workOrderNo?: string;
    workOrderDate!: Date;
    dueDate!: Date;
    fees!: number;
    payments: ContactWorkOrderPayment[] = [];
    attachments: ContactWorkOrderAttachment[] = [];
    constructor(init?: Partial<ContactWorkOrder>) {
        super(init);
        Object.assign(this, init);
    }
}

export class ContactWorkOrderAttachment extends BaseBlobEntity {
    contactWorkOrderID!: number;
    constructor(init?: Partial<ContactWorkOrderAttachment>) {
        super(init);
        Object.assign(this, init);
    }
}