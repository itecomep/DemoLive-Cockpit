import { Component, Input, OnInit, OnChanges, SimpleChanges, Inject, Optional } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { CreateFolderDialogComponent } from "../create-folder-dialog/create-folder-dialog.component";
import { DmsService } from "../../services/dms.service";
import { Project } from "../../models/project.model";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMenuModule } from "@angular/material/menu";
import * as JSZip from "jszip";
import { saveAs } from "file-saver";
import { ProjectApiService } from "../../services/project-api.service";
import { RenameFolderDialogComponent } from '.././project-file/rename-folder-dialog/rename-folder-dialog.component';
import { UtilityService } from "src/app/shared/services/utility.service";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { HostListener } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { Contact } from 'src/app/contact/models/contact';
import { firstValueFrom } from 'rxjs';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { UserPermissionFileDialogComponent } from "./user-permission-file-dialog/user-permission-file-dialog.component";

interface FolderNode {
  id?: number;
  name: string;
  children?: FolderNode[];
  files?: FileNode[];
}

interface FileNode {
  id: number;
  fileName: string;
  blobUrl: string;
  classification: string;
  tags?: string[];
  createdBy: string;
  created: string;
  fileSize: number;
  path?: string;
  showAllTags?: boolean;
  safePdfUrl?: SafeResourceUrl | null;
}
type SortField = "name" | "type" | "created" | "size";
type SortDirection = "asc" | "desc";
@Component({
  selector: "app-project-file",
  standalone: true,
  templateUrl: "./project-file.component.html",
  styleUrls: ["./project-file.component.scss"],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatCheckboxModule,
    MatDividerModule
  ],
})
export class ProjectFileComponent implements OnInit, OnChanges {
  @Input() project!: Project;
  @Input() showProjectSelector: boolean = false;
  @Input() projects: any[] = [];
  isSearching: boolean = false;
  rootFolders: FolderNode[] = [];
  currentFolders: FolderNode[] = [];
  currentFiles: FileNode[] = [];
  breadcrumb: FolderNode[] = [];
  filteredFiles: FileNode[] = [];
  searchText: string = "";
  allFilesBackup: FileNode[] = [];
  viewMode: "folder" | "folderGrid" | "document" = "folder";
  fromDate?: Date;
  toDate?: Date;
  isDialog: boolean = false;
  selectedFiles: FileNode[] = [];
  selectedProjectId!: number;
  selectedProject: any;
  projectDmsFiles: any[] = [];
  isProjectLoading: boolean = false;
  showRenameDialog: boolean = false;
  renameFolderName: string = "";
  folderToRename!: FolderNode;
  selectedProjectName: string = "";
  filteredProjects: any[] = [];
  isMasterUser: boolean = false;
  contactOptions: Contact[] = [];
  filteredContactOptions: Contact[] = [];
  selectedContacts: number[] = [];
  contactsSearch: string = '';
  selectedItem: any = null;
  selectedItemType: 'file' | 'folder' = 'file';

  sortOptions = [
    { label: "Name", field: "name" },
    { label: "Type", field: "type" },
    { label: "Date", field: "created" },
    { label: "Size", field: "size" },
  ];

  selectedSortField: SortField = "name";
  sortDirection: SortDirection = "asc";

  get isPermissionFileDmsDelete() { return this.entityApiService.isPermissionFileDmsDelete; }
  get isPermissionFileDmsFolderEdit() { return this.entityApiService.isPermissionFileDmsFolderEdit; }

  constructor(
    @Optional() private dialogRef: MatDialogRef<ProjectFileComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dmsService: DmsService,
    private entityApiService: ProjectApiService,
    private utilityService: UtilityService,
    private sanitizer: DomSanitizer,
    private contactService: ContactApiService
  ) {
    this.isDialog = !!data;
    if (this.isDialog) {
      this.showProjectSelector = true;
    }
  }

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
    this.isMasterUser =
      userData.roles &&
      userData.roles.toString().toUpperCase().includes("MASTER");
    if (this.data?.isOtherMode) {
      this.loadOthersFolder();
      return;
    }
    if (this.project) this.loadFolders();
    this.projects = this.data?.projects || [];
    this.filteredProjects = [...this.projects];

