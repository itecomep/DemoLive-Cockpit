import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ✅ INTERFACE (VERY IMPORTANT) */
interface Meeting {
  title: string;
  createdBy: string;
  startDate: string;
  endDate: string;
  subjectType: 'Project' | 'Event';
  project?: { title: string };
  purpose: string;
  location: string;
}

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent implements OnInit {

  /* ✅ FILTERS */
  filters = {
    staffName: '',
    startDate: ''
  };

  /* ✅ MAIN DATA */
  meetings: Meeting[] = [
    {
      title: 'Client Meeting - IoT',
      createdBy: 'Ravi Kumar',
      startDate: '2026-04-01T10:00:00',
      endDate: '2026-04-01T12:00:00',
      subjectType: 'Project',
      project: { title: 'Smart IoT' },
      purpose: 'Meeting',
      location: 'Mumbai Office'
    },
    {
      title: 'Site Visit - Digital Twin',
      createdBy: 'Anita Sharma',
      startDate: '2026-04-02T11:30:00',
      endDate: '2026-04-02T14:30:00',
      subjectType: 'Project',
      project: { title: 'Digital Twin' },
      purpose: 'Site Visit',
      location: 'Pune Site'
    },
    {
      title: 'HR Planning',
      createdBy: 'John Mathew',
      startDate: '2026-04-03T09:00:00',
      endDate: '2026-04-03T11:30:00',
      subjectType: 'Event',
      purpose: 'Meeting',
      location: 'Head Office'
    },
    {
      title: 'Automation Review',
      createdBy: 'Priya Singh',
      startDate: '2026-04-04T14:00:00',
      endDate: '2026-04-04T18:00:00',
      subjectType: 'Project',
      project: { title: 'Automation' },
      purpose: 'Inspection',
      location: 'Factory'
    },
    {
      title: 'Analytics Strategy',
      createdBy: 'Aman Verma',
      startDate: '2026-04-05T16:00:00',
      endDate: '2026-04-05T18:30:00',
      subjectType: 'Event',
      purpose: 'Meeting',
      location: 'Conference Room'
    }
  ];

  /* ✅ FILTERED DATA */
  filteredMeetings: Meeting[] = [];

  /* ✅ INIT */
  ngOnInit(): void {
    this.filteredMeetings = [...this.meetings];
  }

  /* ✅ CALCULATE HOURS */
  getMeetingHours(m: Meeting): number {
    const start = new Date(m.startDate).getTime();
    const end = new Date(m.endDate).getTime();
    return +( (end - start) / (1000 * 60 * 60) ).toFixed(2);
  }

  /* ✅ FILTER LOGIC */
  applyFilters(): void {

    this.filteredMeetings = this.meetings.filter((m: Meeting) => {

      const meetingDate = this.formatDate(m.startDate);
      const filterDate = this.filters.startDate;

      /* 👤 STAFF FILTER */
      const staffMatch = this.filters.staffName
        ? m.createdBy.toLowerCase().includes(this.filters.staffName.toLowerCase())
        : true;

      /* 📅 DATE FILTER */
      const dateMatch = filterDate
        ? meetingDate === filterDate
        : true;

      return staffMatch && dateMatch;
    });
  }

  /* 🔄 RESET */
  resetFilters(): void {
    this.filters = {
      staffName: '',
      startDate: ''
    };

    this.filteredMeetings = [...this.meetings];
  }

  /* 📅 FORMAT DATE (IMPORTANT FOR FILTER) */
  formatDate(date: string): string {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  /* ✅ OPTIONAL TOTALS (for future UI) */
  getTotalMeetingHours(): number {
    return this.filteredMeetings.reduce(
      (sum, m) => sum + this.getMeetingHours(m),
      0
    );
  }
}
