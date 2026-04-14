import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { McvFile } from '../../models/mcv-file';
import { McvFileUtilityService } from '../../services/mcv-file-utility.service';
import { McvLightBoxComponent } from '../mcv-light-box/mcv-light-box.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { McvFileComponent } from '../mcv-file/mcv-file.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'mcv-file-list',
    templateUrl: './mcv-file-list.component.html',
    styleUrls: ['./mcv-file-list.component.scss'],
    standalone: true,
    imports: [NgFor, McvFileComponent]
})
export class McvFileListComponent implements OnInit, AfterViewInit, OnDestroy
{
  @Input() files: any[] = [];
  @Input() hideDetails: boolean = false;
  @Input() allowAttachmentDelete: boolean = false;
  @Input() showRemove: boolean = false;
  @Input() showPreview: boolean = false;
  @Input() entityTitle!: string;
  @Input() isVerticalThumb: boolean = false;
  @Input() allowTagging: boolean = false;
  @Input() showEditor: boolean = false;

  @Output() delete = new EventEmitter<any>();
  @Output() preview = new EventEmitter<any>();
  @Output() edited = new EventEmitter<any>();

  constructor(
    private service: McvFileUtilityService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void
  {

  }

  ngAfterViewInit()
  {
  }

  ngOnDestroy()
  {
  }


  onDelete(attachment: any)
  {
    this.delete.emit(attachment);
  }
  onPreviewClick(attachment: McvFile)
  {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: this.entityTitle,
      urls: this.service.getImageUrls(this.files),
      activeUrl: attachment.url,
      mediaType: this.service.getMediaType(attachment.filename),
      contentType: attachment.contentType
    };

    const ref = this.dialog.open(McvLightBoxComponent, dialogConfig);

    ref.afterClosed().subscribe(result =>
    {
      console.log('Dialog closed', result);
    });
    this.preview.emit(attachment);
  }

  onEdited(e: any)
  {
    this.edited.emit(e);
  }
}
