import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ContactEmail, Contact } from '../../models/contact';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-contact-email-form',
    templateUrl: './contact-email-form.component.html',
    styleUrls: ['./contact-email-form.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, NgFor, MatOptionModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatInputModule]
})
export class ContactEmailFormComponent implements OnInit
{
  //--------FORM RELATED----------------//
  private readonly utilityService = inject(UtilityService);
  private readonly formBuilder = inject(FormBuilder);
  form!: FormGroup;
  contact!: Contact;
  get f(): any { return this.form.controls; }
  get isMobileView(): boolean { return this.utilityService.isMobileView; }
  private touchForm()
  {
    if (this.form)
    {
      Object.keys(this.form.controls).forEach(field =>
      {
        const control = this.form.get(field);
        if (control)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }
  getErrorMessage(control?: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }

  currentEntity: ContactEmail = new ContactEmail();
  @Input() titleOptions: string[] = ["Personal", "Work"];
  autoUpdate: boolean = false;
  isCreateMode: boolean = false;

  @Input('config') set configValue(value: { isCreateMode: boolean, autoUpdate: boolean, email?: ContactEmail, contact?: Contact })
  {
    if (value)
    {
      this.isCreateMode = value.isCreateMode;
      this.autoUpdate = value.autoUpdate;
      this.currentEntity = value.email ? value.email : new ContactEmail();
      if (value.contact)
      {
        this.contact = value.contact;
        this.currentEntity.contactID = value.contact.id;
      }
      this.buildForm();
    }
  }

  @Output() created = new EventEmitter<ContactEmail>();
  @Output() updated = new EventEmitter<ContactEmail>();
  @Output() deleted = new EventEmitter<ContactEmail>();

  ngOnInit(): void
  {
    if (!this.form)
    {
      this.buildForm();
    }
  }

  private buildForm()
  {
    this.form = this.formBuilder.group({
      email: new FormControl<any>(this.currentEntity.email, { validators: [Validators.required, Validators.email] }),
      title: new FormControl<any>(this.currentEntity.title || this.titleOptions[0], { validators: [Validators.required] }),
      isPrimary: new FormControl<any>(this.currentEntity.isPrimary, { validators: [Validators.required] }),
    });

    this.form.valueChanges
      .pipe(
        debounceTime(4000),
        distinctUntilChanged(),
      )
      .subscribe((value) =>
      {
        if (value)
        {
          this.onSubmit();
        }
      });
  }

  async onSubmit()
  {
    if (this.form.invalid)
    {
      this.touchForm();
      // this.utilityService.showSweetDialog('Invalid Form',
      //   'Please fill all required fields with valid data and try again.', 'error'
      // );
      return;
    }
    this.currentEntity = Object.assign(this.currentEntity, this.form.getRawValue());
    if (this.isCreateMode)
    {
      this.currentEntity.contactID = this.contact.id;
    
      this.created.emit(this.currentEntity);
    }
    else
    {
     
      this.updated.emit(this.currentEntity);
    }
  }

  async onDelete()
  {
   
    this.deleted.emit(this.currentEntity);
  }
}

