import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { ContactApiService } from '../../services/contact-api.service';
import { firstValueFrom } from 'rxjs';
import { BlobUploadInfo } from 'src/app/mcv-file/models/mcv-blob-upload-info.model';
import { Contact } from '../../models/contact';
import { McvFileUploadComponent, UploadResult } from '../../../mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
    selector: 'app-contact-photo-editor',
    templateUrl: './contact-photo-editor.component.html',
    styleUrls: ['./contact-photo-editor.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatDialogModule, NgIf, McvFileUploadComponent]
})
export class ContactPhotoEditorComponent implements OnInit
{
  blobConfig!: McvFileUploadConfig;

  contact!: Contact;
  constructor(
    @Inject(MAT_DIALOG_DATA) dialogData: any,
    private dialogRef: MatDialogRef<ContactPhotoEditorComponent>,
    private contactService: ContactApiService,
    private config: AppConfig,
    private McvFileUtilityservice: McvFileUtilityService,
    private appSettingService: AppSettingMasterApiService,
    private utilityService: UtilityService
  )
  {
    this.contact = dialogData.contact;
  }

  onClose(result: any)
  {
    this.dialogRef.close(result);
  }
  async ngOnInit()
  {
    if (!this.appSettingService.presets || !this.appSettingService.presets.length)
    {
      await this.appSettingService.loadPresets();
    }

    if (this.appSettingService.presets)
    {
      const _presetValue = this.appSettingService.presets.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
      if (_presetValue)
        this.blobConfig = new McvFileUploadConfig(
          _presetValue.presetValue,
          `${this.config.NAMEOF_ENTITY_CONTACT}`
        );
    }
  }

  async onUpload(uploads: UploadResult[])
  {
    this.contact.photoUrl = uploads[0].url;
    const dialogRef = this.McvFileUtilityservice.openImageEditorDialog(uploads[0].blobPath, uploads[0].url);
    dialogRef.afterClosed().subscribe(async (res: any) =>
    {
      console.log('onClose', res);
      if (res)
      {

        this.contact.photoUrl = res;
        await firstValueFrom(this.contactService.update(this.contact));
        this.contactService.refreshList();
        this.onClose(this.contact);
      }
    });
  }

  async onRemovePhoto() {
    this.utilityService.showConfirmationDialog('Do you want to remove your profile photo?', async () => {
      if (this.contact && this.contact.associatedContacts) {
        this.contact.photoUrl = undefined;
        await firstValueFrom(this.contactService.update(this.contact));
        this.contactService.refreshList();
        this.onClose(this.contact);
      }
    });
  }
}