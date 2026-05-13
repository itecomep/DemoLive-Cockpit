import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { HrModuleService } from "../hr-module.service";
import { HolidayMasterService } from "../../leave/services/holiday-master-api.service";
import { Holiday } from "../../leave/models/holiday.model";
import { forkJoin } from "rxjs";
import { MeetingSummary } from "../hr-module.service";

@Component({
  selector: "app-attendance",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.scss"],
})
export class AttendanceComponent implements OnInit {
  meetings: MeetingSummary[] = [];
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

  holidays: string[] = [];

  isHoliday(day: number, monthNumber?: number, year?: number): boolean {
    const month = String(monthNumber || this.selectedMonth).padStart(2, "0");

    const date = String(day).padStart(2, "0");

    const fullDate = `${year || this.selectedYear}-${month}-${date}`;

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

  years: number[] = [];
  constructor(
    private http: HttpClient,
    private service: HrModuleService,
    private holidayService: HolidayMasterService,
  ) {}

  ngOnInit(): void {
    this.updateDays();
    this.loadHolidays();
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
    forkJoin({
      teams: this.service.getContactTeams(),
      meetings: this.service.getMeetings(),
      attendance: this.http.get<any[]>("http://localhost:5054/api/Attendance"),
    }).subscribe({
      next: ({ teams, meetings, attendance }) => {
        this.meetings = meetings;

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

        this.originalData = attendance.map((x: any) => {
          return {
            ...x,

            isTeamLeader: leaderCardNos.includes(x.cardNo?.toString().trim()),
          };
        });

        // YEARS
        const uniqueYears = [
          ...new Set(
            attendance
              .filter((x: any) => x.punchDate)
              .map((x: any) => new Date(x.punchDate).getFullYear()),
          ),
        ];

        this.years = uniqueYears.sort((a, b) => a - b);

        if (this.years.length > 0) {
          this.selectedYear = Math.max(...this.years);
        }

        this.applyFilters();
      },

      error: (err) => {
        console.error(err);
      },
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

        if (isNumber) {
          return cardNo === searchText;
        }

        return employeeName.includes(searchText);
      });
    }

    if (this.activeTab === "team") {
      filteredData = filteredData.filter((x: any) => x.isTeamLeader === true);
    }
    this.processAttendanceData(filteredData);
  }

