import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ProjectApiService } from '../../services/project-api.service';

import { Project, ProjectAttachment } from '../../models/project.model';
import { firstValueFrom } from 'rxjs';
import { ProjectAssociation } from '../../models/project-association.model';
import { ProjectInward } from '../../models/project-inward.model';
import { ProjectNote } from '../../models/project-note.model';
import { ProjectInwardApiService } from '../../services/project-inward-api.service';
import { FormGroup } from '@angular/forms';
import { AppConfig } from 'src/app/app.config';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { McvFileUploadConfig } from 'src/app/mcv-file/models/mcv-file-upload-config.model';
import { ProjectInwardComponent } from '../project-inward/project-inward.component';
import { ProjectNotesComponent } from '../project-notes/project-notes.component';
import { ProjectAssociationComponent } from '../project-association/project-association.component';
import { ProjectDefinitionComponent } from '../project-definition/project-definition.component';
import { ProjectDefinitionUpdateComponent } from '../project-definition-update/project-definition-update.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectStageApiService } from '../../services/project-stage-api.service';
import { ProjectStagesComponent } from '../project-stages/project-stages.component';
import { ProjectStagesUpdateComponent } from '../project-stages-update/project-stages-update.component';
import { ProjectTeamComponent } from '../project-team/project-team.component';
import { ProjectBillApiService } from '../../services/project-bill-api.service';
import { ProjectBillsComponent } from '../project-bills/project-bills.component';
import { ProjectTodoComponent } from '../project-todo/project-todo.component';
import { ProjectDmsComponent } from '../project-dms/project-dms.component';
import { ProjectWorkOrderComponent } from '../project-work-order/project-work-order.component';
import { ProjectRequestTicketViewComponent } from "../project-request-ticket-view/project-request-ticket-view.component";
import { ProjectMeetingViewComponent } from '../project-meeting-view/project-meeting-view.component';
import { WorkOrderComponent } from 'src/app/work-order/components/work-order/work-order.component';
import { ProjectWorkOrderBillViewComponent } from '../project-work-order-bill-view/project-work-order-bill-view.component';
import { ProjectGmailDialogComponent } from '../project-gmail-dialog/project-gmail-dialog.component';
import { ProjectFileComponent } from '../project-file/project-file.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AllMailComponent } from '../../.././gmail/all-mail/all-mail.component';
import { GmailService } from "../../../gmail/services/gmail.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    MatTabsModule,
    DatePipe,
    //Components
    ProjectStagesComponent,
    ProjectStagesUpdateComponent,
    ProjectTeamComponent,
    ProjectDefinitionUpdateComponent,
    ProjectDefinitionComponent,
    ProjectAssociationComponent,
    ProjectNotesComponent,
    ProjectInwardComponent,
    ProjectBillsComponent,
    ProjectTodoComponent,
    ProjectDmsComponent,
    ProjectWorkOrderComponent,
    ProjectRequestTicketViewComponent,
    ProjectMeetingViewComponent,
    WorkOrderComponent,
    ProjectWorkOrderBillViewComponent,
    ProjectGmailDialogComponent,
    AllMailComponent,
    ProjectFileComponent
]
})
export class ProjectComponent implements OnInit {

  @Input('config') set configValue(value: {
    entityID: number;
    currentEntity: any;
  }) {
    if (value) {
      this.entityID = value.entityID;
      this.currentEntity = value.currentEntity;
      this.refresh();
    }
  }
  entityID!: number;
  currentEntity: Project = new Project();
  get nameOfEntity() { return this.entityApiService.nameOfEntity; }
  get isEditMode() { return this.entityApiService.isEditMode; }

  get isPermissionAssociationsView() { return this.entityApiService.isPermissionAssociationsView; }
  get isPermissionAssociationsEdit() { return this.entityApiService.isPermissionAssociationsEdit; }
  
  get isPermissionTeamView() { return this.entityApiService.isPermissionTeamView; }
  
  get isPermissionList() { return this.entityApiService.isPermissionList; }
  get isPermissionEdit(): boolean { return this.entityApiService.isPermissionEdit; }
  get isPermissionDelete() { return this.entityApiService.isPermissionDelete; }

  get isPermissionInwardsView() { return this.entityApiService.isPermissionInwardsView; }
  get isPermissionInwardsEdit() { return this.entityApiService.isPermissionInwardsEdit; }

  get isPermissionNotesView() { return this.entityApiService.isPermissionNotesView; }
  get isPermissionNotesEdit() { return this.entityApiService.isPermissionNotesEdit; }

  get isPermissionPhotosView() { return this.entityApiService.isPermissionPhotosView; }
  get isPermissionPhotosEdit() { return this.entityApiService.isPermissionPhotosEdit; }

  get isPermissionStagesView() { return this.entityApiService.isPermissionStagesView; }
  get isPermissionStagesEdit() { return this.entityApiService.isPermissionStagesEdit; }
  
