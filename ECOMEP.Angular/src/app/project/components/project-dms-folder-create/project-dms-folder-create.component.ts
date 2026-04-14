import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TextFieldModule } from '@angular/cdk/text-field';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { firstValueFrom } from 'rxjs';
import { ProjectAttachmentApiService } from '../../services/project-attachment-api.service';
import { ProjectAttachment } from '../../models/project.model';

@Component({
  selector: 'app-project-dms-folder-create',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
  ],
  templateUrl: './project-dms-folder-create.component.html',
  styleUrls: ['./project-dms-folder-create.component.scss']
})
export class ProjectDmsFolderCreateComponent implements OnInit {

  form!: FormGroup;

  get f(): any { return this.form.controls; }

  projectID!: number;
  parent?: ProjectAttachment;
  currentItem?: ProjectAttachment;
  constructor(
    @Inject(MAT_DIALOG_DATA) data: { projectID: number, parent?: ProjectAttachment,currentItem?: ProjectAttachment },
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ProjectDmsFolderCreateComponent>,
    private utilityService: UtilityService,
    private projectAttachmentService: ProjectAttachmentApiService
  ) {
    if (data) {
      if (!this.form) {
        this.buildForm();
      }
      // console.log(data)
      this.projectID = data.projectID;
      this.parent = data.parent;
      this.currentItem = data.currentItem;
      if(this.currentItem){
        this.form.patchValue(this.currentItem);
      }
    }
  }

  ngOnInit() {
    if (!this.form) {
      this.buildForm();
    }
  }

  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      filename: new FormControl<any>('', { validators: [Validators.required] }),
    });

  }

  onClose() {
    this.dialogRef.close();
  }

  async onSubmit() {
    if (this.form.invalid) {
      console.log('Invalid form', this.form.errors);
      this.utilityService.showSweetDialog(
        'Incomplete data!',
        'Please fill all required fields marked with * and try again!',
        'warning');
      return;
    }

    if(!this.currentItem){
    const folder = new ProjectAttachment({
      isFolder: true,
      projectID: this.projectID,
      parentID: this.parent?.id,
      folderPath:this.parent?.folderPath ?  this.parent?.folderPath+ '/' + this.parent.filename : this.parent?.filename,
      filename: this.f.filename.value,

    });
    console.log(folder);
    var res = await firstValueFrom(this.projectAttachmentService.create(folder));
    this.utilityService.showSwalToast('Folder Created!', 'Folder was successfully created!', 'success');
    this.dialogRef.close(res);
  }else{
    this.currentItem.filename = this.f.filename.value;
    var res = await firstValueFrom(this.projectAttachmentService.update(this.currentItem));
    this.utilityService.showSwalToast('Folder Updated!', 'Folder was successfully updated!', 'success');
    this.dialogRef.close(res);
  }

  }

}