    if (!this.isDialog) {
      this.filteredProjects = [...this.projects];
    } else {
      this.projects = this.data?.projects || [];
      this.filteredProjects = [...this.projects];
    }

    if (this.data?.selectedProjectId) {
      const project = this.projects.find(p => p.id === this.data.selectedProjectId);
      if (project) {
        this.selectProject(project);
      }
    }
    this.loadContacts();
  }

  async loadContacts() {
    let contactFilter = [
      { key: 'usersOnly', value: 'true' },
      { key: 'appointmentStatusFlag', value: '0' }
    ];
    this.contactOptions = await firstValueFrom(this.contactService.get(contactFilter));
    this.filteredContactOptions = [...this.contactOptions];
  }

  filterContacts() {
    const search = this.contactsSearch.toLowerCase();
    this.filteredContactOptions = this.contactOptions.filter(c =>
      c.name?.toLowerCase().includes(search)
    );
  }

  toggleSelection(contact: Contact) {
    const index = this.selectedContacts.indexOf(contact.id);

    if (index > -1) {
      this.selectedContacts.splice(index, 1);
    } else {
      this.selectedContacts.push(contact.id);
    }

    const deniedUsers = this.contactOptions
      .filter(c => !this.selectedContacts.includes(c.id))
      .map(c => c.id.toString());

    if (this.selectedItemType === 'folder') {
      this.dmsService.updateFolderPermission({
        folderId: this.selectedItem.id,
        deniedUsers: deniedUsers
      }).subscribe(() => {
        this.selectedItem.deniedUsers = deniedUsers;
      });
    } else {
      this.dmsService.updateFilePermission({
        fileId: this.selectedItem.id,
        deniedUsers: deniedUsers
      }).subscribe(() => {
        this.selectedItem.deniedUsers = deniedUsers;
      });
    }
  }

  setSelectedItem(item: any, type: 'file' | 'folder') {
    this.selectedItem = item;
    this.selectedItemType = type;

    const denied = item.deniedUsers
      ? item.deniedUsers.map((x: string) => Number(x))
      : [];

    this.selectedContacts = this.contactOptions
      .filter(c => !denied.includes(c.id))
      .map(c => c.id);
  }

  trackById(index: number, item: Contact) {
    return item.id;
  }

  applyContactFilter() {
    const currentUserId = this.getCurrentUserId();
    if (this.selectedContacts.includes(Number(currentUserId))) {
      this.currentFiles = [];
      this.currentFolders = [];
      return;
    }
    this.onViewChange();
  }

  loadOthersFolder() {
    this.breadcrumb = []; 
    this.rootFolders = [
      {
        name: 'Others',
        children: [],
        files: []
      }
    ];
    // const userId = this.getCurrentUserId();

    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const userId = userData?.contact?.id?.toString() || '';
    const isMaster = userData.roles?.includes("MASTER") || false;
    
    this.dmsService.getFolderTree(0, userId, isMaster).subscribe({
      next: (res: any[]) => {
        const files = this.getAllFiles(res);
        this.rootFolders[0].files = files;
        this.allFilesBackup = files;
        this.openFolder(this.rootFolders[0]);
      },
      error: (err) => console.error(err)
    });
  }

  getCurrentUserId(): string {
    const userDataString = localStorage.getItem("currentUser");
    if (!userDataString) return '';
    try {
      const userData = JSON.parse(userDataString);
      return userData?.contact?.id?.toString() || '';
    } catch (e) {
      console.error('Invalid user data in localStorage', e);
      return '';
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.currentFiles.forEach(f => f.showAllTags = false);
  }

  closeAllTagPopups() {
    this.currentFiles.forEach(f => f.showAllTags = false);
  }

  filterProjects() {
    let search = '';
    if (typeof this.selectedProject === 'string') {
      search = this.selectedProject.toLowerCase();
    } else if (this.selectedProject?.name) {
      search = this.selectedProject.name.toLowerCase();
    }
    this.filteredProjects = this.projects.filter(p =>
      p.name.toLowerCase().includes(search)
    );
  }

  toggleTagExpand(file: any) {
    file.showAllTags = !file.showAllTags;
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  isFileSelected(file: FileNode): boolean {
    return this.selectedFiles.some((f) => f.id === file.id);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["project"] && changes["project"].currentValue) {
      this.loadFolders();
    }
  }

  toggleFileSelection(file: FileNode) {
    const index = this.selectedFiles.findIndex((f) => f.id === file.id);

    if (index > -1) {
      this.selectedFiles.splice(index, 1);
    } else {
      this.selectedFiles.push(file);
    }
  }

  attachSelectedFiles() {
    const files = this.selectedFiles.map((f) => ({
      name: f.fileName,
      size: f.fileSize,
      type: "application/octet-stream",
      blobUrl: f.blobUrl,
    }));

    if (this.dialogRef) {
      this.dialogRef.close(files);
    }
  }

  removeSelectedFile(file: any) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }

  onViewChange() {
    this.breadcrumb = [];
    if (this.isSearching) {
      this.currentFiles = this.filteredFiles;
      this.currentFolders = this.viewMode === "folder" ? [] : [];
      return;
    }
    if (this.viewMode === "folder") {
      this.currentFolders = this.rootFolders;
      this.currentFiles = [];
    } 
    else if (this.viewMode === "document") {
      this.currentFolders = [];
      // this.currentFiles = this.allFilesBackup;
      this.currentFiles = this.allFilesBackup?.length ? this.allFilesBackup : this.currentFiles;
    } 
    else if (this.viewMode === "folderGrid") {
      this.currentFolders = this.rootFolders;
      this.currentFiles = [];
    }
  }

  loadFolders() {
    // if (!this.project?.id) return;
    if (!this.project?.id) return;
    // const userId = this.getCurrentUserId();
    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userId = userData?.contact?.id?.toString() || '';
    const isMaster = userData.roles?.includes("MASTER") || false;
    this.dmsService.getFolderTree(this.project.id, userId, isMaster).subscribe({
      next: (res: FolderNode[]) => {
        this.rootFolders = res || [];

        this.allFilesBackup = this.getAllFiles(this.rootFolders);
        this.breadcrumb = [];

        if (this.viewMode === "folder") {
          this.currentFolders = this.rootFolders;
          this.currentFiles = [];
        } 
        else if (this.viewMode === "folderGrid") {
          this.currentFolders = this.rootFolders;
          this.currentFiles = [];
        }
        else if (this.viewMode === "document") {
          this.currentFolders = [];
          this.currentFiles = this.allFilesBackup;
        }

      },
      error: (err) => {
        console.error("Failed to load folders:", err);
      },
    });
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return "--";

    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
  }

  formatDate(date: string): string {
    if (!date) return "--";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  getAllFiles(folders: FolderNode[], currentPath: string = ""): FileNode[] {
    let files: FileNode[] = [];

    for (let f of folders) {
      let folderPath = currentPath ? `${currentPath} / ${f.name}` : f.name;

      if (f.files) {
        const filesWithPaths = f.files.map((file) => {
          let path = folderPath;

          if (
            file.classification &&
            path.startsWith(file.classification + " / ")
          ) {
            path = path.substring(file.classification.length + 3);
            path = `${file.classification} / ${path}`;
          }

          return {
            ...file,
            path: path,
          };
        });

        files.push(...filesWithPaths);
      }

      if (f.children) {
        files.push(...this.getAllFiles(f.children, folderPath));
      }
    }

    return files;
  }

  formatLongPath(path: string): string {
    const parts = path.split(" / ");
    if (parts.length <= 3) return path;

    return `${parts[0]} / ... / ${parts[parts.length - 2]} / ${parts[parts.length - 1]}`;
  }

  filterFiles() {
    if (!this.searchText?.trim()) {
      this.clearSearch();
      return;
    }

    this.isSearching = true;
    const projectId = this.data?.isOtherMode ? 0 : this.project?.id;
    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const isMaster = userData.roles && userData.roles.toString().toUpperCase().includes("MASTER");
    this.dmsService.searchFiles(projectId, this.searchText, undefined, undefined, isMaster)
      .subscribe((res) => {
        const search = this.searchText.toLowerCase();
        const mapped = res.map((f: any) => ({
          ...f,
          tags: f.tags || f.Tags || [],
          path: f.path || f.filePath || '',
          safePdfUrl: this.isPdf(f.fileName)
            ? this.sanitizer.bypassSecurityTrustResourceUrl(f.blobUrl)
            : null
        }));

        this.filteredFiles = mapped.filter(f =>
          f.fileName?.toLowerCase().includes(search) ||
          f.tags?.some((tag: string) => tag.toLowerCase().includes(search))
        );
        this.currentFolders = [];
        this.currentFiles = this.filteredFiles;
      });
  }

  clearSearch() {
    this.searchText = "";
    this.isSearching = false;
    this.filteredFiles = [];
    this.onViewChange();
  }

  openFolder(folder: FolderNode) {
    this.breadcrumb.push(folder);
    this.currentFolders = folder.children || [];
    this.currentFiles = (folder.files || []).map(f => ({
      ...f,
      path: this.getFolderPath(folder),
      safePdfUrl: this.isPdf(f.fileName)
        ? this.sanitizer.bypassSecurityTrustResourceUrl(f.blobUrl)
        : null
    }));
  }

  goBack() {
    this.breadcrumb.pop();
    if (this.breadcrumb.length === 0) {
      this.currentFolders = this.rootFolders;
      this.currentFiles = [];
    } else {
      const parent = this.breadcrumb[this.breadcrumb.length - 1];
      this.currentFolders = parent.children || [];
      this.currentFiles = parent.files || [];
    }
  }

  getBreadcrumbPath(): string {
    return this.breadcrumb.map((b) => b.name).join(" / ");
  }

  openCreateFolderDialog() {
    const dialogRef = this.dialog.open(CreateFolderDialogComponent, {
      width: "1000px",
      disableClose: true,
      data: { currentEntity: this.project, isOtherMode: this.data?.isOtherMode },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.loadFoldersAndSelect(res);
      }
    });
  }

  loadFoldersAndSelect(uploadedFiles: any[]) {
    if (!this.project?.id) return;
    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const userId = userData?.contact?.id?.toString() || '';
    const isMaster = userData.roles?.includes("MASTER") || false;
    this.dmsService.getFolderTree(this.project.id, userId, isMaster).subscribe({
      next: (res: FolderNode[]) => {
        this.rootFolders = res || [];
        this.allFilesBackup = this.getAllFiles(this.rootFolders);
        this.currentFolders = this.rootFolders;
        this.currentFiles = [];
        this.autoSelectAfterUpload(uploadedFiles);
      }
    });
  }

  autoSelectAfterUpload(uploadedFiles: any[]) {
    const allFiles = this.getAllFiles(this.rootFolders);
    uploadedFiles.forEach(uploaded => {
      const match = allFiles.find(f =>
        f.fileName?.toLowerCase().trim() ===
        uploaded.fileName?.toLowerCase().trim()
      );
      if (match && !this.isFileSelected(match)) {
        this.selectedFiles.push(match);
      }
    });
  }

  getDisplayPath(path?: string): string {
    if (!path) return "";
    const projectId = this.project?.id;
    let cleanPath = path;
    if (projectId) {
      const prefix = `projects/${projectId}/`;
      cleanPath = path.startsWith(prefix)
        ? path.substring(prefix.length)
        : path;
    }

    const parts = cleanPath.split('/');
    parts.pop();
    const result: string[] = [];
    parts.forEach(p => {
      if (result[result.length - 1] !== p) {
        result.push(p);
      }
    });
    return result.join(' / ');
  }

  onGridFileClick(file: any, event: MouseEvent) {
    event.stopPropagation();
    if (this.isDialog) {
      this.toggleFileSelection(file);
    }
  }
  
  getFolderSize(folder: FolderNode): string {
    const totalBytes = this.calculateFolderSize(folder);

    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = totalBytes
      ? Math.floor(Math.log(totalBytes) / Math.log(1024))
      : 0;
    return totalBytes
      ? parseFloat((totalBytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i]
      : "--";
  }

  private calculateFolderSize(folder: FolderNode): number {
    let total = 0;

    if (folder.files) {
      total += folder.files.reduce((sum, f) => sum + (f.fileSize || 0), 0);
    }

    if (folder.children) {
      for (const child of folder.children) {
        total += this.calculateFolderSize(child);
      }
    }

    return total;
  }

  getFolderPath(folder: FolderNode): string {
    if (!this.breadcrumb.length) return folder.name;
    return [...this.breadcrumb.map((b) => b.name), folder.name].join(" / ");
  }

  getFolderCreatedDate(folder: FolderNode): string {
    let allFiles: FileNode[] = [];

    const collectFiles = (f: FolderNode) => {
      if (f.files) allFiles.push(...f.files);
      if (f.children) f.children.forEach((c) => collectFiles(c));
    };

    collectFiles(folder);

    if (!allFiles.length) return "--";

    const earliest = allFiles.reduce((prev, curr) =>
      new Date(prev.created) < new Date(curr.created) ? prev : curr,
    );

    return this.formatDate(earliest.created);
  }

 applyFilters() {
    if (!this.searchText?.trim() && !this.fromDate && !this.toDate) {
      return;
    }

    this.isSearching = true;
    const search = this.searchText?.toLowerCase() || '';
    const from = this.fromDate ? new Date(this.fromDate) : null;
    const to = this.toDate ? new Date(this.toDate) : null;
    if (this.data?.isOtherMode) {
      let files = [...this.allFilesBackup];
      if (search) {
        files = files.filter(f =>
          f.fileName?.toLowerCase().includes(search) ||
          f.tags?.some(tag => tag.toLowerCase().includes(search))
        );
      }
      if (from || to) {
        files = files.filter(f => {
          const fileDate = new Date(f.created);
          return (!from || fileDate >= from) && (!to || fileDate <= to);
        });
      }
      this.filteredFiles = files;
      this.currentFiles = files;
      this.currentFolders = [];
      return;
    }
    const projectId = this.project?.id || this.selectedProjectId;
    if (!projectId) return;

    this.dmsService
      .searchFiles(projectId, this.searchText, from?.toISOString(), to?.toISOString())
      .subscribe({
        next: (res) => {
          const mapped = res.map((f: any) => ({
            ...f,
            tags: f.tags || f.Tags || [],
            path: f.path || f.filePath || '',
            safePdfUrl: this.isPdf(f.fileName)
              ? this.sanitizer.bypassSecurityTrustResourceUrl(f.blobUrl)
              : null
          }));
          this.filteredFiles = mapped.filter(f =>
            f.fileName?.toLowerCase().includes(search) ||
            f.tags?.some((tag: string) => tag.toLowerCase().includes(search))
          );
          this.currentFolders = [];
          this.currentFiles = this.filteredFiles;
        },
        error: (err) => {
          console.error(err);
          this.isSearching = false;
        },
      });
  }

  clearFilters() {
    this.searchText = "";
    this.fromDate = undefined;
    this.toDate = undefined;
    this.isSearching = false;
    this.filteredFiles = [];
    this.onViewChange();
  }

  getFolderOwner(folder: FolderNode): string {
    let allFiles: FileNode[] = [];

    const collectFiles = (f: FolderNode) => {
      if (f.files) allFiles.push(...f.files);
      if (f.children) f.children.forEach((child) => collectFiles(child));
    };

    collectFiles(folder);
    if (!allFiles.length) return "-";
    return allFiles[0].createdBy || "-";
  }

  async downloadFile(file: FileNode) {
    try {
      const response = await fetch(file.blobUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download file:", file.fileName, err);
      alert("Failed to download file. Check console for details.");
    }
  }

  private async addFolderToZip(zip: JSZip, folder: FolderNode, folderPath: string = "") {
    const currentPath = folderPath
      ? `${folderPath}/${folder.name}`
      : folder.name;

    if (folder.files) {
      for (const file of folder.files) {
        try {
          const response = await fetch(file.blobUrl);
          const blob = await response.blob();
          zip.file(`${currentPath}/${file.fileName}`, blob);
        } catch (err) {
          console.error("Failed to fetch file:", file.fileName, err);
        }
      }
    }

    if (folder.children) {
      for (const child of folder.children) {
        await this.addFolderToZip(zip, child, currentPath);
      }
    }
  }

  async downloadFolder(folder: FolderNode) {
    const zip = new JSZip();
    await this.addFolderToZip(zip, folder);

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `${folder.name}.zip`);
    });
  }

  editFolderName(folder: FolderNode) {

    const dialogRef = this.dialog.open(RenameFolderDialogComponent, {
      width: '350px',
      disableClose: true,
      data: { name: folder.name }
    });

    dialogRef.afterClosed().subscribe((newName: string) => {

      if (!newName || newName.trim() === folder.name) return;

      if (!folder.id) {
        alert("Folder ID not found");
        return;
      }

      this.dmsService.renameFolder(this.project.id, folder.id, newName.trim())
        .subscribe({
          next: () => {

            const oldPath = this.getFolderPath(folder);
            folder.name = newName.trim();
            const newPath = this.getFolderPath(folder);
            this.updateChildPaths(folder, oldPath, newPath);

            this.utilityService.showSwalToast(
              "Success",
              "Folder renamed successfully",
              "success",
            );
          },
          error: (err) => {
            console.error(err);
            alert("Failed to rename folder");
          }
        });
    });
  }

  isLastFolder(): boolean {
    return this.currentFolders.length === 0 && this.currentFiles.length > 0;
  }

  private updateChildPaths(
    folder: FolderNode,
    oldPath: string,
    newPath: string,
  ) {
    folder.files?.forEach((file) => {
      if (file.path?.startsWith(oldPath)) {
        file.path = file.path.replace(oldPath, newPath);
      }
    });

    folder.children?.forEach((child) => {
      const childOldPath = this.getFolderPath(child);
      const childNewPath = childOldPath.replace(oldPath, newPath);
      this.updateChildPaths(child, childOldPath, childNewPath);
    });
  }

  deleteFile(file: FileNode) {
    if (!confirm(`Are you sure you want to delete "${file.fileName}"?`)) return;
    this.dmsService.deleteFile(file.id).subscribe({
      next: () => {
        this.loadFolders();
        this.utilityService.showSwalToast(
          "Success",
          "File deleted successfully",
          "success"
        );
      },
      error: (err) => {
        console.error(err);
        this.utilityService.showSwalToast(
          "Error",
          "Failed to delete file",
          "error"
        );
      },
    });
  }

  deleteFolder(folder: FolderNode) {
    if (!folder.id) return;
    if (!confirm(`Delete folder "${folder.name}" and all files?`)) return;
    this.dmsService.deleteFolder(folder.id).subscribe({
      next: () => {
        this.loadFolders();
        this.utilityService.showSwalToast(
          "Success",
          "Folder deleted successfully",
          "success"
        );
      },
      error: (err) => {
        console.error(err);
        this.utilityService.showSwalToast(
          "Error",
          "Failed to delete folder",
          "error"
        );
      },
    });
  }

  applySort() {
    const field = this.selectedSortField;
    const direction = this.sortDirection === "asc" ? 1 : -1;

    if (field === "name") {
      this.currentFiles.sort(
        (a, b) => a.fileName.localeCompare(b.fileName) * direction,
      );
      this.currentFolders.sort(
        (a, b) => a.name.localeCompare(b.name) * direction,
      );
    } else if (field === "type") {
      this.currentFiles.sort((a, b) => {
        const extA = a.fileName.split(".").pop() || "";
        const extB = b.fileName.split(".").pop() || "";
        return extA.localeCompare(extB) * direction;
      });
    } else if (field === "created") {
      this.currentFiles.sort(
        (a, b) =>
          (new Date(a.created).getTime() - new Date(b.created).getTime()) *
          direction,
      );
      this.currentFolders.sort((a, b) => {
        const dateA = new Date(this.getFolderCreatedDate(a)).getTime();
        const dateB = new Date(this.getFolderCreatedDate(b)).getTime();
        return (dateA - dateB) * direction;
      });
    } else if (field === "size") {
      this.currentFiles.sort((a, b) => (a.fileSize - b.fileSize) * direction);
      this.currentFolders.sort(
        (a, b) =>
          (this.calculateFolderSize(a) - this.calculateFolderSize(b)) *
          direction,
      );
    }
  }