  get isPermissionWorkOrderView() { return this.entityApiService.isPermissionWorkOrderView; }

  get isPermissionOfferView() { return this.entityApiService.isPermissionOfferView; }

  get isPermissionBillingView() { return this.billService.isPermissionView; }
  get isPermissionMeetingsView() { return this.entityApiService.isPermissionMeetingsView; }

  get isPermissionFileDms() { return this.entityApiService.isPermissionFileDms; }
  
  get isPermissionRequestTicketsView() { return this.entityApiService.isPermissionRequestTicketsView; }
  get isPermissionDMSView(){return this.entityApiService.isPermissionDMSView}
  get isPermissionTodoView(){return this.entityApiService.isPermissionTodoView}
  get isPermissionGmailView(): boolean { return this.entityApiService.isPermissionGmailView; }
  get isPermissionAllowedIpView(): boolean { return this.entityApiService.isPermissionAllowedIpBypassView; }
  // get PROJECT_ATTACHMENTS_TYPE_FLAG_PHOTOS() { return this.config.PROJECT_ATTACHMENTS_TYPE_FLAG_PHOTOS; }
  get PROJECT_INWARDS_TYPE_FLAG_INWARDS() { return this.projectInwardService.PROJECT_INWARDS_TYPE_FLAG_INWARDS; }
  get PROJECT_INWARDS_TYPE_FLAG_PHOTOS() { return this.projectInwardService.PROJECT_INWARDS_TYPE_FLAG_PHOTOS; }
  get PROJECT_INWARDS_TYPE_FLAG_REPORTS() { return this.projectInwardService.PROJECT_INWARDS_TYPE_FLAG_REPORTS; }

  segmentOptions: string[] = [];
  associationGroupOptions: string[] = [];
  updateForm!: FormGroup;
  editableAttachmentConfig: any;
  gmailEmails: any[] = [];
  gmailLoading = false;
  userId: number | null = null;
  currentLabelNameForNewLabel: string | null = null;
  labelNextPageToken: string | null = null;
  currentPage = 1;
  totalPages = 1;
  totalEmails = 0;
  pageSize = 20;
  pageTokens: { [page: number]: string | null } = { 1: null };
  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  get statusColor() { return this.entityApiService.getStatusColor(this.currentEntity.statusFlag); }


  blobConfig!: McvFileUploadConfig;
  constructor(
    private billService: ProjectBillApiService,
    private entityApiService: ProjectApiService,
    private projectInwardService: ProjectInwardApiService,
    private appSettingService: AppSettingMasterApiService,
    private utilityService: UtilityService,
    private router: Router,
    private config: AppConfig,
    private projectStageService: ProjectStageApiService,
    private sanitizer: DomSanitizer,
    private gmailService: GmailService
  ) { }

