import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { HeaderComponent } from "../../../mcv-header/components/header/header.component";
import { ActivatedRoute } from "@angular/router";
import { AppSettingMasterApiService } from "src/app/shared/services/app-setting-master-api.service";
import { firstValueFrom } from "rxjs";
import { PresetMaster } from "src/app/shared/models/preset-master";
import { MatIconModule } from "@angular/material/icon";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { UtilityService } from "src/app/shared/services/utility.service";
import { CompanyApiService } from "src/app/shared/services/company-api.service";
import { Company } from "src/app/shared/models/company.model";

@Component({
  selector: "app-company-master",
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
  templateUrl: "./company-master.component.html",
  styleUrls: ["./company-master.component.scss"],
})
export class CompanyMasterComponent {
  headerTitle: string = "";
  headerTitleCount: number = 0;
  companyPresets: any[] = [];
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
    private companyService: CompanyApiService,
    private utilityService: UtilityService

  ) {}

  async ngOnInit() {
    this.buildForm();
    await this.presetData();
    this.buildForm();
    if (this.route) {
      this.headerTitle = "Company Preset";
    }
  }
  async presetData() {
    this.companyPresets = await firstValueFrom(this.companyService.get());
  }

  buildForm() {
    this.form = this.formBuilder.group({
      presets: this.formBuilder.array([]),
    });
    this.touchForm();
    this.bindForm();
  }

  bindForm() {
    this.fa.clear();
    this.companyPresets.forEach((item) => {
      this.addInput(item);
    });
    // this.addInput(null);
  }

  private addInput(value: any) {
    console.log('value',value.title);
    const group = this.formBuilder.group({
      title: new FormControl(value.title, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      initials: new FormControl(value.initials, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      gstin: new FormControl(value.gstin, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      gstStateCode: new FormControl(value.gstStateCode, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      pan: new FormControl(value.pan, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      tan: new FormControl(value.tan, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      udhyam: new FormControl(value.udhyam, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      logoUrl: new FormControl(value.logoUrl, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      bank: new FormControl(value.bank, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      bankBranch: new FormControl(value.bankBranch, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      bankIFSCCode: new FormControl(value.bankIFSCCode, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      swiftCode: new FormControl(value.swiftCode, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      bankAccount: new FormControl(value.bankAccount, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      address: new FormControl(value.address, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      signStampUrl: new FormControl(value.signStampUrl, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      vHrRate: new FormControl(value.vHrRate, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
    });
    this.fa.push(group);
  }

  touchForm() {
    //touch form inputs to show validation messages
    if (this.form) {
      Object.keys(this.form.controls).forEach((field) => {
        // {1}
        const control = this.form.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
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
    if(!this.companyPresets[index].id){
      this.submitPreset(event,controlName,index);
      return;
    }
    let obj = this.companyPresets[index];
    obj[controlName] = event.target.value;
    const _updated = await firstValueFrom(this.companyService.update(obj));
    this.utilityService.showSwalToast("Success!", "Updated Preset Successfully.");

  }
  async submitPreset(event: any, controlName: string, index: number) {
    let obj = new Company();
    // let obj = this.form.value.presets[index];
    Object.assign(obj, this.form.value.presets[index]); 
    const _created = await firstValueFrom(this.companyService.create(obj));
    this.companyPresets[index] = _created;
    this.utilityService.showSwalToast("Success!", "Created Preset Successfully.");
  }

  async onDeletePreset(index: any) {
    if (!this.companyPresets[index].id) {
      // Directly delete the object from the array and the form array
      this.companyPresets.splice(index, 1);
      this.fa.removeAt(index);
   
    } else {
    this.utilityService.showConfirmationDialog(`Do you want to delete this preset?`,
      async () => {
     const _deleted =  await firstValueFrom( this.companyService.delete(this.companyPresets[index].id))
     this.companyPresets = this.companyPresets.filter((item, i) => item.id !== this.companyPresets[index].id)
     this.fa.removeAt(index)
     this.utilityService.showSwalToast(
      "Success!",
      "Deleted Preset Successfull.",
    );
    });}
  }

  addPreset() {
    const group = this.formBuilder.group({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      initials: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      gstin: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      gstStateCode: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      pan: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      tan: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      udhyam: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      logoUrl: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      bank: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      bankBranch: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      bankIFSCCode: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      swiftCode: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      bankAccount: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      signStampUrl: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
      vHrRate: new FormControl(0, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
      ]),
    });

    // Add the new row to the FormArray
    this.fa.push(group);

    // Optionally add an empty object to the `presets` array for UI consistency
    this.companyPresets.push({
      title: '',
      initials: '',
      gstin: '',
      gstStateCode: '',
      pan: '',
      tan: '',
      udhyam: '',
      logoUrl: '',
      bank: '',
      bankBranch: '',
      bankIFSCCode: '',
      swiftCode: '',
      bankAccount: '',
      address: '',
      signStampUrl: '',
      vHrRate: 0,
    } );
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.companyPresets.sort((a, b) => {
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
