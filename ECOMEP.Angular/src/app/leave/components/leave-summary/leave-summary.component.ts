import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { LeaveSummary } from '../../models/leave-summary.model';
import { LeaveApiService } from '../../services/leave-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatButtonModule } from '@angular/material/button';
import { McvNonZeroPipe } from 'src/app/shared/pipes/mcv-non-zero.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-leave-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    McvNonZeroPipe
  ],
  templateUrl: './leave-summary.component.html',
  styleUrls: ['./leave-summary.component.scss']
})
export class LeaveSummaryComponent implements OnInit {

  @Input('config') set configValue(value: { contactID: number }) {
    if (value) {
      this.contactID = value.contactID;
      this.getSummary(this.contactID, this.index);
      this.year = this.currentYear;
    }
  }

  get currentYear() { return (new Date()).getFullYear(); }
  year: number = 0;
  contactID!: number;
  yearlySummary: LeaveSummary[] = [];
  totalSummary!: LeaveSummary;
  index = 0;
  today = new Date();

  constructor(
    private entityService: LeaveApiService,
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
  }

  private async getSummary(contactID: number, index: number) {
    if (contactID) {
      this.yearlySummary = [];
      this.totalSummary = new LeaveSummary();
      this.yearlySummary = await firstValueFrom(this.entityService.getPerMonthSummary(contactID, index));
      this.totalSummary = await firstValueFrom(this.entityService.getTotalSummary(contactID, index));
    }
  }

  onPrevClick() {
    this.index--;
    this.year--;
    this.getSummary(this.contactID, this.index);
  }

  onNextClick() {
    this.index++;
    this.year++;
    this.getSummary(this.contactID, this.index);
  }

  shouldShowPending(item: any): boolean {
    const itemDate = new Date(item.year, item.month - 1);
    return itemDate <= this.today;
  }
}
