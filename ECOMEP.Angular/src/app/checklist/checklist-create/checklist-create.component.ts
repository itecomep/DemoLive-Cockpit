import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";

// import { HeaderComponent } from "../mcv-header/components/header/header.component";
import { HeaderComponent } from "../../mcv-header/components/header/header.component";

// import { ChecklistService } from "./checklist.service";
import { ChecklistService } from "../checklist.service";
import { ProjectApiService } from "src/app/project/services/project-api.service";

@Component({
  selector: "app-checklist-create",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    HeaderComponent,
  ],
  templateUrl: "./checklist-create.component.html",
  styleUrls: ["./checklist-create.component.scss"],
})
export class  ChecklistCreateComponent implements OnInit {
  // ================= PERMISSIONS =================
  get isPermissionChecklistView() {
    return this.projectApiService.isPermissionChecklistView;
  }

  get isPermissionChecklistEdit() {
    return this.projectApiService.isPermissionChecklistEdit;
  }

  // ================= DROPDOWNS =================
  stages: any[] = [];
  categories: any[] = [];

  selectedStageId: number | null = null;
  selectedCategoryId: number | null = null;

  isNewStage = false;
  isNewCategory = false;

  newStage: string = "";
  newCategory: string = "";

  // ================= CHECKLIST =================
  items: any[] = [{ title: "", description: "", files: [] as File[] }];

  isLoading = false;

  constructor(
    private checklistService: ChecklistService,
    public projectApiService: ProjectApiService,
  ) {}

  ngOnInit() {
    this.loadStages();
  }

  // ================= LOAD STAGES =================
  loadStages() {
    this.checklistService.getStages().subscribe({
      next: (res) => {
        this.stages = res;
      },
      error: (err) => console.error(err),
    });
  }

  // ================= STAGE CHANGE =================
  onStageChange(value: any) {
    if (value === "__new__") {
      this.isNewStage = true;
      this.selectedStageId = null;
      this.categories = [];
    } else {
      this.isNewStage = false;
      this.selectedStageId = value;
      this.loadCategories(value);
    }
  }

  // ================= LOAD CATEGORIES =================
  loadCategories(stageId: number) {
    this.checklistService.getCategories(stageId).subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err) => console.error(err),
    });
  }

  // ================= CATEGORY CHANGE =================
  onCategoryChange(value: any) {
    if (value === "__new__") {
      this.isNewCategory = true;
      this.selectedCategoryId = null;
    } else {
      this.isNewCategory = false;
      this.selectedCategoryId = value;
    }
  }

  // ================= CHECKLIST =================
  trackByIndex(index: number) {
    return index;
  }

  addField() {
    this.items.push({
      title: "",
      description: "",
      files: [],
    });
  }

  removeField(index: number) {
    this.items.splice(index, 1);
  }

  // ✅ MULTIPLE FILE SUPPORT



  onFileChange(event: any, index: number, input: HTMLInputElement) {
    const files = Array.from(event.target.files || []) as File[];

    if (files.length) {
      // ✅ Replace instead of append
      this.items[index].files = files;

      // ✅ Reset input to avoid duplicate trigger
      input.value = "";
    }
  }

  // ================= SAVE =================
  save() {
    const formData = new FormData();

    const payload = {
      stageId: this.selectedStageId,
      newStage: this.newStage,
      categoryId: this.selectedCategoryId,
      newCategory: this.newCategory,
      items: this.items.map((i, index) => ({
        title: i.title,
        description: i.description,
        fileKey: "files_" + index, // ✅ mapping key
      })),
    };

    // JSON
    formData.append("data", JSON.stringify(payload));

    // ✅ IMPORTANT FIX HERE (mapping files correctly)
    this.items.forEach((item, index) => {
      item.files?.forEach((file: File) => {
        formData.append("files_" + index, file); // ✅ KEY FIX
      });
    });

    this.checklistService.save(formData).subscribe({
  next: (res) => {
    console.log(res); // "Saved Successfully ✅"
    alert(res);
    this.reset();
  },
  error: (err) => {
    console.error("Save error:", err);
  },
});

  }

  // ================= RESET =================
  reset() {
    this.selectedStageId = null;
    this.selectedCategoryId = null;
    this.newStage = "";
    this.newCategory = "";

    this.items = [{ title: "", description: "", files: [] }];

    this.isNewStage = false;
    this.isNewCategory = false;
  }
}
