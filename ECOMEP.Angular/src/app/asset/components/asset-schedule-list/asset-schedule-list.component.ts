import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { McvFileComponent } from 'src/app/mcv-file/components/mcv-file/mcv-file.component';
import { AssetScheduleUpdateComponent } from '../asset-schedule-update/asset-schedule-update.component';
import { Asset, AssetSchedule } from '../../models/asset';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetScheduleApiService } from '../../services/asset-schedule-api.service';
import { AssetScheduleCreateComponent } from '../asset-schedule-create/asset-schedule-create.component';

@Component({
  selector: 'app-asset-schedule-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,

    //Components
    McvFileComponent,
    AssetScheduleUpdateComponent
  ],
  templateUrl: './asset-schedule-list.component.html',
  styleUrls: ['./asset-schedule-list.component.scss']
})
export class AssetScheduleListComponent {
asset!: Asset;
  isPending!: boolean;
  currentDate: Date = new Date();
  scheduleTotal: number = 0;
  toggleSchedule: boolean[] = [];
  schedules: AssetSchedule[] = [];

  readonly ASSET_SCHEDULE_ISSUE_PENDING = this.config.ASSET_SCHEDULE_ISSUE_PENDING;
  readonly ASSET_SCHEDULE_ISSUE_APPROVED = this.config.ASSET_SCHEDULE_ISSUE_APPROVED;
  readonly ASSET_SCHEDULE_ISSUE_VERIFIED = this.config.ASSET_SCHEDULE_ISSUE_VERIFIED;
  totalCostList: any[] = [];

  constructor(
    private dialog: MatDialog,
    private config: AppConfig,
    @Inject(MAT_DIALOG_DATA) data: any,
    private utilityService: UtilityService,
    private assetScheduleService: AssetScheduleApiService,
    private dialogRef: MatDialogRef<AssetScheduleListComponent>,
  ) {
    if (data) {
      this.asset = data.asset;
      this.schedules = this.asset.schedules.filter(x => !x.isDeleted && x.typeFlag == this.config.ASSET_SCHEDULE_MAINTENANCE_TYPEFLAG);
      this.schedules.sort((a: any, b: any) => new Date(b.nextScheduleDate).getTime() - new Date(a.nextScheduleDate).getTime());
      this.checkPendingIssue();
      console.log('this.schedules',this.schedules);
      this.checkCostAmount()
    }
  }
  checkCostAmount() {
    this.scheduleTotal = 0;
    this.scheduleTotal = this.schedules.reduce((total, issue) => {
      const componentCost = issue.components.reduce((acc, component) => {
        return component.isDeleted === false ? acc + component.cost : acc;
      }, 0);
      return total + componentCost;
    }, 0);
  }

  calculateComponentTotal(schedule: any): number {
    const totalCost = schedule.components
      .filter((comp: any) => !comp.isDeleted) // Exclude deleted components
      .reduce((acc: any, curr: any) => acc + curr.cost, 0);
    return totalCost;
  }
  
  checkPendingIssue() {
    const _pending = this.schedules.find(x => x.statusFlag == this.ASSET_SCHEDULE_ISSUE_PENDING);
    if (_pending) {
      this.isPending = true
    } else {
      this.isPending = false;
    }
  }

  onAddAssetSchedule() {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.autoFocus = true;
    _dialogConfig.data = {
      asset: this.asset
    }

    const _dialogRef = this.dialog.open(AssetScheduleCreateComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.schedules.push(...res);
        this.checkPendingIssue();
        this.checkCostAmount()
      }
    });
  }

  onEditAssetSchedule(schedule: AssetSchedule) {
    const _dialogConfig = new MatDialogConfig();
    _dialogConfig.disableClose = true;
    _dialogConfig.autoFocus = true;
    _dialogConfig.data = {
      issue: schedule,
      asset: this.asset
    }

    const _dialogRef = this.assetScheduleService.openDialog(AssetScheduleUpdateComponent, _dialogConfig);
    _dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (res.isUpdated) {
          let _schedule = this.schedules.find(x => x.id == res.schedule.id);
          if (_schedule) {
            _schedule = Object.assign(_schedule, res.schedule);
          }
        } else if (res.isDeleted) {
          this.schedules = this.schedules.filter(x => x.id !== res.schedule.id);
        }
        else {
          schedule = Object.assign(schedule, res);
        }
        this.checkPendingIssue();
        this.checkCostAmount()

        console.log('res', res);
      }
    });
  }

  onDeleteAssetSchedule(schedule: AssetSchedule) {
    this.utilityService.showConfirmationDialog(`Do you want to delete ${schedule.title} issue?`, async () => {
      await firstValueFrom(this.assetScheduleService.delete(schedule.id))
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onToggleSchedule(i: number) {
    this.toggleSchedule[i] = !this.toggleSchedule[i];
  }
}
