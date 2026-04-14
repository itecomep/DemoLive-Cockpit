import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactAttachment } from '../../models/contact';
import { MatExpansionModule } from '@angular/material/expansion';
import { McvFileUploadComponent, UploadResult } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';
import { ContactAttachmentApiService } from '../../services/contact-attachment-api.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { AppConfig } from 'src/app/app.config';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { firstValueFrom, forkJoin } from 'rxjs';
import { McvTagEditorComponent } from 'src/app/mcv-tag-editor/components/mcv-tag-editor/mcv-tag-editor.component';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-contact-team-documents',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,

    //Components
    McvFileComponent,
    McvFileUploadComponent,
    McvTagEditorComponent
  ],
  templateUrl: './contact-team-documents.component.html',
  styleUrls: ['./contact-team-documents.component.scss']
})
export class ContactTeamDocumentsComponent {

  @Input() attachments: ContactAttachment[] = [];
  categoryOptions: string[] = [];
  blobConfig: any;

  uploaderConfig: {
    apiUrl: string,
    autoUpload: boolean;
    typeFlag: number;
    entityTitle: string,
    entityID: number
    allowEdit: boolean,
    allowDelete: boolean
  } | any;
  @Input('config') set configValue(value: any) {
    if (value) {
      this.uploaderConfig = value;
    }
  }

  @Output() uploadComplete = new EventEmitter<any>();

  constructor(
    private utilityService: UtilityService,
    private mcvfileUtilityService: McvFileUtilityService,
    private attachmentService: ContactAttachmentApiService,
    private appSettingService: AppSettingMasterApiService,
    private config: AppConfig
  ) { }

  async ngOnInit() {
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }

    const categoryOptions = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_EMPLOYEE_DOCUMENT_CATEGORY_OPTIONS);
    if (categoryOptions) {
      this.categoryOptions = categoryOptions.presetValue.split(',').map(x => x.toUpperCase()).sort((a, b) => a.localeCompare(b));
    }
    this.blobConfig = {
      container: this.appSettingService?.presets?.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS)?.presetValue,
      folderPath: `${this.config.NAMEOF_ENTITY_CONTACT}`
    };
    this.getSearchTagOptions();
  }

  onDeleteAttachment(item: ContactAttachment) {
    if (item) {
      this.attachmentService.delete(item.id).subscribe(
        () =>
          this.attachments = this.attachments.filter(obj => obj.uid !== item.uid)
      );
    }
  }

  onDownloadAttachment(item: any) {
    window.open(item.url);
  }

  getFilteredAttachments(attachments: ContactAttachment[], typeFlag: number, isMedia: boolean) {
    return isMedia ?
      attachments.filter(x => x.typeFlag == typeFlag
        && (this.mcvfileUtilityService.isImage(x.filename) || this.mcvfileUtilityService.isVideo(x.filename) || this.mcvfileUtilityService.isAudio(x.filename))
      ) :
      attachments.filter(x => x.typeFlag == typeFlag
        && !(this.mcvfileUtilityService.isImage(x.filename) || this.mcvfileUtilityService.isVideo(x.filename) || this.mcvfileUtilityService.isAudio(x.filename))
      );
  }

  onTagsUpdate(tags: string[], attachment: ContactAttachment) {
    if (tags) {
      attachment.searchTags = tags;
      this.attachmentService.update(attachment).subscribe(
        (data) => {

        }
      );
    }
  }

  onUpload(uploads: UploadResult[], category?: string) {
    // console.log('attachments', uploads);
    let _createRequests: any[] = [];
    uploads.forEach(x => {
      let obj = new ContactAttachment();
      obj.filename = x.filename;
      obj.size = x.size;
      obj.contentType = x.contentType;
      obj.guidname = x.blobPath;
      obj.blobPath = x.blobPath;
      obj.contactID = this.uploaderConfig.entityID;
      obj.container = this.blobConfig.container;
      obj.typeFlag = this.uploaderConfig.typeFlag;
      obj.url = x.url;
      obj.originalUrl = x.url;
      obj.title = category;
      _createRequests.push(this.attachmentService.create(obj));

    });

    forkJoin(_createRequests).subscribe(results => {
      console.log('createdAttachments', results);
      results.forEach(x => {
        this.attachments.push(x as ContactAttachment);
      })
      this.uploadComplete.emit(this.attachments);
    })
  }


  tagOptions: any[] = [];

  private getSearchTagOptions() {
    this.attachmentService.getSearchTagOptions().subscribe(data => {
      this.tagOptions = data;
    });
  }

  getAttachmentsByTitle(title?: string) {
    return this.attachments.filter(x => x.title == title);
  }

  async onCopiedAttachment(attachment: any, category?:string) {
    if (attachment) {
      const _contactDocument = new ContactAttachment();
      _contactDocument.filename = attachment.filename;
      _contactDocument.size = attachment.size;
      _contactDocument.contentType = attachment.contentType;
      _contactDocument.guidname = attachment.blobPath;
      _contactDocument.blobPath = attachment.blobPath;
      _contactDocument.contactID = this.uploaderConfig.entityID;
      _contactDocument.container = this.blobConfig.container;
      _contactDocument.typeFlag = attachment.typeFlag;
      _contactDocument.url = attachment.url;
      _contactDocument.thumbUrl = attachment.thumbUrl;
      _contactDocument.originalUrl = attachment.url;
      if(category){
        _contactDocument.title = category;
      }
      const _image = await firstValueFrom(this.attachmentService.create(_contactDocument));
      this.utilityService.showSwalToast('Pasted Successfully!!','','success');
      if (_image) {
        this.attachments.push(_image);
      }
    }
  }
}
