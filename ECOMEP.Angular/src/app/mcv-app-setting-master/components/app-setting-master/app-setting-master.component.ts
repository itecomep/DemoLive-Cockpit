import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { HeaderComponent } from "../../../mcv-header/components/header/header.component";
import { ActivatedRoute } from "@angular/router";
import { AppSettingMasterApiService } from "src/app/shared/services/app-setting-master-api.service";
import { firstValueFrom } from "rxjs";
import { PresetMaster } from "src/app/shared/models/preset-master";
import { MatIconModule } from "@angular/material/icon";
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
  selector: "app-app-setting-master",
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
  templateUrl: "./app-setting-master.component.html",
  styleUrls: ["./app-setting-master.component.scss"],
})
export class AppSettingMasterComponent {
  headerTitle: string = "";
  headerTitleCount: number = 0;
  presets: PresetMaster[] = [];
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
    private presetMasterService: AppSettingMasterApiService,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService
  ) {}

  async ngOnInit() {
    this.buildForm(); // Ensure the form is initialized before usage
    await this.presetData();
    this.bindForm();

    if (this.route) {
      this.headerTitle = "App Setting Master";
    }
  }

  async presetData() {
    this.presets = await firstValueFrom(
      this.presetMasterService.getAppSettingMaster()
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
    this.presets.forEach((item) => {
      this.addInput(item);
    });
  }

  private addInput(value: PresetMaster) {
    const group = this.formBuilder.group({
      key: new FormControl(value.presetKey, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      value: new FormControl(value.presetValue, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
    });
    this.fa.push(group);
  }

  addPreset() {
    const group = this.formBuilder.group({
      key: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      value: new FormControl("", [Validators.maxLength(255)]),
    });

    // Add the new row to the FormArray
    this.fa.push(group);

    // Optionally add an empty object to the `presets` array for UI consistency
    this.presets.push({ presetKey: "", presetValue: "" } as PresetMaster);
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
    if(!this.presets[index].id){
      this.submitPreset(event,controlName,index);
      return;
    }
    let obj = this.presets[index];
    if (controlName == "key") {
      obj.presetKey = event.target.value;
    } else {
      obj.presetValue = event.target.value;
    }

    const _updated = await firstValueFrom(
      this.presetMasterService.update(obj)
    );
    this.utilityService.showSwalToast("Success!", "Updated Preset Successfully.");
    console.log("event", event);
    console.log("index", index);
    console.log("controlName", controlName);
  }

  async submitPreset(event:any,controlName:string,index:number){
    let obj = new PresetMaster();
    if(controlName == "key"){
      obj.presetKey = event.target.value;
    }else{
      obj.presetValue = event.target.value;
    }
    const _updated = await firstValueFrom(
      this.presetMasterService.create(obj)
    );
    this.presets[index] = _updated;
    this.utilityService.showSwalToast("Success!", "Created Preset Successfully.");

  }

  async onDeletePreset(index: any) {
    // Check if the object has a null ID
    if (!this.presets[index].id) {
      // Directly delete the object from the array and the form array
      this.presets.splice(index, 1);
      this.fa.removeAt(index);
      console.log("Deleted preset with null ID:", this.presets);
    } else {
      // If the ID exists, show the confirmation dialog
      this.utilityService.showConfirmationDialog(
        `Do you want to delete this preset, ${this.presets[index].presetKey}?`,
        async () => {
          // Call the delete service and remove the object if confirmed
          const _deleted = await firstValueFrom(
            this.presetMasterService.delete(this.presets[index].id)
          );

          // Filter out the deleted object from the presets array
          this.presets = this.presets.filter(
            (item) => item.id !== this.presets[index].id
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

    this.presets.sort((a:any, b:any) => {
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
