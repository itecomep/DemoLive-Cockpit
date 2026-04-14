import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Project, ProjectAttachment } from '../../models/project.model';
import { firstValueFrom } from 'rxjs';
import { ProjectAttachmentApiService } from '../../services/project-attachment-api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { McvFileUploadComponent } from 'src/app/mcv-file/components/mcv-file-upload/mcv-file-upload.component';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { ProjectApiService } from '../../services/project-api.service';
import { ProjectDmsFolderNavigatorComponent } from '../project-dms-folder-navigator/project-dms-folder-navigator.component';

@Component({
  selector: 'app-project-dms',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    McvFileUploadComponent,
    McvFileComponent,
    ProjectDmsFolderNavigatorComponent
  ],
  templateUrl: './project-dms.component.html',
  styleUrls: ['./project-dms.component.scss']
})
export class ProjectDmsComponent implements OnInit {

  private readonly utilityService = inject(UtilityService);
  private readonly projectAttachmentService = inject(ProjectAttachmentApiService);
  private readonly projectApiService = inject(ProjectApiService);
  
  project?: Project;
  attachments: ProjectAttachment[] = [];
  @Input('project') set projectValue(val: Project) {
    if (val) {
      this.project = val;
      this.attachments = this.project.attachments.map(x=> new ProjectAttachment(x));
      // this.refresh();
      this.getProjectAttachment(this.project.id);
    }
  }

  @Output() update = new EventEmitter<ProjectAttachment[]>();

  get isEditMode(){return this.projectApiService.isEditMode}

  async ngOnInit() {
    // await this.appSettingService.loadPresets();
    // this.PRESET_TDS_RATE = Number(this.appSettingService.presets
    //   .find(x => x.presetKey == this.config.PRESET_TDS)?.presetValue);
  }

  async getProjectAttachment(id:number){
    if (this.project && this.project.attachments.length == 0) {
      this.attachments = await firstValueFrom(this.projectAttachmentService.get([
        { key: 'projectID', value: id.toString() }
      ]));
 
    }
    this.attachments.sort((a, b) => a.filename.localeCompare(b.filename));
    this.treeData = this.getTreeMapFromList(this.attachments);
  }

  private async refresh() {
    if (this.project && this.project.attachments.length == 0) {
      this.attachments = await firstValueFrom(this.projectAttachmentService.get([
        { key: 'projectID', value: this.project?.id.toString() }
      ]));
 
    }
    this.attachments.sort((a, b) => a.filename.localeCompare(b.filename));
    this.treeData = this.getTreeMapFromList(this.attachments);
  }

  onCreateFolder(){

  }

  getCount(attachments: ProjectAttachment[]) : number{
      return attachments.length;
  }

  treeData: ProjectAttachment[] = []
  getTreeMapFromList(data: ProjectAttachment[]): ProjectAttachment[] {
    // Create a map to store references to each item by ID
    const idMapping = data.reduce((acc: Record<number, number>, el, i) => {
      acc[el.id] = i;
      return acc;
    }, {});
  
    // Clone the data to avoid mutating the original array
    const _list = data.map(item => ({ ...item, children: [] as ProjectAttachment[], level: 0 }));
  
    const roots: ProjectAttachment[] = [];
  
    _list.forEach(el => {
      // Check if it's a root element
      if (el.parentID === null || el.parentID === undefined) {
        el.level = 0; // Root level
        roots.push(new ProjectAttachment(el));
        return;
      }
  
      // Locate the parent element
      const parentIndex = idMapping[el.parentID];
      if (parentIndex !== undefined) {
        const parentEl = _list[parentIndex];
        el.level = parentEl.level + 1; // Increment level based on parent
        parentEl.children!.push(new ProjectAttachment(el));
      }
    });
  
    return roots;
  }
  
  onUpdate(item: ProjectAttachment) {
    let updated=this.attachments.find(x=>x.id==item.id);
    if(updated){
      updated=Object.assign(updated, item);
    }
    // this.refresh();
  }
  
  onDelete(item: ProjectAttachment) {
    this.attachments = this.attachments.filter(x => x.id !== item.id);
    // this.refresh();
  }

  onCreate(item: ProjectAttachment[]) {
    this.attachments.push(...item);
    // this.refresh();
  }

  onSearch(value: string) {
    this.attachments = this.attachments.filter(x => x.filename.toLowerCase().includes(value.toLowerCase()));
    this.attachments.sort((a, b) => a.filename.localeCompare(b.filename));
    console.log(value,this.attachments);
    this.treeData = this.getTreeMapFromList(this.attachments);
  }
}
