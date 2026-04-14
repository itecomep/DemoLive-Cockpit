import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Leave } from '../../models/leave.model';
import { LeaveSummary } from '../../models/leave-summary.model';
import { AppConfig } from 'src/app/app.config';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-leave-list-item',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule,
  ],
  templateUrl: './leave-list-item.component.html',
  styleUrls: ['./leave-list-item.component.scss']
})
export class LeaveListItemComponent implements OnInit {
  @Input() item!: Leave;
  @Input() index: number = 0;
  @Input() showRemove: boolean = false;
  @Input() showAll: boolean = false;
  @Input() monthlySummary?: LeaveSummary;
  @Input() allLeaves: Leave[] = [];
  @Output() remove = new EventEmitter<any>();

  readonly LEAVE_TYPEFLAG_CASUAL = this.config.LEAVE_TYPEFLAG_CASUAL;
  readonly LEAVE_TYPEFLAG_SICK = this.config.LEAVE_TYPEFLAG_SICK;
  readonly LEAVE_TYPEFLAG_EMERGENCY = this.config.LEAVE_TYPEFLAG_EMERGENCY;
  // readonly LEAVE_TYPEFLAG_APPROVED_HALFDAY = this.config.LEAVE_TYPEFLAG_APPROVED_HALFDAY;
  // readonly LEAVE_TYPEFLAG_EMERGENCY_HALFDAY = this.config.LEAVE_TYPEFLAG_EMERGENCY_HALFDAY;
  readonly LEAVE_TYPEFLAG_CASUAL_FIRST_HALF = this.config.LEAVE_TYPEFLAG_CASUAL_FIRST_HALF;
  readonly LEAVE_TYPEFLAG_CASUAL_SECOND_HALF = this.config.LEAVE_TYPEFLAG_CASUAL_SECOND_HALF;
  readonly LEAVE_TYPEFLAG_EMERGENCY_FIRST_HALF = this.config.LEAVE_TYPEFLAG_EMERGENCY_FIRST_HALF;
  readonly LEAVE_TYPEFLAG_EMERGENCY_SECOND_HALF = this.config.LEAVE_TYPEFLAG_EMERGENCY_SECOND_HALF;

  readonly LEAVE_STATUSFLAG_PENDING = this.config.LEAVE_STATUSFLAG_PENDING;
  readonly LEAVE_STATUSFLAG_APPROVED = this.config.LEAVE_STATUSFLAG_APPROVED;
  readonly LEAVE_STATUSFLAG_REJECTED = this.config.LEAVE_STATUSFLAG_REJECTED;

  constructor(
    private config: AppConfig
  ) { }

  ngOnInit() { }

  // get isViolated(): boolean {
  //   if (this.item.statusFlag !== this.LEAVE_STATUSFLAG_PENDING) return false;
  //   if (!this.allLeaves.length) return false;

  //   const itemDate = new Date(this.item.start);
    
  //   const earlierLeavesInMonth = this.allLeaves.filter(leave => {
  //     const leaveDate = new Date(leave.start);
  //     return leaveDate.getMonth() === itemDate.getMonth() && 
  //            leaveDate.getFullYear() === itemDate.getFullYear() && 
  //            leave.typeFlag === this.item.typeFlag && 
  //            leaveDate < itemDate &&
  //            (leave.statusFlag === this.LEAVE_STATUSFLAG_APPROVED || leave.statusFlag === this.LEAVE_STATUSFLAG_PENDING);
  //   }).length;

  //   return earlierLeavesInMonth > 0;
  // }

  onRemove() {
    this.remove.emit({ item: this.item, index: this.index });
  }
}
