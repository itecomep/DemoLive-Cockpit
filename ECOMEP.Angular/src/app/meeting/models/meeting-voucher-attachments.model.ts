import { BaseBlobEntity } from "src/app/shared/models/base-entity.model";

export class MeetingVoucherAttachment extends BaseBlobEntity {
    meetingVoucherID!: number;

    constructor(init?: Partial<MeetingVoucherAttachment>) {
        super(init);
        Object.assign(this, init);
    }
}