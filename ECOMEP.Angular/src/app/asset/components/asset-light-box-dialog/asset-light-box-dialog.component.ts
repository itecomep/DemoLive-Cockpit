import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AssetAttachment } from '../../models/asset';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AssetLightBoxComponent } from '../asset-light-box/asset-light-box.component';

@Component({
  selector: 'app-asset-light-box-dialog',
  standalone: true,
  imports: [
     CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    //Component
    AssetLightBoxComponent],
  templateUrl: './asset-light-box-dialog.component.html',
  styleUrls: ['./asset-light-box-dialog.component.scss']
})
export class AssetLightBoxDialogComponent {

  data: any;
  currentAttachment: AssetAttachment;
  attachmentArray: AssetAttachment[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<AssetLightBoxDialogComponent>) {
    this.data = data;
    // console.log(this.data);
    this.currentAttachment = this.data.currentAttach;
    this.attachmentArray = this.data.attachArray;;
  }

  ngOnInit(): void {
  }

  onClose(result: any) {
    this.dialogRef.close(result);
  }
}
