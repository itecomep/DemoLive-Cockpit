import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ViewChild, TemplateRef } from '@angular/core';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { HrModuleService } from '../hr-module.service';
import { MatIconModule } from '@angular/material/icon';

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
   isTeamLeader?: boolean;
}

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule, FormsModule,MatDialogModule,MatIconModule ],
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent implements OnInit {
  @ViewChild("profileDialog") profileDialog!: TemplateRef<any>;

  filters = {
    staffName: '',
    startDate: ''
  };

  meetings: Meeting[] = [];
  filteredMeetings: Meeting[] = [];
  activeMonthFilter: "none" | "current" | "previous" | "next" = "none";


  constructor(private http: HttpClient,private dialog: MatDialog, private contactService: ContactApiService, private hrService: HrModuleService ) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  // loadMeetings(): void {
  //   this.http.get<Meeting[]>('http://localhost:5054/Meeting/summary')
  //     .subscribe({
  //       next: (data) => {
  //         this.meetings = data;
  //         this.filteredMeetings = [...this.meetings];
  //       },
  //       error: (err) => {
  //         console.error('Error loading meetings:', err);
  //       }
  //     });
  // }


//   loadMeetings(): void {
//   this.http.get<Meeting[]>('http://localhost:5054/Meeting/summary')
//     .subscribe({
//       next: (data) => {

//         // 🔥 GET CONTACTS (for images)
//         this.contactService.get([]).subscribe((contacts: any[]) => {

//           this.meetings = data.map((m: any) => {

//             const contact = contacts.find(
//               (c) =>
//                 c.name?.toLowerCase().trim() ===
//                 m.attendeeName?.toLowerCase().trim()
//             );

//             return {
//               ...m,
//               photoUrl: contact?.photoUrl || ""   // ✅ IMAGE FIX
//             };
//           });

//           // ✅ IMPORTANT: update filtered data
//           this.filteredMeetings = [...this.meetings];
//         });

//       },
//       error: (err) => {
//         console.error('Error loading meetings:', err);
//       }
//     });
// }



loadMeetings(): void {
  this.http.get<Meeting[]>('http://localhost:5054/Meeting/summary')
    .subscribe({
      next: (data) => {

        this.contactService.get([]).subscribe((contacts: any[]) => {

          // 🔥 GET TEAM LEADERS
          this.hrService.getContactTeams().subscribe((teams: any[]) => {

            const leaderNames: string[] = [];

            teams.forEach((team) => {
              team.members?.forEach((m: any) => {
                if (m.contactID === team.leaderID) {
                  const name = m.contact?.name?.toLowerCase().trim();
                  if (name && !leaderNames.includes(name)) {
                    leaderNames.push(name);
                  }
                }
              });
            });

            // 🔥 MAP DATA
            this.meetings = data.map((m: any) => {

              const contact = contacts.find(
                (c) =>
                  c.name?.toLowerCase().trim() ===
                  m.attendeeName?.toLowerCase().trim()
              );

              const empName = m.attendeeName?.toLowerCase().trim();

              return {
                ...m,
                photoUrl: contact?.photoUrl || "",
                isTeamLeader: leaderNames.includes(empName) // ⭐ ADD THIS
              };
            });

            this.filteredMeetings = [...this.meetings];
          });

        });

      },
      error: (err) => {
        console.error('Error loading meetings:', err);
      }
    });
}

  applyFilters(): void {
  this.filteredMeetings = this.meetings.filter((m: Meeting) => {

    const meetingDate = this.formatDate(m.startTime);

    /* 👤 STAFF FILTER */
    const staffMatch = this.filters.staffName
      ? m.attendeeName.toLowerCase().includes(this.filters.staffName.toLowerCase())
      : true;

    /* 📅 EXACT DATE FILTER */
    const dateMatch = this.filters.startDate
      ? meetingDate === this.filters.startDate
      : true;

    /* 📆 MONTH FILTER (STRICT) */
    let monthMatch = true;

    if (this.activeMonthFilter !== "none") {
      const range = this.getMonthRange(this.activeMonthFilter);

      monthMatch =
        meetingDate >= range.start &&
        meetingDate <= range.end;
    }

    return staffMatch && dateMatch && monthMatch;
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



toggleMonth(type: "current" | "previous" | "next") {
  this.activeMonthFilter =
    this.activeMonthFilter === type ? "none" : type;

  this.applyFilters();
}
getMonthRange(type: "current" | "previous" | "next") {
  const now = new Date();

  let start: Date;
  let end: Date;

  if (type === "current") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  } 
  else if (type === "previous") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end = new Date(now.getFullYear(), now.getMonth(), 0);
  } 
  else {
    start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  }

  return {
    start: this.formatDate(start.toISOString()),
    end: this.formatDate(end.toISOString()),
  };
}

openProfileModal(data: any) {
  this.dialog.open(this.profileDialog, {
    data: data,
    panelClass: 'profile-dialog',
    backdropClass: 'blur-backdrop'
  });
}

closeDialog() {
  this.dialog.closeAll();
}

}