import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { HrModuleService } from "../hr-module.service";

@Component({
  selector: "app-attendance",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.scss"],
})
export class AttendanceComponent implements OnInit {
  attendanceData: any[] = [];
  originalData: any[] = [];

  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();

  days: number[] = [];

  activeTab: "all" | "team" = "all";

selectedMonthTab: "none" | "current" | "previous" | "next" = "none";

filters = {
  employeeName: "",
  startDate: "",
  endDate: "",
};

holidays: string[] = [
  '2026-01-26',
  '2026-05-01',
  '2026-10-02'
];

isHoliday(day: number): boolean {

  const month = String(this.selectedMonth).padStart(2, '0');

  const date = String(day).padStart(2, '0');

  const fullDate =
    `${this.selectedYear}-${month}-${date}`;

  return this.holidays.includes(fullDate);
}

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

  years: number[] = [2024, 2025, 2026, 2027];

  // constructor(private http: HttpClient) {}
  constructor(
  private http: HttpClient,
  private service: HrModuleService
) {}

  ngOnInit(): void {
    this.updateDays();
    this.loadAttendance();
  }

  updateDays() {
    const totalDays = new Date(
      this.selectedYear,
      this.selectedMonth,
      0,
    ).getDate();

    this.days = Array.from({ length: totalDays }, (_, i) => i + 1);
  }

onMonthChange() {
  this.updateDays();
  this.applyFilters();
}



  // loadAttendance() {
  //   this.http.get<any[]>("http://localhost:5054/api/Attendance").subscribe({
  //     next: (res) => {
  //       this.originalData = res;

  //       // this.processAttendanceData();
  //       this.applyFilters();
  //     },

  //     error: (err) => {
  //       console.error(err);
  //     },
  //   });
  // }

  loadAttendance() {

  this.service.getContactTeams().subscribe((teams: any[]) => {

    const leaderNames: string[] = [];

    teams.forEach((team) => {

      team.members?.forEach((m: any) => {

        if (m.contactID === team.leaderID) {

          const name =
            m.contact?.name?.toLowerCase().trim();

          if (name && !leaderNames.includes(name)) {

            leaderNames.push(name);
          }
        }
      });
    });

    this.http
      .get<any[]>("http://localhost:5054/api/Attendance")
      .subscribe({

        next: (res) => {

          this.originalData = res.map((x: any) => {

            const empName =
              x.employeeName?.toLowerCase().trim();

            return {

              ...x,

              isTeamLeader:
                leaderNames.includes(empName),
            };
          });

          console.log("Leader Names:", leaderNames);

          console.log(
            "Attendance Data:",
            this.originalData
          );

          this.applyFilters();
        },

        error: (err) => {
          console.error(err);
        },
      });
  });
}


//   applyFilters() {

//   let filteredData = this.originalData.filter((item: any) => {

//     if (!item.punchDate) {
//       return false;
//     }

//     const date = new Date(item.punchDate);

//     // Existing Month + Year Filter
//     return (
//       date.getMonth() + 1 == this.selectedMonth &&
//       date.getFullYear() == this.selectedYear
//     );
//   });

//   // 🔍 Employee Search
//   if (this.filters.employeeName) {

//     filteredData = filteredData.filter((x: any) =>
//       x.employeeName
//         ?.toLowerCase()
//         .includes(this.filters.employeeName.toLowerCase())
//     );
//   }

//   // 📅 Start + End Date Filter
//   if (this.filters.startDate && this.filters.endDate) {

//     const from = new Date(this.filters.startDate);
//     const to = new Date(this.filters.endDate);

//     filteredData = filteredData.filter((x: any) => {

//       const punchDate = new Date(x.punchDate);

//       return punchDate >= from && punchDate <= to;
//     });
//   }

//   this.processAttendanceData(filteredData);
// }

applyFilters() {

  let filteredData = this.originalData.filter((item: any) => {

    if (!item.punchDate) {
      return false;
    }

    const date = new Date(item.punchDate);

    // ✅ Existing Month + Year Filter
    return (
      date.getMonth() + 1 == this.selectedMonth &&
      date.getFullYear() == this.selectedYear
    );
  });

  // 🔍 Employee Search
  // if (this.filters.employeeName) {

  //   filteredData = filteredData.filter((x: any) =>

  //     x.employeeName
  //       ?.toLowerCase()
  //       .includes(
  //         this.filters.employeeName.toLowerCase()
  //       )
  //   );
  // }

  if (this.filters.employeeName?.trim()) {

  const searchText =
    this.filters.employeeName
      .toLowerCase()
      .trim();

  const isNumber =
    !isNaN(Number(searchText));

  filteredData = filteredData.filter((x: any) => {

    const employeeName =
      x.employeeName
        ?.toString()
        .toLowerCase() || "";

    const cardNo =
      x.cardNo
        ?.toString()
        .toLowerCase() || "";

    /* 🔢 Exact match for numbers */
    if (isNumber) {

      return cardNo === searchText;
    }

    /* 🔤 Partial match for names */
    return employeeName.includes(searchText);
  });
}

  // 👑 Team Leader Filter
  if (this.activeTab === "team") {

    filteredData = filteredData.filter(
      (x: any) => x.isTeamLeader === true
    );
  }

  // 📅 Start + End Date Filter
  if (
    this.filters.startDate &&
    this.filters.endDate
  ) {

    const from = new Date(this.filters.startDate);

    const to = new Date(this.filters.endDate);

    // 🔥 Normalize Time
    from.setHours(0, 0, 0, 0);

    to.setHours(23, 59, 59, 999);

    filteredData = filteredData.filter((x: any) => {

      const punchDate = new Date(x.punchDate);

      return (
        punchDate >= from &&
        punchDate <= to
      );
    });
  }

  this.processAttendanceData(filteredData);
}

