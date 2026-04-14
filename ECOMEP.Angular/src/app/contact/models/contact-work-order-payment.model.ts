import { BaseBlobEntity, BaseEntity } from "src/app/shared/models/base-entity.model";

export class ContactWorkOrderPayment extends BaseEntity {
    billID!: number;
    mode!: string;
    amount: number = 0;
    netAmount: number = 0;
    currency: string = "INR";
    // tds: number = 0;
    tdsAmount: number = 0;
    isTDSPaid: boolean = false;
    // tdsRate: number = 0;
    tdsShare: number = 0;
    comment?: string;
    transactionNo?: string;
    transactionDate?: Date;
    bankDetail?: string;
    refUrl?: string;
    refGuid?: string;
    contactWorkOrderID!: number;
    adjustmentAmount: number = 0;
    exchangeRate: number = 0;
    attachments: ContactWorkOrderPaymentAttachment[] = [];
    constructor(init?: Partial<ContactWorkOrderPayment>) {
        super(init);
        Object.assign(this, init);
    }
}

export class ContactWorkOrderPaymentAttachment extends BaseBlobEntity {
    contactWorkOrderPaymentID!: number;
    constructor(init?: Partial<ContactWorkOrderPaymentAttachment>) {
        super(init);
        Object.assign(this, init);
    }
}