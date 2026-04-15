// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-meetings',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './meetings.component.html',
//   styleUrls: ['./meetings.component.scss']
// })
// export class MeetingsComponent {

//   meetings = [
//     {
//       staffName: 'Ravi Kumar',
//       date: '2026-04-01',
//       project: 'Smart IoT',
//       meetingHours: 2,
//       travelHours: 1
//     },
//     {
//       staffName: 'Anita Sharma',
//       date: '2026-04-02',
//       project: 'Digital Twin',
//       meetingHours: 3,
//       travelHours: 0
//     },
//     {
//       staffName: 'John Mathew',
//       date: '2026-04-03',
//       project: 'HR System',
//       meetingHours: 1.5,
//       travelHours: 2
//     },
//     {
//       staffName: 'Priya Singh',
//       date: '2026-04-04',
//       project: 'Automation',
//       meetingHours: 4,
//       travelHours: 1
//     },
//     {
//       staffName: 'Aman Verma',
//       date: '2026-04-05',
//       project: 'Analytics',
//       meetingHours: 2.5,
//       travelHours: 0.5
//     }
//   ];

// }








import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent {

  meetings = [
    {
      staffName: 'Ravi Kumar',
      date: '2026-04-01',
      project: 'Smart IoT',
      meetingHours: 2,
      travelHours: 1
    },
    {
      staffName: 'Anita Sharma',
      date: '2026-04-02',
      project: 'Digital Twin',
      meetingHours: 3,
      travelHours: 0
    },
    {
      staffName: 'John Mathew',
      date: '2026-04-03',
      project: 'HR System',
      meetingHours: 1.5,
      travelHours: 2
    },
    {
      staffName: 'Priya Singh',
      date: '2026-04-04',
      project: 'Automation',
      meetingHours: 4,
      travelHours: 1
    },
    {
      staffName: 'Aman Verma',
      date: '2026-04-05',
      project: 'Analytics',
      meetingHours: 2.5,
      travelHours: 0.5
    }
  ];

  getTotalMeetingHours(): number {
    return this.meetings.reduce((sum, m) => sum + m.meetingHours, 0);
  }

  getTotalTravelHours(): number {
    return this.meetings.reduce((sum, m) => sum + m.travelHours, 0);
  }
}
