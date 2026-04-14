import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PermissionGroupService } from '../../services/permission-group.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PermissionGroup } from '../../models/permissionGroup.model';

@Component({
  selector: 'app-permission-group-update',
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
  templateUrl: './permission-group-update.component.html',
  styleUrls: ['./permission-group-update.component.scss']
})
export class PermissionGroupUpdateComponent {
  form!: FormGroup;
  moduleOptions: string[] = [];
  permissionOptionsMap: Map<number, string[]> = new Map();
  rolesData: any[] = [];
  permissionGroup!: PermissionGroup;
  get f(): any { return this.form.controls; }

  constructor(
    private dialogRef: MatDialogRef<PermissionGroupUpdateComponent>,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private entityService: PermissionGroupService,
    @Inject(MAT_DIALOG_DATA) public data: { rolesData: any[], permissionGroup: PermissionGroup }
  ) {
    this.rolesData = data.rolesData;
    this.permissionGroup = data.permissionGroup;
    this.moduleOptions = [...new Set(this.rolesData.map((item: any) => item.module))];
    this.buildForm();
    this.populateForm();
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

  populateForm() {
    this.form.patchValue({ title: this.permissionGroup.title });
    
    if (this.permissionGroup.roleCodes && this.permissionGroup.roleCodes.length > 0) {
      this.permissionGroup.roleCodes.forEach(roleCode => {
        const role = this.rolesData.find(r => r.name === roleCode);
        if (role) {
          this.addPermissionWithData(role.module, role.title);
        }
      });
    } else {
      this.addPermission();
    }
  }

  addPermissionWithData(module: string, permission: string) {
    const index = this.permissions.length;
    const permissionGroup = this.fb.group({
      module: new FormControl(module, { validators: [Validators.required] }),
      permission: new FormControl(permission, { validators: [Validators.required] })
    });

    permissionGroup.get('module')?.valueChanges.subscribe((value: any) => {
      if(value && this.rolesData.length > 0){
        this.permissionOptionsMap.set(index, [...new Set(this.rolesData.filter(x => x.module === value).map(x => x.title))]);
      }
    });

    this.permissionOptionsMap.set(index, [...new Set(this.rolesData.filter(x => x.module === module).map(x => x.title))]);
    this.permissions.push(permissionGroup);
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
      id: this.permissionGroup.id,
      title: formValue.title,
      roleCodes: roleCodes
    });
    
    const _response = await firstValueFrom(this.entityService.update(_payload));
    this.dialogRef.close(_response);
  }

  getErrorMessage(control: any) {
    return this.utilityService.getErrorMessage(control);
  }
}