  processAttendanceData(filteredData: any[]) {

  const groupedEmployees: any = {};

  filteredData.forEach((item: any) => {

    const employeeKey =
      item.employeeId || item.cardNo || item.employeeName;

    if (!groupedEmployees[employeeKey]) {

      groupedEmployees[employeeKey] = {

        name: item.employeeName,
        cardNo: item.cardNo,
          isTeamLeader: item.isTeamLeader,

        dailyDetails: Array.from(
          { length: this.days.length },
          () => ({
            in: "-",
            out: "-",
            total: "-",
          })
        ),

        summary: {
          totalDays: this.days.length,
          workingDays: 0,
          presentDays: 0,
          cl: 0,
          absentDays: 0,
        },
      };
    }

    const date = new Date(item.punchDate);

    const day = date.getDate();

    if (day <= this.days.length) {

      groupedEmployees[employeeKey].dailyDetails[day - 1] = {

        in: item.firstPunch
          ? new Date(item.firstPunch).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",

        out: item.lastPunch
          ? new Date(item.lastPunch).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",

        total: item.workingHours || "-",
      };

      groupedEmployees[employeeKey].summary.presentDays++;
    }
  });

  this.attendanceData = Object.values(groupedEmployees);

  this.attendanceData.forEach((emp: any) => {

    emp.summary.workingDays = emp.summary.presentDays;

    emp.summary.absentDays =
      emp.summary.totalDays - emp.summary.presentDays;
  });

  console.log("Filtered Attendance:", this.attendanceData);
}


  resetFilters() {

  this.filters = {
    employeeName: "",
    startDate: "",
    endDate: "",
  };

  this.activeTab = "all";

  this.selectedMonthTab = "none";

  this.selectedMonth = new Date().getMonth() + 1;

  this.selectedYear = new Date().getFullYear();

  this.updateDays();

  this.applyFilters();
}

changeMonth(type: "previous" | "current" | "next") {

  this.selectedMonthTab = type;

  const now = new Date();

  if (type === "previous") {

    this.selectedMonth = now.getMonth();

    this.selectedYear = now.getFullYear();
  }

  else if (type === "current") {

    this.selectedMonth = now.getMonth() + 1;

    this.selectedYear = now.getFullYear();
  }

  else {

    this.selectedMonth = now.getMonth() + 2;

    this.selectedYear = now.getFullYear();
  }

  this.updateDays();

  this.applyFilters();
}

  onYearChange() {
  this.updateDays();
  this.applyFilters();
}

  isSunday(day: number): boolean {
    const date = new Date(this.selectedYear, this.selectedMonth - 1, day);

    return date.getDay() === 0;
  }

  isSecondOrFourthSaturday(day: number): boolean {
    const date = new Date(this.selectedYear, this.selectedMonth - 1, day);

    const isSaturday = date.getDay() === 6;

    const weekNumber = Math.ceil(day / 7);

    return isSaturday && (weekNumber === 2 || weekNumber === 4);
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

  
}
