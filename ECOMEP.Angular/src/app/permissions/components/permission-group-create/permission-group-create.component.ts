import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PermissionGroupService } from '../../services/permission-group.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PermissionGroup } from '../../models/permissionGroup.model';

@Component({
  selector: 'app-permission-group-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './permission-group-create.component.html',
  styleUrls: ['./permission-group-create.component.scss']
})
export class PermissionGroupCreateComponent {
  form!: FormGroup;
  moduleOptions: string[] = [];
  permissionOptionsMap: Map<number, string[]> = new Map();
  rolesData: any[] = [];
  get f(): any { return this.form.controls; }

  constructor(
    private dialogRef: MatDialogRef<PermissionGroupCreateComponent>,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private entityService: PermissionGroupService,
    @Inject(MAT_DIALOG_DATA) public data: { rolesData: any[] }
  ) {
    this.rolesData = data.rolesData;
    this.moduleOptions = [...new Set(this.rolesData.map((item: any) => item.module))];
    this.buildForm();
    this.addPermission();
  }

  buildForm() {
    this.form = this.fb.group({
      title: new FormControl(null, { validators: [Validators.required] }),
      permissions: this.fb.array([])
    });
  }

  get permissions() {
    return this.form.get('permissions') as FormArray;
  }

  addPermission() {
    const index = this.permissions.length;
    const permissionGroup = this.fb.group({
      module: new FormControl(null, { validators: [Validators.required] }),
      permission: new FormControl(null, { validators: [Validators.required] })
    });

    permissionGroup.get('module')?.valueChanges.subscribe((value: any) => {
      if(value && this.rolesData.length > 0){
        this.permissionOptionsMap.set(index, [...new Set(this.rolesData.filter(x => x.module === value).map(x => x.title))]);
      }
    });

    this.permissions.push(permissionGroup);
  }

  getPermissionOptions(index: number): string[] {
    return this.permissionOptionsMap.get(index) || [];
  }

  removePermission(index: number) {
    this.permissions.removeAt(index);
    this.permissionOptionsMap.delete(index);
  }



  onClose() {
    this.dialogRef.close();
  }

  async onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
         this.utilityService.showSweetDialog(
        'Incomplete data!',
        'Please fill all required fields with valid data and try again!',
        'warning');
      return;
      return;
    }

    const formValue = this.form.value;
    const roleCodes = formValue.permissions.map((perm: any) => {
      const role = this.rolesData.find(r => r.module === perm.module && r.title === perm.permission);
      return role?.name;
    }).filter((name: any) => name);

    const _payload = new PermissionGroup({
      title: formValue.title,
      roleCodes: roleCodes
    });
    console.log('_payload',_payload);
    const _response = await firstValueFrom(this.entityService.create(_payload));
    this.dialogRef.close(_response);
  }

  getErrorMessage(control: any) {
    return this.utilityService.getErrorMessage(control);
  }
}
