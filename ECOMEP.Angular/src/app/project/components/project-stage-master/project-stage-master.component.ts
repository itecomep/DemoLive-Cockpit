import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectStageMaster } from '../../models/project-stage-master.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup } from '@angular/forms';
import { ProjectStageMasterApiService } from '../../services/project-stage-master-api.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom, forkJoin, Observable } from 'rxjs';
import { ProjectStageMasterFormComponent } from '../project-stage-master-form/project-stage-master-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-project-stage-master',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,

    //Components
    ProjectStageMasterFormComponent
  ],
  templateUrl: './project-stage-master.component.html',
  styleUrls: ['./project-stage-master.component.scss']
})
export class ProjectStageMasterComponent {
  isDeleting: boolean = false;
  results: ProjectStageMaster[] = [];
  loaderFlag: boolean = false;
  form!: FormGroup;
  type_val: any;
  displayedColumns: string[] = [
    'id',
    'Stage Title',
    'Stage Value',
    'WorkOrder Stage Title',
    'WorkOrder Stage Value',
    'Project Type',
    'Applicable From Date',
    //  'Applicable Till Date',
    'Action'];
  dataSource: ProjectStageMaster[] = [];
  totalStageValue: number = 0;
  totalWorkOrderStageValue: number = 0;
  typeOptions = ['BIM', 'DATA CENTER', 'MEP', 'MOEF', 'AI', 'DIGITAL TWIN'];
  selectedType = 'MEP';
  uniqueTopology: string[] = [];

  constructor(
    private utilityService: UtilityService,
    private projectStageMasterService: ProjectStageMasterApiService,
    private dialog: MatDialogRef<ProjectStageMasterComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.loadData();
  }

  async loadData() {
    const _data = await firstValueFrom(this.projectStageMasterService.get());
    this.results = _data;
    const uniqueTypologyGroups = new Set<string>();
    this.results.forEach(item => {
      const typologyGroup = item.typology;
      uniqueTypologyGroups.add(typologyGroup);
    });
    this.uniqueTopology = Array.from(uniqueTypologyGroups);
    this.loaderFlag = false;
    this.filterData(this.results);
  }

  private filterData(data: ProjectStageMaster[]) {
    if (data && this.selectedType) {
      this.dataSource = data.filter(x => x.typology == this.selectedType);
      this.totalStageValue = 0;
      data.filter(x => x.typology === this.selectedType).forEach(x => {
        this.totalStageValue += x.percentage;
        // this.totalWorkOrderStageValue += x.workOrderStageValue ? x.workOrderStageValue : 0;

      });

      // const uniqueStages = data.filter((stage, index, self) =>
      //   index === self.findIndex(s => s.workOrderStageTitle === stage.workOrderStageTitle)
      // );
      // this.totalWorkOrderStageValue = uniqueStages.map(x => x.workOrderStageValue ? x.workOrderStageValue : 0).reduce((a, b) => a + b, 0);

    }
  }
  onClose(e: any) {
    this.dialog.close(e);
  }

  onTypeSelection(e: any) {
    this.filterData(this.results);
  }

  async onDrop(event: CdkDragDrop<ProjectStageMaster[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      if (event.previousIndex != event.currentIndex) {
        let _requests: Observable<any>[] = [];
        this.dataSource.forEach((x, i) => {
          x.orderFlag = i + 1;
          _requests.push(this.projectStageMasterService.update(x, false));

        });
        const _results = await firstValueFrom(forkJoin(_requests));
        this.dataSource = _results;
        this.loadData();
      }
    }
  }

  openDialog(): void {

    const dialogRef = this.projectStageMasterService.openDialog(
      ProjectStageMasterFormComponent,
      {
        dialogTitle: 'New Stage',
        isCreateMode: true
      }
    );

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadData();
      }
    });
  }


  onEdit(entity: ProjectStageMaster) {

    const dialogRef = this.projectStageMasterService.openDialog(
      ProjectStageMasterFormComponent,
      {
        dialogTitle: 'Edit Stage',
        entity,
        isCreateMode: false
      }
    );
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadData();
      }

    });
  }

  onDelete(stage: ProjectStageMaster) {
    this.utilityService.showConfirmationDialog(`Do you want to delete ${stage.title} master?`, async () => {
      await firstValueFrom(this.projectStageMasterService.delete(stage.id))
      this.dataSource == this.dataSource.filter(x => x.id !== stage.id);
      this.loadData();
    });
  }
}
