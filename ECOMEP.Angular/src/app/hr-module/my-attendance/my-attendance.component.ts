import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";

import { HeaderComponent } from "../../mcv-header/components/header/header.component";

import { AuthService } from "src/app/auth/services/auth.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HolidayMasterService } from '../../leave/services/holiday-master-api.service';
import { Holiday } from '../../leave/models/holiday.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: "app-my-attendance",
  standalone: true,
  imports: [CommonModule, MatTabsModule, HeaderComponent, HttpClientModule, FormsModule],
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


selectedMonth: number | null = null;


selectedYear: number | null = null;

months = [
  { id: 1, name: 'January' },
  { id: 2, name: 'February' },
  { id: 3, name: 'March' },
  { id: 4, name: 'April' },
  { id: 5, name: 'May' },
  { id: 6, name: 'June' },
  { id: 7, name: 'July' },
  { id: 8, name: 'August' },
  { id: 9, name: 'September' },
  { id: 10, name: 'October' },
  { id: 11, name: 'November' },
  { id: 12, name: 'December' }
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
  day
);

  return date.getDay() === 0;
}
isSecondOrFourthSaturday(
  day: number,
  monthName?: string
): boolean {

  let date: Date;

  if (monthName) {

    date = new Date(`${monthName} ${day}`);

  } else {

    date = new Date(
      this.selectedYear || new Date().getFullYear(),
      (this.selectedMonth || 1) - 1,
      day
    );
  }

  const isSaturday = date.getDay() === 6;

  const weekNumber = Math.ceil(day / 7);

  return (
    isSaturday &&
    (weekNumber === 2 || weekNumber === 4)
  );
}


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



getDayName(day: number, monthName: string): string {

  const date = new Date(`${monthName} ${day}`);

  return date.toLocaleDateString('en-US', {
    weekday: 'short'
  });
}

ngOnInit(): void {

  this.generateYears();

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

        this.years = [
  ...new Set(
    res.map((x: any) =>
      new Date(x.punchDate).getFullYear()
    )
  )
].sort((a, b) => b - a);

        // FILTER CURRENT USER
        const filteredData = res.filter((x) => x.cardNo == cardNo);
        const groupedByMonth: any = {};

filteredData.forEach((x) => {

  const date = new Date(x.punchDate);
  const matchesMonth =
  this.selectedMonth
    ? date.getMonth() + 1 === this.selectedMonth
    : true;

const matchesYear =
  this.selectedYear
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
                };
              },
            ),





// summary: (() => {

//   const year =
//     new Date(records[0].punchDate).getFullYear();

//   const month =
//     new Date(records[0].punchDate).getMonth();

//   const totalMonthDays =
//     new Date(year, month + 1, 0).getDate();

//   let holidayCount = 0;

//   let extraDays = 0;

//   for (let d = 1; d <= totalMonthDays; d++) {

//     const date = new Date(year, month, d);

//     const isSunday =
//       date.getDay() === 0;

//     const isSaturday =
//       date.getDay() === 6;

//     const weekNumber =
//       Math.ceil(d / 7);

//     const isSecondOrFourthSaturday =
//       isSaturday &&
//       (weekNumber === 2 || weekNumber === 4);

//     const fullDate =
//       `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

//     const isApiHoliday =
//       this.holidays.includes(fullDate);

//     const isHolidayDay =
//       isSunday ||
//       isSecondOrFourthSaturday ||
//       isApiHoliday;

//     if (isHolidayDay) {

//       holidayCount++;

//       // CHECK IF EMPLOYEE WORKED
//       const workedOnHoliday =
//         records.some(
//           (r: any) =>
//             new Date(r.punchDate).getDate() === d
//         );

//       if (workedOnHoliday) {
//         extraDays++;
//       }
//     }
//   }

 

//   // PRESENT DAYS ONLY FOR WORKING DAYS
// const uniquePresentDays = [
//   ...new Set(
//     records
//       .filter((r: any) => {

//         const date =
//           new Date(r.punchDate);

//         const day =
//           date.getDate();

