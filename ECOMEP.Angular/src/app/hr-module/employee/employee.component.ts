import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';

import { HeaderComponent } from '../../mcv-header/components/header/header.component';

import { WfhRequestsComponent } from '../wfh-requests/wfh-requests.component';
import { MyAttendanceComponent } from '../my-attendance/my-attendance.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    HeaderComponent,
    WfhRequestsComponent,
    MyAttendanceComponent
  ],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent {

}