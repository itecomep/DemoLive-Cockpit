import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule,FormsModule   ],
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent {

  searchText: string = '';
filteredMeetings: any[] = [];

  // ✅ FORM-BASED DUMMY DATA
  meetings = [
  {
    title: 'Client Meeting - IoT',
    createdBy: 'Ravi Kumar',
    startDate: '2026-04-01T10:00:00',
    endDate: '2026-04-01T12:00:00',
    project: { title: 'Smart IoT' },
    purpose: 'Meeting',
    location: 'Mumbai Office'
  },
  {
    title: 'Site Visit - Digital Twin',
    createdBy: 'Anita Sharma',
    startDate: '2026-04-02T11:30:00',
    endDate: '2026-04-02T14:30:00',
    project: { title: 'Digital Twin' },
    purpose: 'Site Visit',
    location: 'Pune Site'
  },
  {
    title: 'HR Planning',
    createdBy: 'John Mathew',
    startDate: '2026-04-03T09:00:00',
    endDate: '2026-04-03T11:30:00',
    project: { title: 'HR System' },
    purpose: 'Meeting',
    location: 'Head Office'
  },
  {
    title: 'Automation Review',
    createdBy: 'Priya Singh',
    startDate: '2026-04-04T14:00:00',
    endDate: '2026-04-04T18:00:00',
    project: { title: 'Automation' },
    purpose: 'Inspection',
    location: 'Factory'
  },
  {
    title: 'Analytics Strategy',
    createdBy: 'Aman Verma',
    startDate: '2026-04-05T16:00:00',
    endDate: '2026-04-05T18:30:00',
    project: { title: 'Analytics' },
    purpose: 'Meeting',
    location: 'Conference Room'
  }
];

  // ✅ CALCULATE MEETING HOURS FROM DATES
  getMeetingHours(m: any): number {
    const start = new Date(m.startDate).getTime();
    const end = new Date(m.endDate).getTime();
    return (end - start) / (1000 * 60 * 60);
  }

  // ✅ TRAVEL HOURS (DUMMY FOR NOW)
  getTravelHours(m: any): number {
    return 1; // you can change later
  }

  // ✅ TOTALS
  getTotalMeetingHours(): number {
    return this.meetings.reduce((sum, m) => sum + this.getMeetingHours(m), 0);
  }

  getTotalTravelHours(): number {
    return this.meetings.reduce((sum, m) => sum + this.getTravelHours(m), 0);
  }

  applyFilter() {
  const search = this.searchText.toLowerCase();

  this.filteredMeetings = this.meetings.filter((m: any) =>
    m.createdBy?.toLowerCase().includes(search) ||
    m.title?.toLowerCase().includes(search) ||
    m.project?.title?.toLowerCase().includes(search) ||
    m.purpose?.toLowerCase().includes(search) ||
    m.location?.toLowerCase().includes(search)
  );
}

ngOnInit() {
  this.filteredMeetings = this.meetings;
}
}