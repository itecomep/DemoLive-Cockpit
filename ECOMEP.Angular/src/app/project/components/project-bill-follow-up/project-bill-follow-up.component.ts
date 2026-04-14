import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ProjectBillFollowUp } from '../../models/project-bill.model';
import { ProjectBillFollowUpApiService } from '../../services/project-bill-follow-up-api.service';
import { NgFor, DatePipe } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-project-bill-follow-up',
  templateUrl: './project-bill-follow-up.component.html',
  styleUrls: ['./project-bill-follow-up.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, TextFieldModule, NgFor, DatePipe]
})
export class ProjectBillFollowUpComponent {

  title: string = "";
  form!: FormGroup;
  followUps: ProjectBillFollowUp[] = [];
  id!: number;

  constructor(@Inject(MAT_DIALOG_DATA) data: any,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private dialogRef: MatDialogRef<ProjectBillFollowUpComponent>,
    private followUpService: ProjectBillFollowUpApiService
  ) {
    if (!this.form) {
      this.buildForm();
    }
    if (data) {
      this.title = data.title;
      this.id = data.id;
      this.GetData(data.id);
    }
  }


  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  private async GetData(id: number) {
    this.followUps = await firstValueFrom(this.followUpService.get([{ key: 'BillID', value: id.toString() }]));
  }

  protected buildForm() {
    this.form = this.formBuilder.group({
      dueDate: new FormControl<any>(null),
      comment: new FormControl<any>(null),
    })
  }

  getErrorMessage(control?: AbstractControl) {
    return this.utilityService.getErrorMessage(control);
  }

  onClose() {
    this.dialogRef.close();
  }
  async onSubmit() {
    if (this.form.invalid) {
      console.log('Invalid form', this.form.errors);
      this.utilityService.showSweetDialog(
        'Incomplete data!',
        'Please fill all required fields with valid data and try again!',
        'warning');
      return;
    }

    let followUp: ProjectBillFollowUp = Object.assign({}, this.form.getRawValue());
    followUp.billID = this.id;
    followUp = await firstValueFrom(this.followUpService.create(followUp));

    this.utilityService.showSwalToast(
      "Success!", "Save Successfull.",
    )
    this.followUps.unshift(followUp);
    this.dialogRef.close(followUp);
  }
}