//         const isSunday =
//           date.getDay() === 0;

//         const isSaturday =
//           date.getDay() === 6;

//         const weekNumber =
//           Math.ceil(day / 7);

//         const isSecondOrFourthSaturday =
//           isSaturday &&
//           (weekNumber === 2 || weekNumber === 4);

//         const fullDate =
//           `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

//         const isApiHoliday =
//           this.holidays.includes(fullDate);

//         // REMOVE HOLIDAY WORK FROM PRESENT DAYS
//         return !(
//           isSunday ||
//           isSecondOrFourthSaturday ||
//           isApiHoliday
//         );

//       })
//       .map((r: any) =>
//         new Date(r.punchDate).getDate()
//       )
//   )
// ];

// const presentDays =
//   uniquePresentDays.length;

//   const workingDays =
//     totalMonthDays - holidayCount;

//  // ABSENT ONLY FROM WORKING DAYS
// const absentDays =
//   workingDays - presentDays;

//   return {

//     totalDays: totalMonthDays,

//     workingDays: workingDays,

//     presentDays: presentDays,

//     extraDays: extraDays,

//     absentDays:
//       absentDays > 0
//         ? absentDays
//         : 0,
//   };

// })(),




summary: (() => {

  const year =
    new Date(records[0].punchDate).getFullYear();

  const month =
    new Date(records[0].punchDate).getMonth();

  const totalMonthDays =
    new Date(year, month + 1, 0).getDate();

  // STORE UNIQUE HOLIDAYS
  const holidayDates = new Set<number>();

  let extraDays = 0;

  // CHECK ALL DAYS
  for (let d = 1; d <= totalMonthDays; d++) {

    const date = new Date(year, month, d);

    const isSunday =
      date.getDay() === 0;

    const isSaturday =
      date.getDay() === 6;

    const weekNumber =
      Math.ceil(d / 7);

    const isSecondOrFourthSaturday =
      isSaturday &&
      (weekNumber === 2 || weekNumber === 4);

    const fullDate =
      `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    const isApiHoliday =
      this.holidays.includes(fullDate);

    const isHolidayDay =
      isSunday ||
      isSecondOrFourthSaturday ||
      isApiHoliday;

    // SAVE HOLIDAY ONLY ONCE
    if (isHolidayDay) {

      holidayDates.add(d);

      // CHECK WORK ON HOLIDAY
      const workedOnHoliday =
        records.some(
          (r: any) =>
            new Date(r.punchDate).getDate() === d
        );

      if (workedOnHoliday) {

        extraDays++;

      }
    }
  }

  // PRESENT ONLY FOR WORKING DAYS
  const presentDays = [
    ...new Set(

      records
        .filter((r: any) => {

          const day =
            new Date(r.punchDate).getDate();

          // REMOVE HOLIDAYS
          return !holidayDates.has(day);

        })
        .map((r: any) =>
          new Date(r.punchDate).getDate()
        )

    )
  ].length;

  // WORKING DAYS
  const workingDays =
    totalMonthDays - holidayDates.size;

  // ABSENT ONLY FOR WORKING DAYS
  const absentDays =
    workingDays - presentDays;

  return {

    totalDays: totalMonthDays,

    workingDays: workingDays,

    presentDays: presentDays,

    extraDays: extraDays,

    absentDays:
      absentDays > 0
        ? absentDays
        : 0,
  };

})(),



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

// generateYears() {

//   const currentYear = new Date().getFullYear();

//   for (let i = currentYear - 5; i <= currentYear + 5; i++) {
//     this.years.push(i);
//   }

// }



// generateYears() {

//   this.years = [];

//   const currentYear = new Date().getFullYear();

//   // Start from 2020
//   const startYear = 2020;

//   // Automatically till current year
//   for (let year = startYear; year <= currentYear; year++) {

//     this.years.push(year);

//   }

// }

generateYears() {

  this.years = [];

  const currentYear = new Date().getFullYear();

  // Show only current year
  this.years.push(currentYear);

}
onFilterChange() {
  this.loadAttendance();
}
}
