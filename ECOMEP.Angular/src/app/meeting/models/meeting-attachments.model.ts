import { BaseBlobEntity } from "src/app/shared/models/base-entity.model";

export class MeetingAttachment extends BaseBlobEntity {
    meetingID!: number;
    constructor(init?: Partial<MeetingAttachment>) {
        super(init);
        Object.assign(this, init);
    }
} 