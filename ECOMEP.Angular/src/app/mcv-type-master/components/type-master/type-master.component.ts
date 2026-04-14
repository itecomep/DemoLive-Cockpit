import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/mcv-header/components/header/header.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TypeMasterService } from 'src/app/shared/services/type-master.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { firstValueFrom } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TypeMaster } from 'src/app/shared/models/type-master-dto';

@Component({
  selector: 'app-type-master',
  standalone: true,
  imports: [
     MatButtonModule,
     HeaderComponent,
     FooterComponent,
     MatIconModule,
     CommonModule,
     MatTooltipModule,
     ReactiveFormsModule,
     FormsModule,
     MatInputModule,
   ],
  templateUrl: './type-master.component.html',
  styleUrls: ['./type-master.component.scss']
})
export class TypeMasterComponent {
 headerTitle: string = "";
  headerTitleCount: number = 0;
  typePresets: any[] = [];
  form!: FormGroup;
  sortColumn: string = '';  
  sortDirection: string = 'asc';
  get f(): any {
    return this.form.controls;
  }
  get fa(): FormArray {
    return this.f["presets"] as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private typeMasterService: TypeMasterService,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService
  ) {}

  async ngOnInit() {
    this.buildForm(); // Ensure the form is initialized before usage
    await this.presetData();
    this.bindForm();

    if (this.route) {
      this.headerTitle = "Type Master";
    }
  }

  async presetData() {
    this.typePresets = await firstValueFrom(
      this.typeMasterService.get()
    );
  }

  buildForm() {
    this.form = this.formBuilder.group({
      presets: this.formBuilder.array([]),
    });
    this.touchForm();
  }

  bindForm() {
    this.fa.clear();
    this.typePresets.forEach((item) => {
      this.addInput(item);
    });
  }

  private addInput(value: any) {
    const group = this.formBuilder.group({
      entity: new FormControl(value.entity),
      title: new FormControl(value.title),
      value: new FormControl(value.value),
    });
    this.fa.push(group);
  }

  addPreset() {
    const group = this.formBuilder.group({
      entity: new FormControl("", [
        // Validators.required,
        // Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      title: new FormControl("", [Validators.maxLength(255)]),
      value: new FormControl(0,),
    });

    // Add the new row to the FormArray
    this.fa.push(group);

    // Optionally add an empty object to the `presets` array for UI consistency
    this.typePresets.push({ entity: "", title: "" ,value: "" } );
  }

  touchForm() {
    // touch form inputs to show validation messages
    if (this.form) {
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  getFormControl(
    formArray: FormArray,
    index: number,
    controlName: string
  ): FormControl {
    const _cellFormGroup = <FormGroup>formArray.controls[index];
    if (_cellFormGroup && _cellFormGroup.controls[controlName]) {
      return <FormControl>_cellFormGroup.controls[controlName];
    }
    return new FormControl();
  }



  async updatePreset(event: any, index: number, controlName: string) {
    if(!this.typePresets[index].id){
      this.submitPreset(event,controlName,index);
      return;
    }
    let obj = this.typePresets[index];
    obj[controlName] = event.target.value;
    const _updated = await firstValueFrom(this.typeMasterService.update(obj));
    this.utilityService.showSwalToast("Success!", "Type Preset Updated Successfully.");

  }

  async submitPreset(event: any, controlName: string, index: number) {
    let obj = new TypeMaster();
    Object.assign(obj, this.form.value.presets[index]);
    // let obj = this.form.value.presets[index];
    const _created = await firstValueFrom(this.typeMasterService.create(obj));
    this.typePresets[index] = _created;
    this.utilityService.showSwalToast("Success!", "Type Preset Created Successfully.");
  }

  async onDeletePreset(index: any) {
    // Check if the object has a null ID
    if (!this.typePresets[index].id) {
      // Directly delete the object from the array and the form array
      this.typePresets.splice(index, 1);
      this.fa.removeAt(index);
      console.log("Deleted preset with null ID:", this.typePresets);
    } else {
      // If the ID exists, show the confirmation dialog
      this.utilityService.showConfirmationDialog(
        `Do you want to delete this preset?`,
        async () => {
          // Call the delete service and remove the object if confirmed
          const _deleted = await firstValueFrom(
            this.typeMasterService.delete(this.typePresets[index].id)
          );

          // Filter out the deleted object from the presets array
          this.typePresets = this.typePresets.filter(
            (item) => item.id !== this.typePresets[index].id
          );
          this.fa.removeAt(index);

          // Show success toast
          this.utilityService.showSwalToast("Success!", "Deleted Preset Successfully.");
        }
      );
    }
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.typePresets.sort((a, b) => {
      let valA = a[column];
      let valB = b[column];
 //if any column is numerical use '$columnname' instead of value
      if (column === 'value') {
        valA = Number(valA);
        valB = Number(valB);
      } else {
        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();
      }

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    this.bindForm();
  }
}
