import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

import { HrModuleService } from './hr-module.service';
import { WfhRequestsComponent } from './wfh-requests/wfh-requests.component';
import { WfhHistoryComponent } from './wfh-history/wfh-history.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { LeavesComponent } from './leaves/leaves.component';


import { HeaderComponent } from '../mcv-header/components/header/header.component';

@Component({
  selector: 'app-hr-module',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    WfhRequestsComponent,
    WfhHistoryComponent,
     MeetingsComponent , 
     AttendanceComponent,
     LeavesComponent,
       HeaderComponent,  
  ],
  templateUrl: './hr-module.component.html',
  styleUrls: ['./hr-module.component.scss']
})
export class HrModuleComponent implements OnInit {

  requests: any[] = [];

  constructor(private hrService: HrModuleService) {}

  // ✅ ALWAYS call single source method
  ngOnInit(): void {
    this.loadRequests();
  }

  // ✅ SINGLE API METHOD (used everywhere)
  loadRequests() {
    this.hrService.getRequests().subscribe(data => {
      this.requests = data.map(x => ({
        id: x.id,
        employeeName: x.userName,
        startDate: x.startDate,
        endDate: x.endDate,
        reason: x.reason,

        // 🔥 IMPORTANT: normalize status
        status: (x.status || 'PENDING').toLowerCase(),

        attachments: x.attachments || []
      }));
    });
  }
}