import { Component, ElementRef, Inject, Input, QueryList, ViewChildren } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTreeModule } from "@angular/material/tree";
import { DmsService } from "../../services/dms.service";
import { Project } from "../../models/project.model";
import { UtilityService } from "src/app/shared/services/utility.service";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { ProjectApiService } from "../../services/project-api.service";
import { SubfolderMasterDialogComponent } from "./subfolder-master-dialog/subfolder-master-dialog.component";
import { HttpClient } from '@angular/common/http';

import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { Contact } from 'src/app/contact/models/contact';
import { firstValueFrom } from 'rxjs';
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";

interface FolderNode {
  id?: number;
  name: string;
  children?: FolderNode[];
  files?: FileNode[];
  isNew?: boolean;
  parent?: FolderNode;
  expanded?: boolean;
  level: number;
}

interface FileNode {
  id: number;
  filename: string;
  blobUrl: string;
  classification: string;
  isImage?: boolean;
  level?: number;
}

export interface ProjectUploadFileDto {
  File: File;
  FolderPath: string;
  Classification: string;
  ProjectId: number;
  classification?: string;
}

@Component({
  selector: "app-create-folder-dialog",
  standalone: true,
  templateUrl: "./create-folder-dialog.component.html",
  styleUrls: ["./create-folder-dialog.component.scss"],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDividerModule,
  ],
})
export class CreateFolderDialogComponent {
  @Input() currentEntity!: Project;
  folderName: string = "";
  folderType: any = "";
  selectedFile: File | null = null;
  folderTree: FolderNode[] = [];
  selectedNode: FolderNode | null = null;
  classifications: any[] = [];
  tag: string = "";
  @ViewChildren("newFolderInput") newFolderInputs!: QueryList<ElementRef>;
  selectedFiles: File[] = [];
  filePreviews = new Map<File, string>();
  isDragging = false;
  tags: string[] = [];
  tagInput: string = "";
  fullFolderTree: FolderNode[] = [];
  parentFolders: FolderNode[] = [];
  selectedParentFolderName: string | null = null;

  subFolderOptions: string[] = [];
  showSubFolderDropdown = false;
  showCustomFolderInput = false;
  selectedSubFolderOption = '';
  currentNewNode: FolderNode | null = null;
  subClassification: any = '';
  subSubClassification: any = '';
  subClassifications: any[] = [];
  subSubClassifications: any[] = [];
  selectedClassificationId: number | null = null;
  selectedSubClassificationId: number | null = null;

  filteredClassifications: any[] = [];
  filteredSubClassifications: any[] = [];
  filteredSubSubClassifications: any[] = [];
  isOtherMode: boolean = false;
  uploadingFiles: any[] = [];
  isMasterUser: boolean = false;

  deniedUsers: string[] = [];
  users: any[] = [];

  contactOptions: Contact[] = [];
  filteredContactOptions: Contact[] = [];
  selectedContacts: number[] = [];
  contactsSearch: string = '';