  processAttendanceData(filteredData: any[]) {
    const groupedEmployees: any = {};

    filteredData.forEach((item: any) => {
      const punchDate = new Date(item.punchDate);

      const month = punchDate.toLocaleString("default", {
        month: "long",
      });

      const year = punchDate.getFullYear();

      const employeeKey = `${item.cardNo}-${month}-${year}`;

      if (!groupedEmployees[employeeKey]) {
        const totalDays = new Date(year, punchDate.getMonth() + 1, 0).getDate();

        groupedEmployees[employeeKey] = {
          name: item.employeeName,

          cardNo: item.cardNo,

          isTeamLeader: item.isTeamLeader,

          monthName: `${month} ${year}`,

          monthNumber: punchDate.getMonth() + 1,

          year: year,

          days: Array.from({ length: totalDays }, (_, i) => i + 1),

          dailyDetails: Array.from({ length: totalDays }, () => ({
            in: "-",
            out: "-",
            total: "-",
            meetingStartTime: "-",
            meetingEndTime: "-",
            meetingHours: "-",
            grandTotal: "-",
          })),

          summary: {
            totalDays: totalDays,
            workingDays: 0,
            presentDays: 0,
            extraWorkingDays: 0,
            absentDays: 0,
          },
        };
      }

      const day = punchDate.getDate();

      const workingMinutes = item.workingHours
        ? this.convertTimeToMinutes(item.workingHours)
        : 0;

      const meetingMinutes =
        item.meetingHours > 0 ? Math.round(item.meetingHours * 60) : 0;

      const grandTotalMinutes = workingMinutes + meetingMinutes;

      // groupedEmployees[employeeKey].dailyDetails[day - 1] = {
      //   in: item.firstPunch
      //     ? new Date(item.firstPunch).toLocaleTimeString([], {
      //         hour: "2-digit",
      //         minute: "2-digit",
      //       })
      //     : "-",

      //   out: item.lastPunch
      //     ? new Date(item.lastPunch).toLocaleTimeString([], {
      //         hour: "2-digit",
      //         minute: "2-digit",
      //       })
      //     : "-",

      //   total: item.workingHours || "-",

      //   meetingHours:
      //     item.meetingHours > 0
      //       ? this.formatMinutes(Math.round(item.meetingHours * 60))
      //       : "-",

      //   grandTotal: this.formatMinutes(grandTotalMinutes),
      // };

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

        meetingStartTime: item.meetingStartTime
          ? new Date(item.meetingStartTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",

        meetingEndTime: item.meetingEndTime
          ? new Date(item.meetingEndTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",

        meetingHours:
          item.meetingHours > 0
            ? this.formatMinutes(Math.round(item.meetingHours * 60))
            : "-",

        grandTotal: this.formatMinutes(grandTotalMinutes),
      };
      groupedEmployees[employeeKey].summary.presentDays++;
    });

    this.attendanceData = Object.values(groupedEmployees);

    this.attendanceData.forEach((emp: any) => {
      let workingDays = 0;

      for (let day = 1; day <= emp.summary.totalDays; day++) {
        const currentDate = new Date(emp.year, emp.monthNumber - 1, day);
        const isSunday = currentDate.getDay() === 0;
        const isHoliday = this.isHoliday(day, emp.monthNumber, emp.year);
        const weekNumber = Math.ceil(day / 7);
        const isSecondOrFourthSaturday =
          currentDate.getDay() === 6 && (weekNumber === 2 || weekNumber === 4);

        if (!isSunday && !isHoliday && !isSecondOrFourthSaturday) {
          workingDays++;
        }
      }

      emp.summary.workingDays = workingDays;

      let actualPresentDays = 0;
      let extraWorkingDays = 0;
      let halfDays = 0;

      emp.dailyDetails.forEach((d: any, index: number) => {
        const day = index + 1;
        const currentDate = new Date(emp.year, emp.monthNumber - 1, day);
        const isSunday = currentDate.getDay() === 0;
        const isHoliday = this.isHoliday(day, emp.monthNumber, emp.year);
        const weekNumber = Math.ceil(day / 7);
        const isSecondOrFourthSaturday =
          currentDate.getDay() === 6 && (weekNumber === 2 || weekNumber === 4);
        const isNonWorkingDay =
          isSunday || isHoliday || isSecondOrFourthSaturday;

        // if (!isNonWorkingDay && d.in !== "-") {
        //   actualPresentDays++;
        // }

        // if (isNonWorkingDay && d.in !== "-") {
        //   extraWorkingDays++;
        // }

        if (!isNonWorkingDay && d.in !== "-") {
          actualPresentDays++;

          // HALF DAY COUNT
          if (d.total !== "-" && this.isHalfDay(d.total)) {
            halfDays++;
          }
        }

        if (isNonWorkingDay && d.in !== "-") {
          extraWorkingDays++;
        }
      });

      emp.summary = {
        ...emp.summary,
        presentDays: actualPresentDays,
        extraWorkingDays: extraWorkingDays,
        paidDays: actualPresentDays + extraWorkingDays,
        halfDays: halfDays,
        absentDays: workingDays - actualPresentDays,
      };
    });
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

  isSunday(day: number, month?: number, year?: number): boolean {
    const date = new Date(
      year || this.selectedYear,
      (month || this.selectedMonth) - 1,
      day,
    );

    return date.getDay() === 0;
  }

  isSecondOrFourthSaturday(
    day: number,
    month?: number,
    year?: number,
  ): boolean {
    const date = new Date(
      year || this.selectedYear,
      (month || this.selectedMonth) - 1,
      day,
    );

    const isSaturday = date.getDay() === 6;

    const weekNumber = Math.ceil(day / 7);

    return isSaturday && (weekNumber === 2 || weekNumber === 4);
  }

  getDayName(day: number, month?: number, year?: number): string {
    const date = new Date(
      year || this.selectedYear,
      (month || this.selectedMonth) - 1,
      day,
    );

    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  }

  onMonthYearChange() {
    this.selectedMonthTab = "none";

    this.updateDays();

    this.applyFilters();
  }

  loadHolidays() {
    this.holidayService.get().subscribe((data: Holiday[]) => {
      this.holidays = data.map((x: Holiday) => {
        const date = new Date(x.holidayDate);

        const year = date.getFullYear();

        const month = String(date.getMonth() + 1).padStart(2, "0");

        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      });

      console.log("Holiday Dates => ", this.holidays);
    });
  }

  isHalfDay(totalHours: string): boolean {
    if (!totalHours || totalHours === "-") {
      return false;
    }

    const parts = totalHours.split(":");

    const hours = Number(parts[0]);

    const minutes = Number(parts[1]);

    const totalMinutes = hours * 60 + minutes;

    // 8 HOURS 30 MINUTES
    return totalMinutes < 540;
  }

  convertTimeToMinutes(time: string): number {
    if (!time || time === "-") {
      return 0;
    }

    const parts = time.split(":");

    const hours = Number(parts[0]);

    const minutes = Number(parts[1]);

    return hours * 60 + minutes;
  }

  formatMinutes(totalMinutes: number): string {
    if (!totalMinutes || totalMinutes <= 0) {
      return "-";
    }

    const hours = Math.floor(totalMinutes / 60);

    const minutes = totalMinutes % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  }
}