  async ngOnInit() {
    if (!this.appSettingService.presets || !this.appSettingService.presets.length) {
      await this.appSettingService.loadPresets();
    }

    const preset = this.appSettingService.presets.find(x => x.presetKey == this.config.PRESET_BLOB_CONTAINER_ATTACHMENTS);
    if (preset) {
      this.blobConfig = new McvFileUploadConfig(preset.presetValue, `${this.nameOfEntity}`);
    }
    const _segmentOptions = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_PROJECT_SEGMENT_OPTIONS);
    if (_segmentOptions) {
      this.segmentOptions = _segmentOptions.presetValue.split(',').map(x => x.toUpperCase());
    }
    const _groupOptions = this.appSettingService.presets
      .find(x => x.presetKey == this.config.PRESET_PROJECT_ASSOCIATION_GROUPS);
    if (_groupOptions) {
      this.associationGroupOptions = _groupOptions.presetValue.split(',').map(x => x.toUpperCase());
    }
    this.userId = this.getUserId();
  }

  async refresh() {
    this.currentEntity = new Project();
    if (this.entityID && this.entityID !== -1) {
      await this.getCurrent(this.entityID);
      this.entityApiService.activeEntity = this.currentEntity;
      this.setNotesConfig();
      this.setAssociationConfig();
      this.setAttachmentConfig();
      this.setInwardConfig();
      this.setInwardPhotosConfig();
      this.setInwardReportsConfig();
      this.loadGmailEmails();

      if (this.userId) {
        const payload = {
          UserId: this.userId.toString(),
          LabelName: this.currentLabelName
        };
        console.log("Syncing Gmail label:", payload.LabelName);

        this.gmailService.syncLabelEmails(payload).subscribe({
         next: (res: any) => {
          if (res && res.length > 0) {
            console.log(`Label (${payload.LabelName}) emails synced successfully!`);
          } else {
            console.log(`No new emails to sync for label (${payload.LabelName}).`);
          }
        },
        error: (err) => {
          console.warn(`Label sync skipped or failed for (${payload.LabelName})`, err);
        }
        });
      }
    }
  }

  private async getCurrent(id: number) {
    this.currentEntity = await firstValueFrom(this.entityApiService.getById(id));
    this.entityApiService.isEditMode = false;
    this.editableAttachmentConfig = {
      apiUrl: this.config.apiProjectAttachments,
      typeFlag: 0,
      entityTitle: this.currentEntity.title,
      entityID: this.currentEntity.id,
      allowEdit: this.entityApiService.isPermissionDMSEdit,
      allowDelete: this.entityApiService.isPermissionDMSDelete
    };
  }

  onUpdate(event: Project) {
    this.currentEntity = Object.assign({}, event);
    this.update.emit(event);
  }

  onFormChange(event: FormGroup) {
    this.updateForm = event
  }
  onEdit() {
    this.entityApiService.isEditMode = true;
    this.setNotesConfig();
    this.setAssociationConfig();
    this.setAttachmentConfig();
    this.setInwardConfig();
    this.setInwardPhotosConfig();
    this.setInwardReportsConfig();
  }
  onViewMode() {
    this.entityApiService.isEditMode = false;
  }
  private touchForm(form: FormGroup) {
    if (form) {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        if (control)
          control.markAsTouched({ onlySelf: true });
      });
    }
  }

  get f() { return this.updateForm.controls; }
  onSubmit() {
    if (this.updateForm.invalid) {
      this.touchForm(this.updateForm);
      this.utilityService.showSweetDialog('Invalid Form',
        'Please fill all required fields with valid data and try again.', 'error'
      );
      return;
    }

    if (!this.currentEntity) {
      this.currentEntity = new Project();
    }

    this.currentEntity = Object.assign(this.currentEntity, this.updateForm.getRawValue());
    this.currentEntity.segment = this.f['segments'].value?.join(',');
    this.currentEntity.typology = this.f['typologies'].value?.join(',');
    this.currentEntity.clientContactID = this.f['clientContact'].value ? this.f['clientContact'].value.id : null;
    this.currentEntity.referredByContactID = this.f['referredByContact'].value ? this.f['referredByContact'].value.id : null;

    const _messageText = `Update | ${this.nameOfEntity}: ${this.currentEntity.title}`;
    this.utilityService.showConfirmationDialog(_messageText,
      async () => {
        // await this.contactAssociationService.updateItems();
        this.currentEntity = await firstValueFrom(this.entityApiService.update(this.currentEntity));
        this.entityApiService.activeEntity = this.currentEntity;
        this.utilityService.showSwalToast('Success!', 'Save successful.');

        this.entityApiService.refreshList();
        this.update.emit(this.currentEntity);
      }
    );
  }
  onDelete() {
    const _messageText = `Delete ${this.nameOfEntity}: ${this.currentEntity.code}-${this.currentEntity.title}`;

    this.utilityService.showConfirmationDialog(_messageText,
      async () => {
        await firstValueFrom(this.entityApiService.delete(this.currentEntity.id))
        this.utilityService.showSwalToast(
          'Success!',
          'Delete successful.',
        );
        this.delete.emit(this.currentEntity);
        this.entityApiService.activeEntity = undefined;
        this.entityApiService.refreshList();
        this.router.navigate([this.config.ROUTE_PROJECT_LIST]);
      }
    );
  }
  associationConfig: any;
  private setAssociationConfig() {
    this.associationConfig = {
      isReadOnly: !this.isPermissionAssociationsEdit,
      project: this.currentEntity,
      associations: this.currentEntity.associations,
      groupOptions: this.associationGroupOptions,
      updateDatabase: this.isPermissionAssociationsEdit
    };
  }
  onAssociationsUpdate(event: ProjectAssociation[]) {
    this.currentEntity.associations = event;
  }

  notesConfig: any;
  private setNotesConfig() {
    this.notesConfig = {
      isReadOnly: !this.isPermissionNotesEdit,
      project: this.currentEntity,
      notes: this.currentEntity.notes,
      updateDatabase: this.isPermissionNotesEdit
    };
  }
  onNotesUpdate(event: ProjectNote[]) {
    this.currentEntity.notes = event;
  }

  attachmentConfig: any;
  private setAttachmentConfig() {
    this.attachmentConfig = {
      isReadOnly: !this.isEditMode,
      project: this.currentEntity,
      attachments: this.currentEntity.attachments,
      typeFlag: 0,
    };
  }

  onAttachmentsUpdate(event: ProjectAttachment[]) {
    this.currentEntity.attachments = event;
  }

  inwardConfig: any;
  private setInwardConfig() {
    this.inwardConfig = {
      isReadOnly: !this.isPermissionInwardsEdit,
      project: this.currentEntity,
      inwards: this.currentEntity.inwards.filter(x => x.typeFlag == this.PROJECT_INWARDS_TYPE_FLAG_INWARDS),
      typeFlag: this.PROJECT_INWARDS_TYPE_FLAG_INWARDS,
      updateDatabase: this.isPermissionInwardsEdit
    };
  }

  onInwardsUpdate(event: ProjectInward[]) {
    this.currentEntity.inwards = this.currentEntity.inwards.filter(x => x.typeFlag != this.PROJECT_INWARDS_TYPE_FLAG_INWARDS);
    this.currentEntity.inwards.push(...event);
  }

  inwardPhotosConfig: any;
  private setInwardPhotosConfig() {
    this.inwardPhotosConfig = {
      isReadOnly: !this.isPermissionInwardsEdit,
      project: this.currentEntity,
      inwards: this.currentEntity.inwards.filter(x => x.typeFlag == this.PROJECT_INWARDS_TYPE_FLAG_PHOTOS),
      typeFlag: this.PROJECT_INWARDS_TYPE_FLAG_PHOTOS,
      updateDatabase: this.isPermissionPhotosEdit
    };
  }

  onInwardsPhotosUpdate(event: ProjectInward[]) {
    this.currentEntity.inwards = this.currentEntity.inwards.filter(x => x.typeFlag != this.PROJECT_INWARDS_TYPE_FLAG_PHOTOS);
    this.currentEntity.inwards.push(...event);
  }

  inwardReportConfig: any;
  private setInwardReportsConfig() {
    this.inwardReportConfig = {
      isReadOnly: !this.isPermissionInwardsEdit,
      project: this.currentEntity,
      inwards: this.currentEntity.inwards.filter(x => x.typeFlag == this.PROJECT_INWARDS_TYPE_FLAG_REPORTS),
      typeFlag: this.PROJECT_INWARDS_TYPE_FLAG_REPORTS,
      updateDatabase: this.isPermissionPhotosEdit
    };
  }

  onInwardsReportsUpdate(event: ProjectInward[]) {
    this.currentEntity.inwards = this.currentEntity.inwards.filter(x => x.typeFlag != this.PROJECT_INWARDS_TYPE_FLAG_REPORTS);
    this.currentEntity.inwards.push(...event);
  }

  showActions: boolean = false;
  onTabChange(event: MatTabChangeEvent) {
    this.showActions = event.index == 0;
  }

  onCreateChild() {
    this.utilityService.showConfirmationDialog(`Do you want create child project for ${this.currentEntity.title}?`, async () => {
      let _childProject = new Project();
      _childProject = Object.assign(_childProject, this.currentEntity);
      _childProject.id = 0;
      _childProject.parentID = this.currentEntity.id;
      const _project  = await firstValueFrom(this.entityApiService.create(_childProject));
      this.entityApiService.refreshList();
      this.router.navigate([this.entityApiService.defaultRoute, _project.id]);
    });
  }

  onUploadAttachments(items: ProjectAttachment[]) {
    if (items) {
      this.currentEntity.attachments = items;
    }
  }

  onDMSUpdate(event: ProjectAttachment[]) {
    this.currentEntity.attachments = event;
  }

  private getUserId(): number | null {
    const data = localStorage.getItem('currentUser');
    if (!data) return null;

    try {
      return JSON.parse(data).userId ?? null;
    } catch {
      return null;
    }
  }

  loadGmailEmails(page: number = 1) {
    if (!this.currentEntity || !this.userId) return;
    const labelName = `${this.currentEntity.code} - ${this.currentEntity.title}`;
    this.currentLabelNameForNewLabel = labelName;
    this.gmailLoading = true;
    const pageToken = this.pageTokens[page] ?? null;

    this.entityApiService.getEmailsByLabel(
      this.userId.toString(),
      labelName,
      pageToken,
      this.pageSize
    ).subscribe({
      next: (res: any) => {

        this.gmailEmails = res.emails.map((email: any) => ({
          ...email,
          safeBody: this.sanitizer.bypassSecurityTrustHtml(email.body || '')
        }));

        if (res.nextPageToken) {
          this.pageTokens[page + 1] = res.nextPageToken;
        }
        this.totalEmails = res.total ?? this.gmailEmails.length;
        this.totalPages = Math.ceil(this.totalEmails / this.pageSize);
        this.currentPage = page;
        this.gmailLoading = false;
      },
      error: () => {
        this.gmailEmails = [];
        this.gmailLoading = false;
      }
    });
  }

  loadNext() {
    if (this.currentPage < this.totalPages) {
      this.loadGmailEmails(this.currentPage + 1);
    }
  }

  loadPrev() {
    if (this.currentPage > 1) {
      this.loadGmailEmails(this.currentPage - 1);
    }
  }

  get currentLabelName(): string {
    return `${this.currentEntity.code} - ${this.currentEntity.title}`;
  }
}
