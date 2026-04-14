import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';

import { TimeLineService } from '../../services/time-line.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';

import { Contact } from 'src/app/contact/models/contact';
import { TimeLineGroup } from '../../model/time-line-group';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-time-line-group-form',
    templateUrl: './time-line-group-form.component.html',
    styleUrls: ['./time-line-group-form.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, NgFor, MatOptionModule, MatButtonModule, MatTooltipModule, NgClass, MatIconModule, NgIf]
})
export class TimeLineGroupFormComponent implements OnInit
{
  contactOptions: Contact[] = [];
  contactFilter = [{ key: 'UsersOnly', value: 'true' }];
  form!: FormGroup;
  item!: TimeLineGroup;
  groupData: TimeLineGroup[] = [];
  formValue: TimeLineGroup[] = [];
  showMoreContact: boolean[] = [];

  get selectedGroup(): TimeLineGroup[] { return this.timeLineService.timeLineGroupItems; }

  get f(): any
  {
    return this.form.controls;
  }

  @Input('config') set configValue(value: any)
  {
    if (value)
    {
      this.item = value.dialogData;
      if (!this.form)
      {
        this.buildForm();
      }
      this.bindForm(this.item);
    }
  }

  @Output() create = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    protected contactService: ContactApiService,
    private utilityService: UtilityService,
    private timeLineService: TimeLineService
  ) { }

  ngOnInit()
  {
    if (!this.form)
    {
      this.buildForm();
    }
    this.getContactOptions();
    this.getFormValueOptions();
  }

  getErrorMessage(control: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }

  private touchForm()
  {
    if (this.form)
    {
      Object.keys(this.form.controls).forEach(field =>
      {
        const control = this.form.get(field);
        if (control != null)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }

  protected getContactOptions()
  {
    this.contactService.get(this.contactFilter, '', 'fullName').subscribe((data) =>
    {
      this.contactOptions = data;
    });
  }

  buildForm()
  {
    this.form = this.formBuilder.group({
      inputLabel: new FormControl('', [Validators.required]),
      group: new FormControl(''),
    });
  }

  bindForm(obj: TimeLineGroup)
  {
    if (this.form && obj)
    {
      this.f.inputLabel.setValue(obj.inputLabel);
      this.f.group.setValue(obj.group);
    }
  }

  onSubmit()
  {
    if (this.form.invalid)
    {
      this.touchForm();
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    if (this.form.value)
    {
      const _formValue = localStorage.getItem('formValue');
      if (_formValue != null)
      {
        this.formValue = JSON.parse(_formValue) || [];
      }
      this.create.emit(this.form.getRawValue());
      this.formValue.push(this.form.getRawValue());
      localStorage.setItem('formValue', JSON.stringify(this.formValue));
      this.timeLineService.timeLineGroupItems = this.formValue;
      this.getFormValueOptions();
      this.form.reset();
    }
  }

  getFormValueOptions()
  {
    const _formValue = localStorage.getItem(('formValue'));
    if (_formValue != null)
    {
      this.groupData = JSON.parse(_formValue);
    }
  }

  selectGroup(obj: TimeLineGroup)
  {
    this.bindForm(obj);
  }

  deleteGroup(label: any)
  {
    if (label)
    {
      const _formValue = localStorage.getItem(('formValue'));
      if (_formValue != null)
      {
        this.formValue = JSON.parse(_formValue);
      }
      this.formValue = this.formValue.filter(x => x.inputLabel != label);
      localStorage.setItem('formValue', JSON.stringify(this.formValue));
      this.timeLineService.timeLineGroupItems = this.formValue;
      this.getFormValueOptions();
    }
  }

  removeUser(group: any, userID: number)
  {
    var removeUserArray: any;
    const _formValue = localStorage.getItem(('formValue'));
    if (_formValue != null)
    {
      removeUserArray = _formValue
    }
    removeUserArray.forEach((x: any) =>
    {
      if (x.inputLabel.toLowerCase() == group.toLowerCase())
      {
        x.group = x.group.filter((x: any) => x.id != userID);
      }
    });
    localStorage.setItem('formValue', JSON.stringify(removeUserArray));
    this.timeLineService.timeLineGroupItems = removeUserArray;
    this.getFormValueOptions();
  }

  toggleUserUL(i: number)
  {
    this.showMoreContact[i] = !this.showMoreContact[i];
  }
}
