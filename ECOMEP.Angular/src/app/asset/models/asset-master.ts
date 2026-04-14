import { BaseEntity } from "src/app/shared/models/base-entity.model";

export class AssetAttributeMaster extends BaseEntity {
    attribute!: string;
    category!: string;
    inputType!: string;
    isRequired: boolean = false;
    inputOptions!: string;
}