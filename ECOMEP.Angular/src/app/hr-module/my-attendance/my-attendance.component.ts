import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";

import { HeaderComponent } from "../../mcv-header/components/header/header.component";

import { AuthService } from "src/app/auth/services/auth.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HolidayMasterService } from "../../leave/services/holiday-master-api.service";
import { Holiday } from "../../leave/models/holiday.model";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-my-attendance",
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    HeaderComponent,
    HttpClientModule,
    FormsModule,
  ],
  templateUrl: "./my-attendance.component.html",
  styleUrls: ["./my-attendance.component.scss"],
})
export class MyAttendanceComponent implements OnInit {
  days: number[] = [];

  attendanceData: any[] = [];
  meetingsData: any[] = [];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private holidayService: HolidayMasterService,
  ) {}

  selectedMonthTab: "none" | "current" | "previous" | "next" = "current";

  selectedMonth: number | null = null;

  selectedYear: number | null = null;

  months = [
    { id: 1, name: "January" },
    { id: 2, name: "February" },
    { id: 3, name: "March" },
    { id: 4, name: "April" },
    { id: 5, name: "May" },
    { id: 6, name: "June" },
    { id: 7, name: "July" },
    { id: 8, name: "August" },
    { id: 9, name: "September" },
    { id: 10, name: "October" },
    { id: 11, name: "November" },
    { id: 12, name: "December" },
  ];

  years: number[] = [];

  holidays: string[] = [];
  changeMonth(type: "previous" | "current" | "next") {
    this.selectedMonthTab = type;

    const now = new Date();

    if (type === "previous") {
      this.selectedMonth = now.getMonth();

      this.selectedYear = now.getFullYear();
    } else if (type === "current") {
      this.selectedMonth = now.getMonth() + 1;

      this.selectedYear = now.getFullYear();
    } else {
      this.selectedMonth = now.getMonth() + 2;

      this.selectedYear = now.getFullYear();
    }

    this.loadAttendance();
  }

  isSunday(day: number): boolean {
    const date = new Date(
      this.selectedYear || new Date().getFullYear(),
      (this.selectedMonth || 1) - 1,
      day,
    );

    return date.getDay() === 0;
  }
  isSecondOrFourthSaturday(day: number, monthName?: string): boolean {
    let date: Date;

    if (monthName) {
      date = new Date(`${monthName} ${day}`);
    } else {
      date = new Date(
        this.selectedYear || new Date().getFullYear(),
        (this.selectedMonth || 1) - 1,
        day,
      );
    }

    const isSaturday = date.getDay() === 6;

    const weekNumber = Math.ceil(day / 7);

    return isSaturday && (weekNumber === 2 || weekNumber === 4);
  }

  isHoliday(day: number, monthName: string): boolean {
    const date = new Date(`${monthName} 1`);

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const dayString = String(day).padStart(2, "0");

    const fullDate = `${year}-${month}-${dayString}`;

    return this.holidays.includes(fullDate);
  }

  getDayName(day: number, monthName: string): string {
    const date = new Date(`${monthName} ${day}`);

    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  }

  ngOnInit(): void {
    this.generateYears();

    this.loadHolidays();

    // LOAD MEETINGS FIRST
    this.loadMeetings();
  }

  loadAttendance(): void {
    const currentUser = this.authService.currentUserStore;
    const cardNo = currentUser?.contact?.card_No;
    if (!cardNo) {
      console.error("Card No not found");
      return;
    }

    this.http.get<any[]>("http://localhost:5054/api/Attendance").subscribe({
      next: (res: any[]) => {
        this.years = [
          ...new Set(res.map((x: any) => new Date(x.punchDate).getFullYear())),
        ].sort((a, b) => b - a);

        // FILTER CURRENT USER
        const filteredData = res.filter((x) => x.cardNo == cardNo);
        const groupedByMonth: any = {};

        filteredData.forEach((x) => {
          const date = new Date(x.punchDate);
          const matchesMonth = this.selectedMonth
            ? date.getMonth() + 1 === this.selectedMonth
            : true;

          const matchesYear = this.selectedYear
            ? date.getFullYear() === this.selectedYear
            : true;

          if (!matchesMonth || !matchesYear) {
            return;
          }

          const monthKey = date.toLocaleString("default", {
            month: "long",
            year: "numeric",
          });

          if (!groupedByMonth[monthKey]) {
            groupedByMonth[monthKey] = [];
          }

          groupedByMonth[monthKey].push(x);
        });

        // CONVERT FOR UI
        this.attendanceData = Object.keys(groupedByMonth).map((month) => {
          const records = groupedByMonth[month];

          return {
            monthName: month,

            employeeName: records[0]?.employeeName,
            cardNo: records[0]?.cardNo,

            days: Array.from(
              {
                length: new Date(
                  new Date(records[0].punchDate).getFullYear(),
                  new Date(records[0].punchDate).getMonth() + 1,
                  0,
                ).getDate(),
              },
              (_, i) => i + 1,
            ),

            dailyDetails: Array.from(
              {
                length: new Date(
                  new Date(records[0].punchDate).getFullYear(),
                  new Date(records[0].punchDate).getMonth() + 1,
                  0,
                ).getDate(),
              },
              (_, index) => {
                const dayNumber = index + 1;

                const foundRecord = records.find(
                  (r: any) => new Date(r.punchDate).getDate() === dayNumber,
                );

                return {
                  in: foundRecord?.firstPunch
                    ? new Date(foundRecord.firstPunch).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-",

                  out: foundRecord?.lastPunch
                    ? new Date(foundRecord.lastPunch).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-",

                  total: foundRecord?.workingHours || "-",
                  // meeting: this.getMeetingHours(
                  //   currentUser?.contact?.name,
                  //   dayNumber,
                  //   new Date(records[0].punchDate).getMonth(),
                  //   new Date(records[0].punchDate).getFullYear(),
                  // ),

                  meeting: this.getMeetingHours(
                    currentUser?.contact?.name,
                    dayNumber,
                    new Date(records[0].punchDate).getMonth(),
                    new Date(records[0].punchDate).getFullYear(),
                  ),

                  meetingStart: this.getMeetingStartTime(
                    currentUser?.contact?.name,
                    dayNumber,
                    new Date(records[0].punchDate).getMonth(),
                    new Date(records[0].punchDate).getFullYear(),
                  ),

                  meetingEnd: this.getMeetingEndTime(
                    currentUser?.contact?.name,
                    dayNumber,
                    new Date(records[0].punchDate).getMonth(),
                    new Date(records[0].punchDate).getFullYear(),
                  ),
                };
              },
            ),

            summary: (() => {
              const year = new Date(records[0].punchDate).getFullYear();

              const month = new Date(records[0].punchDate).getMonth();

              const totalMonthDays = new Date(year, month + 1, 0).getDate();

              // STORE UNIQUE HOLIDAYS
              const holidayDates = new Set<number>();

              let extraDays = 0;
              let halfDays = 0;

              // CHECK ALL DAYS
              for (let d = 1; d <= totalMonthDays; d++) {
                const date = new Date(year, month, d);

                const isSunday = date.getDay() === 0;

                const isSaturday = date.getDay() === 6;

                const weekNumber = Math.ceil(d / 7);

                const isSecondOrFourthSaturday =
                  isSaturday && (weekNumber === 2 || weekNumber === 4);

                const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

                const isApiHoliday = this.holidays.includes(fullDate);

                const isHolidayDay =
                  isSunday || isSecondOrFourthSaturday || isApiHoliday;

                // SAVE HOLIDAY ONLY ONCE
                if (isHolidayDay) {
                  holidayDates.add(d);

                  // CHECK WORK ON HOLIDAY
                  const workedOnHoliday = records.some(
                    (r: any) => new Date(r.punchDate).getDate() === d,
                  );

                  if (workedOnHoliday) {
                    extraDays++;
                  }
                }
              }

              const workingPresentDays = [
                ...new Set(
                  records.filter((r: any) => {
                    const day = new Date(r.punchDate).getDate();

                    // REMOVE HOLIDAYS
                    return !holidayDates.has(day);
                  }),
                ),
              ];

              workingPresentDays.forEach((r: any) => {
                if (
                  r.workingHours &&
                  r.workingHours !== "-" &&
                  this.isHalfDay(r.workingHours)
                ) {
                  halfDays++;
                }
              });

              const presentDays = workingPresentDays.length;

              // WORKING DAYS
              const workingDays = totalMonthDays - holidayDates.size;

              // ABSENT ONLY FOR WORKING DAYS
              const absentDays = workingDays - presentDays;

              return {
                totalDays: totalMonthDays,

                workingDays: workingDays,

                presentDays: presentDays,

                extraDays: extraDays,
                halfDays: halfDays,

                paidDays: presentDays + extraDays,

                absentDays: absentDays > 0 ? absentDays : 0,
              };
            })(),
          };
        });
      },

      error: (err) => {
        console.error("Attendance API Error => ", err);
      },
    });
  }

  loadMeetings() {
    this.http.get<any[]>("http://localhost:5054/Meeting/summary").subscribe({
      next: (res) => {
        this.meetingsData = res;
        this.loadAttendance();
      },

      error: (err) => {
        console.error("Meeting API Error => ", err);
      },
    });
  }

  currentMonthName: string = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  loadHolidays() {
    this.holidayService.get().subscribe((data: Holiday[]) => {
      this.holidays = data.map((x: Holiday) => {
        const date = new Date(x.holidayDate);

        const year = date.getFullYear();

        const month = String(date.getMonth() + 1).padStart(2, "0");

        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      });
    });
  }

  generateYears() {
    this.years = [];

    const currentYear = new Date().getFullYear();

    // Show only current year
    this.years.push(currentYear);
  }
  onFilterChange() {
    this.loadAttendance();
  }

  isHalfDay(totalHours: string): boolean {
    if (!totalHours || totalHours === "-") {
      return false;
    }

    const parts = totalHours.split(":");

    const hours = Number(parts[0]);

    const minutes = Number(parts[1]);

    const totalMinutes = hours * 60 + minutes;

    // LESS THAN 9:00
    return totalMinutes < 540;
  }

  getMeetingHours(
    employeeName: string,
    day: number,
    month: number,
    year: number,
  ): string {
    const meetings = this.meetingsData.filter((m: any) => {
      const meetingDate = new Date(m.startTime);

      return (
        m.attendeeName
          ?.toLowerCase()
          .includes(employeeName?.toLowerCase().trim()) &&
        meetingDate.getDate() === day &&
        meetingDate.getMonth() === month &&
        meetingDate.getFullYear() === year
      );
    });

    let totalMinutes = 0;

    meetings.forEach((m: any) => {
      const totalHours = Number(m.totalHours || 0);
      totalMinutes += Math.round(totalHours * 60);
    });

    if (totalMinutes === 0) {
      return "-";
    }

    const hrs = Math.floor(totalMinutes / 60);

    const mins = totalMinutes % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  }

  // calculateDayTotal(officeHours: string, meetingHours: string): string {
  //   const convertToMinutes = (time: string) => {
  //     if (!time || time === "-" || time === "00:00") {
  //       return 0;
  //     }

  //     const parts = time.split(":");

  //     return Number(parts[0]) * 60 + Number(parts[1]);
  //   };

  //   const totalMinutes =
  //     convertToMinutes(officeHours) + convertToMinutes(meetingHours);

  //   if (totalMinutes === 0) {
  //     return "-";
  //   }

  //   const hrs = Math.floor(totalMinutes / 60);

  //   const mins = totalMinutes % 60;

  //   return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  // }

  calculateDayTotal(
    punchIn: string,
    punchOut: string,
    meetingStart: string,
    meetingEnd: string,
  ): string {
    const convertTimeToDate = (time: string): Date | null => {
      if (!time || time === "-") {
        return null;
      }

      const today = new Date();

      const parsed = new Date(`1970-01-01 ${time}`);

      if (isNaN(parsed.getTime())) {
        return null;
      }

      return parsed;
    };

    const inTime = convertTimeToDate(punchIn);

    const outTime = convertTimeToDate(punchOut);

    const meetingStartTime = convertTimeToDate(meetingStart);

    const meetingEndTime = convertTimeToDate(meetingEnd);

    // SMALLER START TIME
    let startTime: Date | null = null;

    if (inTime && meetingStartTime) {
      startTime = inTime < meetingStartTime ? inTime : meetingStartTime;
    } else {
      startTime = inTime || meetingStartTime;
    }

    // GREATER END TIME
    let endTime: Date | null = null;

    if (outTime && meetingEndTime) {
      endTime = outTime > meetingEndTime ? outTime : meetingEndTime;
    } else {
      endTime = outTime || meetingEndTime;
    }

    if (!startTime || !endTime) {
      return "-";
    }

    const totalMinutes = Math.floor(
      (endTime.getTime() - startTime.getTime()) / 60000,
    );

    if (totalMinutes <= 0) {
      return "-";
    }

    const hrs = Math.floor(totalMinutes / 60);

    const mins = totalMinutes % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  }

  getMeetingStartTime(
    employeeName: string,
    day: number,
    month: number,
    year: number,
  ): string {
    const meeting = this.meetingsData.find((m: any) => {
      const meetingDate = new Date(m.startTime);

      return (
        m.attendeeName
          ?.toLowerCase()
          .includes(employeeName?.toLowerCase().trim()) &&
        meetingDate.getDate() === day &&
        meetingDate.getMonth() === month &&
        meetingDate.getFullYear() === year
      );
    });

    if (!meeting?.startTime) {
      return "-";
    }

    return new Date(meeting.startTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  getMeetingEndTime(
    employeeName: string,
    day: number,
    month: number,
    year: number,
  ): string {
    const meeting = this.meetingsData.find((m: any) => {
      const meetingDate = new Date(m.endTime);

      return (
        m.attendeeName
          ?.toLowerCase()
          .includes(employeeName?.toLowerCase().trim()) &&
        meetingDate.getDate() === day &&
        meetingDate.getMonth() === month &&
        meetingDate.getFullYear() === year
      );
    });

    if (!meeting?.endTime) {
      return "-";
    }

    return new Date(meeting.endTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}