selectProject(project: any) {
    this.selectedProject = project;

    if (project.id === 0 || project.isOtherMode) {
      // this.project = null;
      this.data = { ...this.data, isOtherMode: true };
      this.loadOthersFolder();
      return;
    }

    this.data = { ...this.data, isOtherMode: false };
    this.selectedProjectId = project.id;
    this.project = project;
    this.isProjectLoading = true;
    // const userId = this.getCurrentUserId();
    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userId = userData?.contact?.id?.toString() || '';
    const isMaster = userData.roles?.includes("MASTER") || false;

    this.dmsService.getFolderTree(project.id, userId, isMaster).subscribe({
      next: (res) => {
        this.rootFolders = res || [];
        this.allFilesBackup = this.getAllFiles(this.rootFolders);
        this.breadcrumb = [];
        this.onViewChange();
        this.isProjectLoading = false;
      },
      error: () => (this.isProjectLoading = false),
    });
  }


  displayProject(project: any): string {
    return project ? project.name : '';
  }

  showAllProjects() {
    this.filteredProjects = [...this.projects];
  }

  hasTagsColumn(): boolean {
    return this.currentFiles?.some(f => f.tags && f.tags.length > 0);
  }

  isImage(fileName: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  }

  isPdf(fileName: string): boolean {
    return /\.pdf$/i.test(fileName);
  }

  isExcel(fileName: string): boolean {
    return /\.(xls|xlsx|csv)$/i.test(fileName);
  }

  isWord(fileName: string): boolean {
    return /\.(doc|docx)$/i.test(fileName);
  }

  isPpt(fileName: string): boolean {
    return /\.(ppt|pptx)$/i.test(fileName);
  }

 onSearchChange(value: string) {
    this.searchText = value;
    if (!value?.trim()) {
      this.clearFilters();
      return;
    }
    this.applyFilters();
  }

  openUserDialog(item: any, type: 'file' | 'folder') {
    this.setSelectedItem(item, type);

    const dialogRef = this.dialog.open(UserPermissionFileDialogComponent, {
      width: '100%',
      maxWidth: '90vw',
      height: '100%',         // 🔥 bigger height
      maxHeight: '90vh',       // 🔥 responsive height
      panelClass: 'user-dialog',
      data: {
        contactOptions: this.contactOptions,
        selectedContacts: [...this.selectedContacts],
        item: item,
        type: type
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.selectedContacts = result;
      const deniedUsers = this.contactOptions
        .filter(c => !this.selectedContacts.includes(c.id))
        .map(c => c.id.toString());

      if (type === 'folder') {
        this.dmsService.updateFolderPermission({
          folderId: item.id,
          deniedUsers
        }).subscribe(() => {
          this.loadFolders();
        });
      } else {
        this.dmsService.updateFilePermission({
          fileId: item.id,
          deniedUsers
        }).subscribe(() => {
          this.loadFolders();
        });
      }
    });
  }
}
