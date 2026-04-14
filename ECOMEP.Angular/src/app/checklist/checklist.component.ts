  import { Component, OnInit } from "@angular/core";
  import { CommonModule } from "@angular/common";
  import { FormsModule } from "@angular/forms";
  import { MatIconModule } from "@angular/material/icon";
  import { MatButtonModule } from "@angular/material/button";

  import { HeaderComponent } from "../mcv-header/components/header/header.component";
  import { ChecklistService } from "./checklist.service";
  import { RouterModule } from "@angular/router";
  import { ProjectApiService } from "src/app/project/services/project-api.service";
  import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

  interface FileItem {
    name: string;
    url: string;
    uploadedAt?: Date;
  }

  @Component({
    selector: "app-checklist",
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      MatIconModule,
      MatButtonModule,
      HeaderComponent,
      RouterModule
    ],
    templateUrl: "./checklist.component.html",
    styleUrls: ["./checklist.component.scss"],
  })
  export class ChecklistComponent implements OnInit {

    treeData: any[] = [];

    expandedStage: string | null = null;
    expandedCategory: string | null = null;

    selectedItem: any = null;
    searchText: string = '';

    editingStage: any = null;
    editingCategory: any = null;

    isEditingTitle = false;
    isEditingDescription = false;

    previewImage: any = null;

    deleteMode: { [key: string]: any } = {};
    selectedFiles: { [key: string]: any[] } = {};


    permissions = {
    canView: false,
    canEdit: false
  };

    

    // constructor(private checklistService: ChecklistService) {}
    constructor(
    private checklistService: ChecklistService,
    public projectApi: ProjectApiService ,  // 👈 ADD THIS
    private sanitizer: DomSanitizer  
    ) {}

    ngOnInit() {

    // Wait for auth to be ready (IMPORTANT)
    setTimeout(() => {
      this.permissions.canView = this.projectApi.isPermissionChecklistView;
      this.permissions.canEdit = this.projectApi.isPermissionChecklistEdit;

      console.log('Permissions:', this.permissions);
    }, 100); // small delay to allow roles load

    this.loadTree();
  }


    // ================= LOAD =================
    loadTree() {
      this.checklistService.getTreeUI().subscribe({
        next: (res: any[]) => {
          this.treeData = res;

          this.expandedStage = localStorage.getItem('expandedStage');
          this.expandedCategory = localStorage.getItem('expandedCategory');
        },
        error: () => (this.treeData = [])
      });
    }

    // ================= SELECT =================
    selectItem(item: any) {
      this.selectedItem = item;
      this.previewImage = null;
    }

    // ================= SEARCH =================
    get filteredTreeData(): any[] {
      if (!this.searchText) return this.treeData;

      const search = this.searchText.toLowerCase();

      return this.treeData
        .map(stage => ({
          ...stage,
          categories: stage.categories
            .map((cat: any) => ({
              ...cat,
              checklists: cat.checklists.filter((i: any) =>
                i.title.toLowerCase().includes(search) ||
                (i.description || '').toLowerCase().includes(search)
              )
            }))
            .filter((c: any) => c.checklists.length > 0)
        }))
        .filter(s => s.categories.length > 0);
    }

    // ================= STAGE =================
    startEditStage(stage: any) {
      this.editingStage = stage;
    }

    saveStage(stage: any) {
      this.checklistService.updateStage(stage.stageId, stage.stageName)
        .subscribe(() => this.editingStage = null);
    }

    deleteStage(stage: any) {
      if (!confirm('Delete stage?')) return;

      this.checklistService.deleteStage(stage.stageId)
        .subscribe(() => this.loadTree());
    }

    // ================= CATEGORY =================
    startEditCategory(cat: any) {
      this.editingCategory = cat;
    }

    saveCategory(cat: any) {
      this.checklistService.updateCategory(cat.categoryId, cat.categoryName)
        .subscribe(() => this.editingCategory = null);
    }

    deleteCategory(cat: any) {
      if (!confirm('Delete category?')) return;

      this.checklistService.deleteCategory(cat.categoryId)
        .subscribe(() => this.loadTree());
    }

    // ================= CHECKLIST =================
    toggleEditMode() {
      this.isEditingTitle = !this.isEditingTitle;
      this.isEditingDescription = !this.isEditingDescription;

      if (!this.isEditingTitle && this.selectedItem) {
        this.updateChecklist();
      }
    }

    updateChecklist() {
    if (!this.selectedItem) return;

    const fd = new FormData();
    fd.append('title', this.selectedItem.title);
    fd.append('description', this.selectedItem.description || '');

    const currentId = this.selectedItem.id; // ✅ store id before reload

    this.checklistService.updateChecklist(currentId, fd)
      .subscribe(() => {

        // ✅ reload tree
        this.loadTree();

        // ✅ reselect same item after reload (fix last modified issue)
        setTimeout(() => {
          this.reselectItem(currentId);
        }, 200);

      });
  }


  reselectItem(id: number) {
    for (let stage of this.treeData) {
      for (let cat of stage.categories) {
        const found = cat.checklists.find((i: any) => i.id === id);
        if (found) {
          this.selectItem(found); // 🔥 IMPORTANT
          return;
        }
      }
    }
  }

    deleteSelectedItem() {
      if (!this.selectedItem) return;
      if (!confirm('Delete checklist?')) return;

      this.checklistService.deleteChecklist(this.selectedItem.id)
        .subscribe(() => {
          this.selectedItem = null;
          this.loadTree();
        });
    }

    // ================= FILE =================
    isImage(file: any): boolean {
      const ext = file?.name?.split('.').pop()?.toLowerCase();
      return ['png','jpg','jpeg','gif','webp'].includes(ext);
    }

    openFile(file: any) {
      if (!file?.url) return;
      window.open(file.url, "_blank");
    }

    handleFileClick(file: any) {
      if (this.isImage(file)) this.previewImage = file;
      else this.openFile(file);
    }

    onFileClick(groupKey: string, file: any) {
      if (this.deleteMode[groupKey]?.active) {
        const list = this.selectedFiles[groupKey] || [];
        const index = list.indexOf(file);

        if (index >= 0) list.splice(index, 1);
        else list.push(file);

        this.selectedFiles[groupKey] = [...list];
        return;
      }

      this.handleFileClick(file);
    }

    closePreview() {
      this.previewImage = null;
    }

    // ================= ICON HELPERS =================
  getGroupIcon(type: string): string {
      switch (type?.toLowerCase()) {

        // 🖼 Images
        case 'image':
          return 'image';

        // 📄 PDF
        case 'pdf':
          return 'picture_as_pdf';

        // 📝 Office files (Word, Excel, PPT)
        case 'office':
        case 'word':
        case 'excel':
        case 'ppt':
        case 'pptx':
          return 'description';

        // 🏗 BIM / Revit 
        case 'revit':
        case 'rvt':
          return 'apartment';


        case 'ifc':
          return 'view_in_ar';

        // 📐 AutoCAD / DWG / DXF
        case 'autocad':
        case 'cad':
        case 'dwg':
        case 'dxf':
          return 'architecture';



        // 📁 Default folder
        default:
          return 'folder';
      }
    }

    getFileIcon(file: any): string {
      const ext = file?.name?.split('.').pop()?.toLowerCase();

      switch (ext) {
        case 'pdf': return 'picture_as_pdf';
        case 'doc':
        case 'docx': return 'description';
        case 'xls':
        case 'xlsx': return 'table_chart';
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'webp': return 'image';
        case 'dwg':
        case 'dxf': return 'architecture';
        default: return 'insert_drive_file';
      }
    }

    // ================= GROUP =================

    get groupedFiles(): { [key: string]: any[] } {
      if (!this.selectedItem?.files) return {};

      const sortedFiles = [...this.selectedItem.files].sort((a: any, b: any) => {
        return new Date(b.uploadedAt || 0).getTime() -
          new Date(a.uploadedAt || 0).getTime();
      });

      return sortedFiles.reduce((groups: any, file: any) => {

        const ext = file.name?.split('.').pop()?.trim().toLowerCase();


        let type = 'Others';

        // 🟦 OFFICE FILES
        if (['xls', 'xlsx', 'doc', 'docx'].includes(ext)) {
          type = 'Others';
        }

        else if (ext === 'ifc') {
          type = 'IFC';
        }
        else if (ext === 'rvt') {
          type = 'Revit';
        }


        // 🟥 PDF
        else if (ext === 'pdf') {
          type = 'PDF';
        }

        // 🟩 IMAGES
        else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
          type = 'Image';
        }

        // 🟨 AUTOCAD
        else if (['dwg', 'dxf'].includes(ext)) {
          type = 'Autocad';
        }

        if (!groups[type]) groups[type] = [];
        groups[type].push(file);

        return groups;
      }, {});
    }




    // ================= ADD FILE =================
    onAddFiles(event: any) {
    if (!this.selectedItem) return;

    const files = Array.from(event.target.files || []);

    // ✅ 1. ADD FILES TO UI INSTANTLY
    const newFiles = files.map((file: any) => ({
      name: file.name,
      url: URL.createObjectURL(file), // preview instantly
      uploadedAt: new Date()
    }));

    this.selectedItem.files = [
      ...newFiles,
      ...(this.selectedItem.files || [])
    ];

    // ✅ 2. SEND TO BACKEND
    const fd = new FormData();
    fd.append('title', this.selectedItem.title);
    fd.append('description', this.selectedItem.description || '');

    files.forEach((file: any) => {
      fd.append('files', file);
    });

    this.checklistService.updateChecklist(this.selectedItem.id, fd)
      .subscribe({
        next: () => {
          // ✅ optional: reload silently to replace blob URLs with real URLs
          this.loadTree();
        },
        error: err => {
          console.error('Upload failed', err);

          // ❗ rollback if needed
          this.loadTree();
        }
      });
  }

    // ================= DELETE FILE =================
    toggleDeleteMode(groupKey: string) {
      if (!this.deleteMode[groupKey]) {
        this.deleteMode[groupKey] = { active: true };
        this.selectedFiles[groupKey] = [];
      } else {
        this.deleteMode[groupKey].active = !this.deleteMode[groupKey].active;

        if (!this.deleteMode[groupKey].active) {
          this.selectedFiles[groupKey] = [];
        }
      }
    }

    isSelected(groupKey: string, file: any): boolean {
      return (this.selectedFiles[groupKey] || []).includes(file);
    }

  confirmDelete(groupKey: string) {
    if (!this.selectedFiles[groupKey]?.length) return;

    const fileNames = this.selectedFiles[groupKey].map((f: any) => f.name);

    // ✅ 1. UPDATE UI IMMEDIATELY (NO REFRESH)
    this.selectedItem.files = this.selectedItem.files
      .filter((f: any) => !fileNames.includes(f.name));

    // ✅ 2. CALL API
    this.checklistService
      .deleteMultipleFiles(this.selectedItem.id, fileNames)
      .subscribe({
        next: () => {
          this.selectedFiles[groupKey] = [];
          this.deleteMode[groupKey].active = false;
        },
        error: (err: any) => {

          console.error('Delete failed', err);

          // ❗ OPTIONAL: rollback if API fails
          this.loadTree();
        }
      });
  }

    // ================= TOGGLE =================
    toggleStage(stage: any) {
      this.expandedStage =
        this.expandedStage === stage.stageName ? null : stage.stageName;

      localStorage.setItem('expandedStage', this.expandedStage || '');
    }

    toggleCategory(category: any) {
      this.expandedCategory =
        this.expandedCategory === category.categoryName ? null : category.categoryName;

      localStorage.setItem('expandedCategory', this.expandedCategory || '');
    }

    // ================= IMAGE NAV =================
    get imageFiles(): FileItem[] {
      return (this.selectedItem?.files || []).filter((f: FileItem) =>
        this.isImage(f)
      );
    }

    nextImage(event: Event) {
      event.stopPropagation();
      const list = this.imageFiles;
      const index = list.indexOf(this.previewImage);

      if (index < list.length - 1) {
        this.previewImage = list[index + 1];
      }
    }

    prevImage(event: Event) {
      event.stopPropagation();
      const list = this.imageFiles;
      const index = list.indexOf(this.previewImage);

      if (index > 0) {
        this.previewImage = list[index - 1];
      }
    }

   highlight(text: string): string {
  if (!this.searchText) return text;

  const regex = new RegExp(`(${this.escapeRegExp(this.searchText)})`, 'gi');

  return text.replace(regex, `<mark class="highlight">$1</mark>`);
}

escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


    hasNextImage(): boolean {
      const list = this.imageFiles;
      const index = list.findIndex(f => f.url === this.previewImage?.url);
      return index !== -1 && index < list.length - 1;
    }

    hasPrevImage(): boolean {
      const list = this.imageFiles;
      const index = list.findIndex(f => f.url === this.previewImage?.url);
      return index > 0;
    }

    getGroupIconColor(type: string): string {
    switch (type) {
      case 'Image': return '#8e24aa';      // purple
      case 'PDF': return '#e53935';        // red
      case 'Autocad': return '#c62828';    // orange
      case 'Document': return '#1e88e5';   // blue
      case 'Excel': return '#43a047';
      case 'IFC': return '#00acc1';
      case 'Revit': return '#2878e08a';      // green
      default: return '#f8b600f6';           // grey
    }
  }

    getFileIconColor(file: any): string {
    const ext = file?.name?.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'pdf': return '#e53935';
      case 'doc':
      case 'docx': return '#1e88e5';
      case 'xls':
      case 'xlsx': return '#43a047';
      case 'png':
      case 'jpg':
      case 'jpeg': return '#8e24aa';
      case 'dwg': return '#c62828';
      case 'ifc': return '#00acc1';
      case 'rvt': return '#546e7a';
      default: return '#64748b';
    }
  }

  getCleanFileName(name: string): string {
    if (!name) return '';

    const parts = name.split('_');
    return parts.length > 1 ? parts.slice(1).join('_') : name;
  }

  getDateFromFileName(name: string): string {
    if (!name) return '';

    const prefix = name.split('_')[0];

    if (!prefix || prefix.length < 8) return '';

    const year = prefix.substring(0, 4);
    const month = prefix.substring(4, 6);
    const day = prefix.substring(6, 8);

    const date = new Date(`${year}-${month}-${day}`);

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  }