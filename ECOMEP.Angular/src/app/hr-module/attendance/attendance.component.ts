import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent {
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
