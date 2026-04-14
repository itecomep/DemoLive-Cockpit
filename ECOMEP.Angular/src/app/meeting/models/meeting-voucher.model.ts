import { BaseEntity } from "src/app/shared/models/base-entity.model";
import { MeetingVoucherAttachment } from "./meeting-voucher-attachments.model";

export class MeetingVoucher extends BaseEntity {
    meetingID!: number;
    expenseAmount!: number;
    expenseHead!: string;
    particulars!: string;
    attachments: MeetingVoucherAttachment[] = [];

    constructor(init?: Partial<MeetingVoucher>) {
        super(init);
        Object.assign(this, init);
    }
}