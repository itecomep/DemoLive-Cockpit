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

  selectedMonthTab: "none" | "current" | "previous" | "all" = "current";

  filters = {
    employeeName: "",
  };

  holidays: string[] = ["2026-01-26", "2026-05-01", "2026-10-02"];

  isHoliday(day: number): boolean {
    const month = String(this.selectedMonth).padStart(2, "0");

    const date = String(day).padStart(2, "0");

    const fullDate = `${this.selectedYear}-${month}-${date}`;

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
    private service: HrModuleService,
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

  loadAttendance() {
    this.service.getContactTeams().subscribe((teams: any[]) => {
      const leaderCardNos: string[] = [];

      teams.forEach((team) => {
        team.members?.forEach((m: any) => {
          if (m.contactID === team.leaderID) {
            const cardNo = m.contact?.card_No?.toString().trim();

            if (cardNo && !leaderCardNos.includes(cardNo)) {
              leaderCardNos.push(cardNo);
            }
          }
        });
      });

      this.http.get<any[]>("http://localhost:5054/api/Attendance").subscribe({
        next: (res) => {
          this.originalData = res.map((x: any) => {
            // const empName = x.employeeName?.toLowerCase().trim();

            return {
              ...x,

              isTeamLeader: leaderCardNos.includes(x.cardNo?.toString().trim()),
            };
          });

          console.log("Leader Card Nos:", leaderCardNos);

          console.log("Attendance Data:", this.originalData);

          this.applyFilters();
        },

        error: (err) => {
          console.error(err);
        },
      });
    });
  }

  applyFilters() {
    let filteredData = [...this.originalData];

    // ✅ MONTH FILTER
    if (this.selectedMonthTab !== "all") {
      filteredData = filteredData.filter((item: any) => {
        if (!item.punchDate) {
          return false;
        }

        const date = new Date(item.punchDate);

        return (
          date.getMonth() + 1 == this.selectedMonth &&
          date.getFullYear() == this.selectedYear
        );
      });
    }

    if (this.filters.employeeName?.trim()) {
      const searchText = this.filters.employeeName.toLowerCase().trim();

      const isNumber = !isNaN(Number(searchText));

      filteredData = filteredData.filter((x: any) => {
        const employeeName = x.employeeName?.toString().toLowerCase() || "";

        const cardNo = x.cardNo?.toString().toLowerCase() || "";

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
      filteredData = filteredData.filter((x: any) => x.isTeamLeader === true);
    }
    this.processAttendanceData(filteredData);
  }

processAttendanceData(filteredData: any[]) {

  const groupedEmployees: any = {};

  filteredData.forEach((item: any) => {

    const punchDate = new Date(item.punchDate);

    const month =
      punchDate.toLocaleString('default', {
        month: 'long'
      });

    const year = punchDate.getFullYear();

    // ✅ UNIQUE KEY FOR EACH MONTH
    const employeeKey =
      `${item.cardNo}-${month}-${year}`;

    if (!groupedEmployees[employeeKey]) {

      const totalDays = new Date(
        year,
        punchDate.getMonth() + 1,
        0
      ).getDate();

      groupedEmployees[employeeKey] = {

        name: item.employeeName,

        cardNo: item.cardNo,

        isTeamLeader: item.isTeamLeader,

        monthName: `${month} ${year}`,

        monthNumber: punchDate.getMonth() + 1,

        year: year,

        days: Array.from(
          { length: totalDays },
          (_, i) => i + 1
        ),

        dailyDetails: Array.from(
          { length: totalDays },
          () => ({
            in: "-",
            out: "-",
            total: "-",
          })
        ),

        summary: {
          totalDays: totalDays,
          workingDays: 0,
          presentDays: 0,
          cl: 0,
          absentDays: 0,
        },
      };
    }

    const day = punchDate.getDate();

    groupedEmployees[employeeKey]
      .dailyDetails[day - 1] = {

      in: item.firstPunch
        ? new Date(item.firstPunch)
            .toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
        : "-",

      out: item.lastPunch
        ? new Date(item.lastPunch)
            .toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
        : "-",

      total: item.workingHours || "-",
    };

    groupedEmployees[employeeKey]
      .summary.presentDays++;
  });

  this.attendanceData =
    Object.values(groupedEmployees);

  this.attendanceData.forEach((emp: any) => {

    emp.summary.workingDays =
      emp.summary.presentDays;

    emp.summary.absentDays =
      emp.summary.totalDays -
      emp.summary.presentDays;
  });

  console.log(
    "Processed Attendance:",
    this.attendanceData
  );
}

  resetFilters() {
    this.filters = {
      employeeName: "",
    };

    this.activeTab = "all";

    this.selectedMonthTab = "current";

    this.selectedMonth = new Date().getMonth() + 1;

    this.selectedYear = new Date().getFullYear();

    this.updateDays();

    this.applyFilters();
  }

  changeMonth(type: "previous" | "current" | "all") {
    this.selectedMonthTab = type;

    const now = new Date();

    if (type === "previous") {
      this.selectedMonth = now.getMonth();

      this.selectedYear = now.getFullYear();
    } else if (type === "current") {
      this.selectedMonth = now.getMonth() + 1;

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
    const date = new Date(this.selectedYear, this.selectedMonth - 1, day);

    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  }

  onMonthYearChange() {
    this.selectedMonthTab = "none";

    this.updateDays();

    this.applyFilters();
  }
}