  get isPermissionFolderAdd() { return this.entityApiService.isPermissionFolderAdd; }
  get isPermissionSubFolderAdd(): boolean { return this.entityApiService.isPermissionSubFolderAdd; }

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { currentEntity: Project; isOtherMode: boolean },
    private dialogRef: MatDialogRef<CreateFolderDialogComponent>,
    private dmsService: DmsService,
    private utilityService: UtilityService,
    private entityApiService: ProjectApiService,
    private dialog: MatDialog,
    private http: HttpClient,
    private contactService: ContactApiService
  ) {
    this.currentEntity = data?.currentEntity || null;
    this.isOtherMode = data?.isOtherMode;
  }

  ngOnInit() {
    this.loadFolderTree();
    this.loadClassifications();
    this.loadSubFolders();

    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
    this.isMasterUser = userData.roles?.includes("MASTER") || false;

     if (this.isOtherMode) {
      this.setDefaultOthersFolder();
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
    this.filteredContactOptions.length = 0;
    this.contactOptions.forEach(c => {
      if (c.name?.toLowerCase().includes(search)) {
        this.filteredContactOptions.push(c);
      }
    });
  }

  trackById(index: number, item: Contact) {
    return item.id;
  }

  toggleSelection(contact: Contact) {
    const index = this.selectedContacts.indexOf(contact.id);

    if (index > -1) {
      this.selectedContacts.splice(index, 1);
    } else {
      this.selectedContacts.push(contact.id);
    }
  }

  isAllSelected(): boolean {
    return this.selectedContacts.length === this.contactOptions.length;
  }

  toggleSelectAll() {
    if (this.isAllSelected()) {
      this.selectedContacts = [];
    } else {
      this.selectedContacts = this.contactOptions.map(c => c.id);
    }
  }

  setDefaultOthersFolder() {
    const othersFolder: FolderNode = {
      id: 0,
      name: 'Others',
      children: [],
      files: [],
      level: 0,
      expanded: true
    };

    this.folderTree = [othersFolder];
    this.selectedNode = othersFolder;
  }

  loadSubFolders() {
    this.dmsService.getSubFolders().subscribe({
      next: (res: any[]) => {
        this.subFolderOptions = res.map(x => x.folderName);
      },
      error: (err) => console.error('Failed to load subfolders', err)
    });
  }

  loadClassifications() {
    this.dmsService.getClassifications().subscribe((res) => {
      this.classifications = res;
      this.filteredClassifications = res;
    });
  }

  loadFolderTree() {
    const userId = this.getCurrentUserId();
    const projectId = this.isOtherMode ? 0 : this.currentEntity?.id;
    if (projectId === undefined || projectId === null) return;
    this.dmsService.getFolderTree(projectId, userId, this.isMasterUser).subscribe({
      next: (tree) => {
        this.fullFolderTree = this.initializeFolderTree(tree);
        this.folderTree = [...this.fullFolderTree];
        this.parentFolders = [...this.fullFolderTree];
      },
      error: (err) => console.error("Failed to load folder tree:", err),
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

  onParentFolderChange(folderName: string) {
    if (!folderName) return;
    const selected = this.fullFolderTree.find(
      f => f.name.toLowerCase() === folderName.toLowerCase()
    );

    if (selected) {
      this.folderTree = [selected];
      selected.expanded = true;
    }
  }

  selectFolder(node: FolderNode) {
    if (this.currentNewNode && this.currentNewNode.isNew && this.currentNewNode !== node) {
      this.finalizeFolderName(this.currentNewNode);
      this.currentNewNode = null;
      this.showSubFolderDropdown = false;
      this.showCustomFolderInput = false;
    }
    this.selectedNode = node;
    if (node.isNew) {
      this.currentNewNode = node;
    }
  }

  addTag(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    const input = this.tagInput.trim();
    if (!input) return;

    const newTags = input
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length);
    newTags.forEach((tag) => {
      if (!this.tags.includes(tag)) this.tags.push(tag);
    });

    this.tagInput = "";
    keyboardEvent.preventDefault();
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter((t) => t !== tag);
  }

  onFilesSelected(event: any) {
    if (!this.isOtherMode && (!this.currentEntity || !this.currentEntity.id)) {
      this.utilityService.showSwalToast(
        "Project Required",
        "Please select project first before uploading",
        "warning"
      );
      event.target.value = "";
      return;
    }

    if (!this.selectedNode || !this.selectedNode.name) {
      this.utilityService.showSwalToast(
        "Classification Required",
        "Please select a Classification before uploading files.",
        "warning"
      );
      event.target.value = "";
      return;
    }
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;
    this.appendFiles(files);
    event.target.value = "";
  }

  removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter((f) => f !== file);
    const url = this.filePreviews.get(file);
    if (url) {
      URL.revokeObjectURL(url);
      this.filePreviews.delete(file);
    }
  }

  clearFilePreviews() {
    this.filePreviews.forEach((url) => URL.revokeObjectURL(url));
    this.filePreviews.clear();
  }

  addFolder(node: FolderNode | null) {
    if (this.currentNewNode && this.currentNewNode.isNew) {
      this.finalizeFolderName(this.currentNewNode);
    }

    const siblings = node ? (node.children = node.children || []) : this.folderTree;
    const newFolder: FolderNode = {
      name: "",
      parent: node || undefined,
      isNew: true,
      expanded: true,
      children: [],
      files: [],
      level: node ? (node.level || 0) + 1 : 0
    };
    siblings.push(newFolder);
    if (node) {
      node.expanded = true;
    }

    this.selectedSubFolderOption = '';
    this.currentNewNode = newFolder;
    this.selectedNode = newFolder;
    this.showSubFolderDropdown = node?.level === 2;
    this.showCustomFolderInput = node?.level !== 2;
  }

  onSubFolderClosed(node: FolderNode) {
    if (!node.name || node.name.trim() === "") {
      this.selectedSubFolderOption = '';
      this.finalizeFolderName(node);
    }
  }

  onSubFolderSelect(value: string, node: FolderNode) {
    if (value === 'others') {
      this.showSubFolderDropdown = false;
      this.showCustomFolderInput = true;
      this.currentNewNode = node;
      node.name = '';
      return;
    }
    node.name = value;

    const siblings = node.parent ? node.parent.children!.filter(f => f !== node) : this.folderTree.filter(f => f !== node);
    let baseName = node.name.trim();
    let name = baseName;
    let counter = 1;
    const existingNames = siblings.map(f => f.name?.trim());

    while (existingNames.includes(name)) {
      name = `${baseName} (${counter})`;
      counter++;
    }
    node.name = name;
    setTimeout(() => {
      node.isNew = false;
    });

    this.showSubFolderDropdown = false;
    this.selectedNode = node;
  }

  removeFolder(node: FolderNode) {
    if (this.currentNewNode === node) {
      this.currentNewNode = null;
      this.showSubFolderDropdown = false;
      this.showCustomFolderInput = false;
      this.selectedSubFolderOption = '';
    }
    if (this.selectedNode === node) {
      this.selectedNode = null;
    }
    if (!node.parent) {
      this.folderTree = this.folderTree.filter((f) => f !== node);
    } else {
      node.parent.children = node.parent.children?.filter((f) => f !== node);
    }
  }

  finalizeFolderName(node: FolderNode): Promise<any> {
    return new Promise((resolve, reject) => {
      const siblings = node.parent ? node.parent.children!.filter((f) => f !== node) : this.folderTree.filter((f) => f !== node);
      let baseName = node.name?.trim() || "New Folder";
      let name = baseName;
      let counter = 1;
      const existingNames = siblings.map((f) => f.name?.trim() || "");
      while (existingNames.includes(name)) {
        name = `${baseName} (${counter})`;
        counter++;
      }

      node.name = name;
      node.isNew = false;
      node.expanded = true;
      this.selectedNode = node;
      if (this.currentNewNode === node) {
        this.currentNewNode = null;
        this.showSubFolderDropdown = false;
        this.showCustomFolderInput = false;
      }
      resolve(node);
    });
  }

  saveFolderToServer(node: FolderNode): Promise<any> {
    const userDataString = localStorage.getItem("currentUser");
    let userId: string | null = null;
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        userId = userData.contact?.id?.toString() || null;
      } catch (err) {
        console.error("Failed to parse user data from localStorage", err);
      }
    }

    return new Promise((resolve, reject) => {
      const payload = {
        projectId: this.isOtherMode ? 0 : this.currentEntity?.id,
        folderName: node.name,
        classification: typeof this.folderType === 'object'
        ? (this.folderType as any).name
        : this.folderType || "",
        parentFolderId: node.parent?.id || null,
        createdBy: userId,
      };

      this.dmsService.createFolder(payload).subscribe({
        next: (res: any) => {
          node.id = res.id;
          this.utilityService.showSwalToast(
            "Success",
            "Folder created successfully",
            "success"
          );
          resolve(res);
        },
        error: (err) => {
          console.error("Error creating folder:", err);
          this.utilityService.showSwalToast(
            "Error",
            "Folder creation failed",
            "error"
          );
          reject(err);
        },
      });
    });
  }

  buildFolderPath(node: FolderNode): string {
    const parts: string[] = [];
    let current: FolderNode | undefined | null = node;

    while (current) {
      if (current.name?.trim()) {
        parts.unshift(current.name.trim());
      }
      current = current.parent;
    }
    return parts.join("/");
  }

  findFolderByName(nodes: FolderNode[], name: string): FolderNode | null {
    for (const node of nodes) {
      if (node.name?.trim().toLowerCase() === name.toLowerCase()) {
        return node;
      }
      if (node.children) {
        const found = this.findFolderByName(node.children, name);
        if (found) return found;
      }
    }
    return null;
  }

  async onCreate() {
    if (!this.isOtherMode && (!this.folderType || (typeof this.folderType === 'string' && this.folderType.trim() === ''))) {
      this.utilityService.showSwalToast(
        "Classification Required",
        "Please select classification first",
        "warning"
      );
      return;
    }

    if (!this.selectedNode || !this.selectedNode.name) {
      this.utilityService.showSwalToast(
        "Subfolder Required",
        "Please select or create a subfolder before uploading.",
        "warning"
      );
      return;
    }

    if (!this.selectedFiles.length) {
      alert("Select at least one file");
      return;
    }

    if (!this.tags || this.tags.length === 0) {
      this.utilityService.showSwalToast(
        "Tags Required",
        "Please provide at least one tag before uploading.",
        "warning"
      );
      return;
    }

    if (this.selectedNode && !this.selectedNode.id) {
      await this.ensureFolderHierarchy(this.selectedNode);
    }

    const classification = typeof this.folderType === 'object'
    ? this.folderType.name
    : (this.folderType || '').trim();
    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userId = userData.contact?.id;
    const fullName = userData.contact?.fullName || (userData.contact?.firstName + ' ' + userData.contact?.lastName);
    const today = new Date().toLocaleDateString("en-IN", {day: "2-digit", month: "short", year: "numeric"});

    const uploadedFiles: any[] = [];
    this.selectedNode!.files = this.selectedNode!.files || [];
    const tempFiles: any[] = [];

    for (const file of this.selectedFiles) {
      const temp = {
        id: Math.random(),
        filename: file.name,
        blobUrl: "",
        classification: classification,
        isImage: /\.(jpg|jpeg|png|gif)$/i.test(file.name),
        isUploading: true,
        isSuccess: false,
        isError: false,
        progress: 0
      };

      tempFiles.push({ file, ui: temp });
      this.selectedNode!.files!.push(temp);
      this.uploadingFiles.push(temp);
    }

    for (const item of tempFiles) {
      const file = item.file;
      const uiFile = item.ui;

      try {
        const folderPath = this.buildFolderPath(this.selectedNode!);
        const classification = typeof this.folderType === 'object' ? this.folderType.name : this.folderType;
        // const blobPath = `projects/${this.currentEntity.id}/${classification}/${folderPath}/${file.name}`;
        const basePath = this.isOtherMode ? 'others' : `projects/${this.currentEntity.id}`;
        const blobPath = `${basePath}/${classification}/${folderPath}/${file.name}`;
        const sasRes: any = await this.dmsService
          .generateUploadUrl(blobPath)
          .toPromise();
        const uploadUrl = sasRes.uploadUrl;
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadUrl, true);
          xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              uiFile.progress = Math.round((event.loaded / event.total) * 100);
            }
          };

          xhr.onload = () => {
            if (xhr.status === 201 || xhr.status === 200) {
              resolve();
            } else {
              reject(xhr.response);
            }
          };

          xhr.onerror = () => reject("Upload failed");
          xhr.send(file);
        });

        const cleanUrl = uploadUrl.split("?")[0];
        uiFile.blobUrl = cleanUrl;
        uiFile.isUploading = false;
        uiFile.isSuccess = true;
        uiFile.progress = 100;
        uploadedFiles.push({
          fileName: file.name,
          blobUrl: cleanUrl,
          fileSize: file.size
        });

        setTimeout(() => {
          this.uploadingFiles = this.uploadingFiles.filter(f => f !== uiFile);
        }, 1500);
      } catch (err) {
        console.error(err);
        uiFile.isUploading = false;
        uiFile.isError = true;
        setTimeout(() => {
          this.uploadingFiles = this.uploadingFiles.filter(f => f !== uiFile);
        }, 1500);
      }
    }

    const finalTags = [
      ...this.tags,
      today,
      fullName
    ];

    this.dmsService.uploadMetadata({
      projectId: this.isOtherMode ? 0 : this.currentEntity.id,
      folderId: this.selectedNode?.id,
      classification: classification,
      createdBy: userId?.toString(),
      tags: finalTags,
      files: uploadedFiles,
      deniedUsers: this.selectedContacts.map(x => x.toString())
    }).subscribe({
      next: (res: any[]) => {

        res.forEach((file, index) => {
          const uiFile = this.selectedNode!.files![index];
          uiFile.id = file.Id;
        });
        this.clearFilePreviews();
        this.selectedFiles = [];
        this.loadFolderTree();
        this.utilityService.showSwalToast(
          "Success",
          "Files uploaded successfully",
          "success"
        );

        if (this.dialogRef) {
          this.dialogRef.close(uploadedFiles);
        } else {
          this.loadFolderTree();
        }

      },
      error: (err) => {
        console.error("Upload failed", err);
        alert("Upload failed");
      }
    });
  }

  async createClassificationHierarchy() {
    if (!this.folderType) return;
    const classificationName = this.displayName(this.folderType);
    const subName = this.displayName(this.subClassification);
    const subSubName = this.displayName(this.subSubClassification);
    let classificationNode = this.findFolderByName(this.fullFolderTree, classificationName);

    if (!classificationNode) {
      classificationNode = {
        name: classificationName,
        level: 0,
        children: [],
        files: [],
        expanded: true
      };
      this.fullFolderTree.push(classificationNode);
    }
    let currentParent = classificationNode;
    if (subName) {
      currentParent.children = currentParent.children || [];
      let subNode = currentParent.children.find(
        c => c.name?.toLowerCase() === subName.toLowerCase()
      );
      if (!subNode) {
        subNode = {
          name: subName,
          parent: currentParent,
          level: 1,
          children: [],
          files: [],
          expanded: true
        };
        currentParent.children.push(subNode);
      }
      currentParent = subNode;
    }

    if (subSubName) {
      currentParent.children = currentParent.children || [];

      let subSubNode = currentParent.children.find(
        c => c.name?.toLowerCase() === subSubName.toLowerCase()
      );

      if (!subSubNode) {
        subSubNode = {
          name: subSubName,
          parent: currentParent,
          level: 2,
          children: [],
          files: [],
          expanded: true
        };
        currentParent.children.push(subSubNode);
      }

      currentParent = subSubNode;
    }
    
    let temp = currentParent;
    while (temp) {
      temp.expanded = true;
      temp = temp.parent!;
    }
    this.folderTree = [classificationNode];
    this.selectFolder(currentParent);
  }

  async ensureFolderHierarchy(node: FolderNode): Promise<void> {
    if (!node) return;
    if (node.parent && !node.parent.id) {
      await this.ensureFolderHierarchy(node.parent);
    }
    if (!node.id) {
      const res: any = await this.saveFolderToServer(node);
      node.id = res.id;
    }
  }

  async onClickPaste() {
    try {
      const items = await navigator.clipboard.read();
      if (!items.length) return;

      const imageBlob = await items[0].getType("image/png");
      if (!imageBlob) return;

      const file = new File([imageBlob], `pasted-${Date.now()}.png`, {
        type: "image/png",
      });
      this.selectedFile = file;

      alert("Image pasted successfully!");
    } catch (err) {
      console.error("Clipboard paste failed", err);
    }
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  fetchFolderTree(projectId: number) {
    const userId = this.getCurrentUserId();

    this.dmsService.getFolderTree(projectId, userId, this.isMasterUser).subscribe({
      next: (res: FolderNode[]) => {
        this.folderTree = this.initializeFolderTree(res);
      },
      error: (err) => console.error(err),
    });
  }

  private initializeFolderTree(nodes: any[], parent?: FolderNode): FolderNode[] {
    return nodes.map((node) => {
      const newNode: FolderNode = {
        id: node.id,
        name: node.name,
        expanded: false,
        parent: parent,
        level: parent ? (parent.level ?? 0) + 1 : 0,
        children: [],
        files: node.files?.map((f: any) => ({
          id: f.id,
          filename: f.fileName ?? "unknown",
          blobUrl: f.blobUrl ?? "",
          classification: f.classification ?? "",
        })) || [],
      };

      if (node.children) {
        newNode.children = this.initializeFolderTree(node.children, newNode);
      }

      return newNode;
    });
  }

  getPreviewUrl(file: File): string | null {
    return this.filePreviews.get(file) || null;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    this.isDragging = false;

    if (!this.selectedNode || !this.selectedNode.name) {
      this.utilityService.showSwalToast(
        "Folder Required",
        "Please select a folder before uploading files.",
        "warning"
      );
      return;
    }

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;

    this.appendFiles(files);
  }

  appendFiles(files: FileList) {
    Array.from(files).forEach((file) => {
      const existsInSelected = this.selectedFiles.some(
        (f) =>
          f.name === file.name &&
          f.size === file.size &&
          f.lastModified === file.lastModified
      );
      const existsInFolder = this.selectedNode?.files?.some(
        (f: any) =>
          (f.filename || f.fileName)?.toLowerCase() === file.name.toLowerCase()
      );

      if (existsInSelected || existsInFolder) {
        this.utilityService.showSwalToast(
          "Duplicate File",
          `${file.name} already exists in this folder`,
          "warning"
        );
        // return;
      }
      this.selectedFiles.push(file);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        this.filePreviews.set(file, url);
      }
    });
  }

  addNewClassification() {
    if (!this.folderType || this.folderType.trim() === '') {
      return;
    }
    const exists = this.classifications.some(
      c => c.name.toLowerCase() === this.folderType.toLowerCase()
    );
    if (exists) {
      this.utilityService.showSwalToast(
        "Already Exists",
        "Classification already exists",
        "warning"
      );
      return;
    }
    const userDataString = localStorage.getItem("currentUser");
    if (!userDataString) return;
    const userData = JSON.parse(userDataString);
    const userId = userData.contact?.id;
    const payload = {
      name: this.folderType.trim(),
      createdBy: userId.toString()
    };

    this.dmsService.addClassification(payload).subscribe({
      next: (res: any) => {

        this.classifications.push({
          name: res.name
        });
        this.utilityService.showSwalToast(
          "Success",
          "Folder added successfully",
          "success"
        );
      this.folderType = '';
      },
      error: (err) => {
        console.error(err);
        this.utilityService.showSwalToast(
          "Error",
          "Failed to add folder",
          "error"
        );
      }
    });
  }

  onClassificationChange(value: any) {
    if (typeof value === 'string') {
      const search = value.toLowerCase();
      this.filteredClassifications = this.classifications.filter(c =>
        c.name.toLowerCase().startsWith(search)
      );
      this.selectedClassificationId = null;
      return;
    }

    if (value && value.id) {
      this.selectedClassificationId = value.id;
      this.dmsService.getSubClassifications(value.id).subscribe(res => {
        this.subClassifications = res || [];
        this.filteredSubClassifications = res || [];
      });
      this.subClassification = '';
      this.subSubClassification = '';
      this.subSubClassifications = [];
      this.filteredSubSubClassifications = [];
      this.createClassificationHierarchy();
    }
  }

   displayName(obj: any): string {
    return obj && obj.name ? obj.name : '';
  }

  onSubClassificationChange(value: any) {
    if (typeof value === 'string') {
      const search = value.toLowerCase();
      this.filteredSubClassifications = this.subClassifications.filter(s =>
        s.name.toLowerCase().startsWith(search)
      );
      this.selectedSubClassificationId = null;
      return;
    }

    if (value && value.id) {
      this.selectedSubClassificationId = value.id;
      this.dmsService.getSubSubClassifications(value.id).subscribe(res => {
        this.subSubClassifications = res || [];
        this.filteredSubSubClassifications = res || [];
      });
      this.subSubClassification = '';
      this.createClassificationHierarchy();
    }
  }

  openSubfolderMaster() {
    this.dialog.open(SubfolderMasterDialogComponent, {
      width: '400px',
    });
  }

  onSubSubClassificationChange(value: any) {
    if (typeof value === 'string') {
      const search = value.toLowerCase();
      this.filteredSubSubClassifications = this.subSubClassifications.filter(s =>
        s.name.toLowerCase().startsWith(search)
      );
      return;
    }

    if (value && value.id) {
      this.subSubClassification = value;
      this.createClassificationHierarchy();
    }
  }

  async downloadFile(file: any) {
    try {
      const response = await fetch(file.blobUrl);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.fileName || file.filename || "download";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download file");
    }
  }

  addFullClassification() {
    if (!this.folderType) return;
    const userData = JSON.parse(localStorage.getItem("currentUser") || '{}');
    const userId = userData.contact?.id;
    const payload = {
      classification: typeof this.folderType === 'object'
        ? (this.folderType as any).name
        : this.folderType,

      subClassification: typeof this.subClassification === 'object'
        ? (this.subClassification as any).name
        : this.subClassification,

      subSubClassification: typeof this.subSubClassification === 'object'
        ? (this.subSubClassification as any).name
        : this.subSubClassification,

      createdBy: userId?.toString()
    };

    this.dmsService.addFullClassification(payload).subscribe({
      next: () => {
        this.utilityService.showSwalToast("Success", "Saved successfully", "success");
        this.folderType = '';
        this.subClassification = '';
        this.subSubClassification = '';
      },
      error: () => {
        this.utilityService.showSwalToast("Error", "Failed", "error");
      }
    });
  }

  getFileIcon(file: File): string {
    const name = file.name.toLowerCase();
    if (name.endsWith('.pdf')) return 'picture_as_pdf';
    if (name.endsWith('.xls') || name.endsWith('.xlsx')) return 'table_chart';
    if (name.endsWith('.doc') || name.endsWith('.docx')) return 'description';
    if (name.endsWith('.csv')) return 'grid_on';
    if (name.endsWith('.txt')) return 'article';
    if (name.endsWith('.zip') || name.endsWith('.rar')) return 'folder_zip';
    return 'insert_drive_file';
  }

  removeUser(userId: number) {
    this.selectedContacts = this.selectedContacts.filter(id => id !== userId);
  }

  getUserName(userId: number): string {
    return this.contactOptions.find(c => c.id === userId)?.name || '';
  }
}