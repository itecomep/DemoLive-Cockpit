import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

import { HeaderComponent } from '../../mcv-header/components/header/header.component';
// import { AttendanceComponent } from '../attendance/attendance.component';

@Component({
  selector: 'app-my-attendance',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    HeaderComponent,
    // AttendanceComponent
  ],
  templateUrl: './my-attendance.component.html',
  styleUrls: ['./my-attendance.component.scss']
})
export class MyAttendanceComponent {
 days: number[] = Array.from({ length: 30 }, (_, i) => i + 1);

  attendanceData = [
    {
      name: 'Rohit',
      // Create 30 days of empty or mock data
      dailyDetails: Array.from({ length: 30 }, () => ({
        in: '09:00',
        out: '18:00',
        hours: '8',
        meeting: '1',
        total: '9'
      })),
      summary: {
        totalDays: 30,
        workingDays: 22,
        presentDays: 20,
        cl: 1,
        absentDays: 1
      }
    },




     {
      name: 'Aadhya',
      // Create 30 days of empty or mock data
      dailyDetails: Array.from({ length: 30 }, () => ({
        in: '09:00',
        out: '18:00',
        hours: '8',
        meeting: '1',
        total: '9'
      })),
      summary: {
        totalDays: 30,
        workingDays: 22,
        presentDays: 20,
        cl: 1,
        absentDays: 1
      }
    }
    // Add more employee objects here
  ];
}

