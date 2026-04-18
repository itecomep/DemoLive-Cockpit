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

filters = {
  staffName: '',
  startDate: ''
};


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

applyFilters(): void {

  this.filteredMeetings = this.meetings.filter((m: any) => {

    const meetingDate = this.formatDate(m.startDate);
    const filterDate = this.filters.startDate;

    // 👤 Staff filter
    const staffMatch = this.filters.staffName
      ? m.createdBy?.toLowerCase().includes(this.filters.staffName.toLowerCase())
      : true;

    // 📅 Date filter (EXACT match)
    const dateMatch = filterDate
      ? meetingDate === filterDate
      : true;

    return staffMatch && dateMatch;
  });

}


resetFilters(): void {
  this.filters = {
    staffName: '',
    startDate: ''
  };

  this.filteredMeetings = [...this.meetings];
}


ngOnInit() {
  this.filteredMeetings = [...this.meetings];
}

formatDate(date: any): string {
  if (!date) return '';

  const d = new Date(date);

  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
}


}