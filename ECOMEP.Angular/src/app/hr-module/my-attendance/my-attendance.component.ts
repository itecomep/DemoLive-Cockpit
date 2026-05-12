import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";

import { HeaderComponent } from "../../mcv-header/components/header/header.component";

import { AuthService } from "src/app/auth/services/auth.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HolidayMasterService } from '../../leave/services/holiday-master-api.service';
import { Holiday } from '../../leave/models/holiday.model';

@Component({
  selector: "app-my-attendance",
  standalone: true,
  imports: [CommonModule, MatTabsModule, HeaderComponent, HttpClientModule],
  templateUrl: "./my-attendance.component.html",
  styleUrls: ["./my-attendance.component.scss"],
})
export class MyAttendanceComponent implements OnInit {
  days: number[] = [];

  attendanceData: any[] = [];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
      private holidayService: HolidayMasterService

  ) {}

  selectedMonthTab: "none" | "current" | "previous" | "next" = "current";

selectedMonth: number = new Date().getMonth() + 1;

selectedYear: number = new Date().getFullYear();

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
    this.selectedYear,
    this.selectedMonth - 1,
    day
  );

  return date.getDay() === 0;
}

isSecondOrFourthSaturday(day: number): boolean {

  const date = new Date(
    this.selectedYear,
    this.selectedMonth - 1,
    day
  );

  const isSaturday = date.getDay() === 6;

  const weekNumber = Math.ceil(day / 7);

  return isSaturday && (weekNumber === 2 || weekNumber === 4);
}

// isHoliday(day: number): boolean {

//   const month =
//     String(this.selectedMonth).padStart(2, '0');

//   const date =
//     String(day).padStart(2, '0');

//   const fullDate =
//     `${this.selectedYear}-${month}-${date}`;

//   return this.holidays.includes(fullDate);
// }

isHoliday(day: number, monthName: string): boolean {

  const date = new Date(`${monthName} 1`);

  const year = date.getFullYear();

  const month =
    String(date.getMonth() + 1).padStart(2, '0');

  const dayString =
    String(day).padStart(2, '0');

  const fullDate =
    `${year}-${month}-${dayString}`;

  return this.holidays.includes(fullDate);
}

getDayName(day: number): string {

  const date = new Date(
    this.selectedYear,
    this.selectedMonth - 1,
    day
  );

  return date.toLocaleDateString('en-US', {
    weekday: 'short'
  });
}

  // ngOnInit(): void {
  //   this.loadAttendance();
  // }

  ngOnInit(): void {

  this.loadHolidays();

  this.loadAttendance();

}

  loadAttendance(): void {
    const currentUser = this.authService.currentUserStore;

    const cardNo = currentUser?.contact?.card_No;

    console.log("Logged In Card No => ", cardNo);

    if (!cardNo) {
      console.error("Card No not found");
      return;
    }

    this.http.get<any[]>("http://localhost:5054/api/Attendance").subscribe({
      next: (res: any[]) => {
        console.log("Attendance Response => ", res);

        // FILTER CURRENT USER
        const filteredData = res.filter((x) => x.cardNo == cardNo);
        const groupedByMonth: any = {};

filteredData.forEach((x) => {

  const date = new Date(x.punchDate);
  const currentMonth =
  new Date().getMonth() + 1;

const currentYear =
  new Date().getFullYear();

// ✅ SHOW CURRENT + PREVIOUS MONTH
const isCurrentMonth =
  date.getMonth() + 1 === currentMonth &&
  date.getFullYear() === currentYear;

const isPreviousMonth =
  date.getMonth() + 1 === currentMonth - 1 &&
  date.getFullYear() === currentYear;

if (!isCurrentMonth && !isPreviousMonth) {
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
                };
              },
            ),

            summary: {
              totalDays: records.length,

              workingDays: records.length,

              presentDays: records.length,

              cl: 0,

              absentDays: 0,
            },
          };
        });

        console.log("Final Attendance Data => ", this.attendanceData);
      },

      error: (err) => {
        console.error("Attendance API Error => ", err);
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

      const month =
        String(date.getMonth() + 1).padStart(2, '0');

      const day =
        String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    });

    console.log('Holiday Dates => ', this.holidays);

  });

}
}
