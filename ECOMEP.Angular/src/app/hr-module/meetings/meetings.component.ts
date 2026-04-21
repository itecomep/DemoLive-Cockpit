import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Meeting {
  attendeeName: string;
  startTime: string;
  endTime: string;
  type: string;
  title: string;
  purpose: string;
  location: string;
  totalHours: number;
  photoUrl?: string;
}

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent implements OnInit {

  filters = {
    staffName: '',
    startDate: ''
  };

  meetings: Meeting[] = [];
  filteredMeetings: Meeting[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.http.get<Meeting[]>('http://localhost:5054/Meeting/summary')
      .subscribe({
        next: (data) => {
          this.meetings = data;
          this.filteredMeetings = [...this.meetings];
        },
        error: (err) => {
          console.error('Error loading meetings:', err);
        }
      });
  }

  applyFilters(): void {
    this.filteredMeetings = this.meetings.filter((m: Meeting) => {

      const meetingDate = this.formatDate(m.startTime);
      const filterDate = this.filters.startDate;

      /* 👤 STAFF FILTER */
      const staffMatch = this.filters.staffName
        ? m.attendeeName.toLowerCase().includes(this.filters.staffName.toLowerCase())
        : true;

      
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

  formatDate(date: string): string {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  getTotalTravelHours(): number {
    return this.filteredMeetings.reduce(
      (sum, m) => sum + m.totalHours,
      0
    );
  }

  formatHours(hours: number): string {
  if (!hours) return '0h';

  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);

  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}


}