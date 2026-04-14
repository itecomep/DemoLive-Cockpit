import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectAttachment } from '../../models/project.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProjectDmsFolderCreateComponent } from '../project-dms-folder-create/project-dms-folder-create.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { McvFileSizePipe } from 'src/app/mcv-file/pipes/mcv-file-size.pipe';
import { ProjectApiService } from '../../services/project-api.service';
import { ProjectAttachmentApiService } from '../../services/project-attachment-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { debounceTime, distinctUntilChanged, firstValueFrom, forkJoin, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { ProjectDmsFileUploadComponent } from '../project-dms-file-upload/project-dms-file-upload.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { McvFileDownloadService } from 'src/app/mcv-file/services/mcv-file-download.service';
import { McvFileUtilityService } from 'src/app/mcv-file/services/mcv-file-utility.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-project-dms-folder-navigator',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    McvFileSizePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  templateUrl: './project-dms-folder-navigator.component.html',
  styleUrls: ['./project-dms-folder-navigator.component.scss']
})
export class ProjectDmsFolderNavigatorComponent {

  private readonly dialog = inject(MatDialog);
  private readonly config = inject(AppConfig);
  private readonly utilityService = inject(UtilityService);
  private readonly projectService = inject(ProjectApiService);
  private readonly downloadService = inject(McvFileDownloadService);
  private readonly mcvFileUtilityService = inject(McvFileUtilityService);
  private readonly appSettingService = inject(AppSettingMasterApiService);
  public readonly projectAttachmentService = inject(ProjectAttachmentApiService);

  treeData: ProjectAttachment[] = []; // Tree data input
  currentLevelItems: ProjectAttachment[] = []; // Items of the current level
  currentParent: ProjectAttachment | null = null; // Track current parent for navigation
  projectID?: number
  @Input('treeData') set setTreeData(value: { treeData: ProjectAttachment[], projectID?: number }) {
    this.treeData = value.treeData;
    this.projectID = value.projectID;
    this.currentParent = null;
    // Initialize with root-level items (level 0)
    this.currentLevelItems = this.treeData.filter(item => item.level === 0);
  }

  get isEditMode(){return this.projectService.isEditMode}
  get isPermissionEdit() { return this.projectService.isPermissionDMSEdit; }
  get isPermissionView() { return this.projectService.isPermissionDMSView; }
  get isPermissionDelete() { return this.projectService.isPermissionDMSDelete; }
  readonly PROJECT_DMS_MAX_LEVEL = this.config.PROJECT_DMS_MAX_LEVEL;

  blobConfig: any
  searchFC = new FormControl(null);
  @Output() search = new EventEmitter<string>();
  ngOnInit(): void {

    this.blobConfig = {
      container: this.appSettingService?.presets?.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS)?.presetValue,
      folderPath: `${this.config.NAMEOF_ENTITY_PROJECT_ATTACHMENT}`
    };

    this.searchFC.valueChanges
    .pipe(debounceTime(400), distinctUntilChanged())
    .subscribe((value) =>
    {
      if(value){
       
        this.search.emit(value);
      }
    });
  }

  // Navigate into a folder
  navigateToChildren(parent: ProjectAttachment): void {
    if(parent.isFolder){
    this.currentParent = parent;
    this.currentLevelItems = parent.children || [];
    }
  }

  // Navigate back to the parent level
  navigateBack(): void {
    if (this.currentParent) {
      const parentID = this.currentParent.parentID;
      if (parentID === null) {
        // We're back at the root level
        this.currentParent = null;
        this.currentLevelItems = this.treeData.filter(item => item.level === 0);
      } else {
        // Find the parent in the tree
        const parent = this.findParentById(this.treeData, parentID);
        if (parent) {
          this.currentParent = parent;
          this.currentLevelItems = parent.children || [];
        }
      }
    }
  }

  // Helper function to find parent by ID
  private findParentById(tree: ProjectAttachment[], parentID?: number): ProjectAttachment | null {
    for (const item of tree) {
      if (item.id === parentID) {
        return item;
      }
      const foundInChildren = this.findParentById(item.children || [], parentID);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
    return null;
  }

  @Output() create = new EventEmitter<ProjectAttachment[]>();
  onCreateFolder(){
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      projectID: this.projectID,
      parent: this.currentParent,
      
    }

    const dialogRef=this.dialog.open(ProjectDmsFolderCreateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.currentLevelItems.push(res);
        this.create.emit([res]);
      }
    });
  }

  @Output() update = new EventEmitter<ProjectAttachment>();
  onEdit(item: ProjectAttachment) {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      projectID: this.projectID,
      parent: this.currentParent,
      currentItem: item
    }
    const dialogRef=this.dialog.open(ProjectDmsFolderCreateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        item=Object.assign(item, res);
        this.update.emit(item);
      }
    });
  }

  @Output() delete = new EventEmitter<ProjectAttachment>();
  onDelete(item: ProjectAttachment) {
    this.utilityService.showConfirmationDialog(`Do you want to delete ${item.isFolder ? 'folder' : 'file'} : ${item.filename}?`, async () => {
      await firstValueFrom(this.projectAttachmentService.delete(item.id));
      this.currentLevelItems = this.currentLevelItems.filter(x => x.id !== item.id);
      this.delete.emit(item);
    })
  }

  uploadFile(){
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      projectID: this.projectID,
      parent: this.currentParent,
      blobConfig:this.blobConfig
    }
    const dialogRef=this.dialog.open(ProjectDmsFileUploadComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.currentLevelItems.push(...res);
        this.create.emit(...res);
      }
    });
  }

  getSize(item: ProjectAttachment) {
    if(item.isFolder){
      return 0;
    }
    return item.size;
  }

  onOpen(item: ProjectAttachment) { 
    window.open(item.url, '_blank');
  }

  onDownload(item: ProjectAttachment) {
    if(item.url)
    {
      this.downloadService.downloadMultipleFiles([{url:item.url,fileName:item.filename}], true);
    }
  }

  onToggleCopy(file:ProjectAttachment){
    this.projectAttachmentService.toggleCopy(file);
  }

  isCopied(file: ProjectAttachment): boolean {
    return this.projectAttachmentService.copied.some((f) => f.id === file.id);
  }

  onPaste(file: ProjectAttachment) {
    console.log(file);
    this.utilityService.showConfirmationDialog(`Do you want to paste ${this.projectAttachmentService.copied.length} files in ${file.filename} folder?`, async () => {
      let _createRequests: Observable<ProjectAttachment>[] = [];
      //Creating a dummy object
      this.projectAttachmentService.copied.forEach(x => {
        let obj = new ProjectAttachment();
        obj.filename = x.filename;
        obj.size = x.size;
        obj.contentType = x.contentType;
        obj.guidname = x.blobPath;
        obj.blobPath = x.blobPath;
        obj.projectID = this.projectID ?? 0;
        obj.container = this.blobConfig.container;
        obj.typeFlag = 0;
        obj.url = x.url;
        obj.parentID = file?.id;
        obj.folderPath = file?.folderPath + "/" + file?.filename;
        _createRequests.push(this.projectAttachmentService.create(obj));
      });
      if (_createRequests.length != 0) {

        const results = await firstValueFrom(forkJoin(_createRequests));
        this.projectAttachmentService.clearCopied();
        file.children?.push(...results);
        this.create.emit(results);
      }
    });
  }

  removeCopied() {
    this.utilityService.showConfirmationDialog('Do you want removed all copied file?', () => {
      this.projectAttachmentService.clearCopied();
    });
  }
}
