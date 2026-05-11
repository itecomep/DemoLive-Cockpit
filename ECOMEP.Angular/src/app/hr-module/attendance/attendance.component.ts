import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

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

  constructor(private http: HttpClient) {}

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
    this.processAttendanceData();
  }

  loadAttendance() {
    this.http.get<any[]>("https://localhost:7024/api/Attendance").subscribe({
      next: (res) => {
        this.originalData = res;

        this.processAttendanceData();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  processAttendanceData() {
    const groupedEmployees: any = {};

    const filteredData = this.originalData.filter((item: any) => {
      if (!item.punchDate) {
        return false;
      }

      const date = new Date(item.punchDate);

      return (
        date.getMonth() + 1 == this.selectedMonth &&
        date.getFullYear() == this.selectedYear
      );
    });

    filteredData.forEach((item: any) => {
      const employeeKey = item.employeeId || item.cardNo || item.employeeName;

      if (!groupedEmployees[employeeKey]) {
        groupedEmployees[employeeKey] = {
          name: item.employeeName,
          cardNo: item.cardNo,

          dailyDetails: Array.from({ length: this.days.length }, () => ({
            in: "-",
            out: "-",
            total: "-",
          })),

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

      emp.summary.absentDays = emp.summary.totalDays - emp.summary.presentDays;
    });

    console.log("Filtered Attendance:", this.attendanceData);
  }

  onYearChange() {
    this.updateDays();
    this.processAttendanceData();
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
}
