import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { forkJoin } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { HrModuleService } from "../hr-module.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  presentToday = 0;
  absentToday = 0;
  leaveToday = 0;
  lateToday = 0;
  meetingsToday = 0;

  attendanceData: any[] = [];

  /* POPUP */

  showEmployeePopup = false;

  popupTitle = "";

  popupEmployees: string[] = [];

  /* EMPLOYEE LISTS */

  presentEmployees: string[] = [];

  absentEmployees: string[] = [];

  leaveEmployees: string[] = [];

  lateEmployees: string[] = [];

  meetingEmployees: string[] = [];
  departmentStats: any[] = [];

  constructor(
    private service: HrModuleService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    forkJoin({
      attendance: this.http.get<any[]>(`${environment.apiPath}/api/Attendance`),

      meetings: this.service.getMeetings(),

      leaves: this.service.getLeaves(),

      teams: this.service.getContactTeams(),

      appointments: this.http.get<any[]>(
        `${environment.apiPath}/ContactAppointment`,
      ),
      departments: this.http.get<any[]>(`${environment.apiPath}/Department`),
    }).subscribe({
      next: ({
        attendance,
        meetings,
        leaves,
        teams,
        appointments,
        departments,
      }) => {
        const today = new Date().toISOString().split("T")[0];

        /* =========================================
           MAP ATTENDANCE SAME AS ABSENTS PAGE
        ========================================== */

        this.attendanceData = attendance.map((x: any) => {
          let teamMemberName = x.employeeName;

          teams.forEach((team: any) => {
            team.members?.forEach((m: any) => {
              const memberCardNo = m.contact?.card_No
                ?.toString()
                .replace(/\s+/g, "")
                .toLowerCase();

              const attendanceCardNo = x.cardNo
                ?.toString()
                .replace(/\s+/g, "")
                .toLowerCase();

              if (memberCardNo === attendanceCardNo) {
                teamMemberName = m.contact?.name || x.employeeName;
              }
            });
          });

          return {
            ...x,
            employeeName: teamMemberName,
          };
        });

        /* =========================================
           TODAY ATTENDANCE
        ========================================== */

        const todayAttendance = this.attendanceData.filter((x: any) => {
          if (!x.punchDate) {
            return false;
          }

          const punchDate = new Date(x.punchDate).toISOString().split("T")[0];

          return punchDate === today;
        });

        /* =========================================
           PRESENT TODAY
        ========================================== */

        const presentEmployeesData = todayAttendance.filter((x: any) => {
          return x.firstPunch;
        });

        this.presentToday = presentEmployeesData.length;

        this.presentEmployees = [
          ...new Set(
            presentEmployeesData.map((x: any) => x.employeeName || x.cardNo),
          ),
        ];

        /* =========================================
           LATE TODAY
        ========================================== */

        const lateEmployeesData = todayAttendance.filter((x: any) => {
          if (!x.firstPunch) {
            return false;
          }

          const punchTime = new Date(x.firstPunch);

          const hour = punchTime.getHours();

          const minute = punchTime.getMinutes();

          return hour > 10 || (hour === 10 && minute > 30);
        });

        this.lateToday = lateEmployeesData.length;

        this.lateEmployees = [
          ...new Set(
            lateEmployeesData.map((x: any) => x.employeeName || x.cardNo),
          ),
        ];

        // =========================================
        //    ABSENT TODAY
        // ========================================= *

        const allEmployeesMap = new Map<string, any>();

        teams.forEach((team: any) => {
          team.members?.forEach((m: any) => {
            const cardNo = m.contact?.card_No
              ?.toString()
              .replace(/\s+/g, "")
              .toLowerCase();

            if (cardNo) {
              allEmployeesMap.set(cardNo, {
                name: m.contact?.name,
                cardNo: m.contact?.card_No,
              });
            }
          });
        });

        const absentEmployeesData: any[] = [];

        allEmployeesMap.forEach((emp: any, cardNo: string) => {
          const todayRecord = todayAttendance.find((x: any) => {
            const attendanceCardNo = x.cardNo
              ?.toString()
              .replace(/\s+/g, "")
              .toLowerCase();

            return attendanceCardNo === cardNo;
          });

          if (!todayRecord || !todayRecord.firstPunch) {
            absentEmployeesData.push(emp);
          }
        });

        this.absentToday = absentEmployeesData.length;

        this.absentEmployees = absentEmployeesData.map(
          (x: any) => x.name || x.cardNo,
        );

        // /* =========================================
        //   DEPARTMENT COUNTS
        // ========================================= */

        // const groupedDepartments: any = {};

        // appointments.forEach((x: any) => {
        //   const departmentName = x.department?.title;

        //   if (!departmentName) {
        //     return;
        //   }

        //   if (!groupedDepartments[departmentName]) {
        //     groupedDepartments[departmentName] = 0;
        //   }

        //   groupedDepartments[departmentName]++;
        // });

        // this.departmentStats = Object.keys(groupedDepartments)
        //   .map((key) => ({
        //     department: key,
        //     count: groupedDepartments[key],
        //   }))
        //   .sort((a, b) => b.count - a.count);

        /* =========================================
   DEPARTMENT COUNTS
========================================= */

        const groupedDepartments: any = {};

        /* INITIALIZE ALL DEPARTMENTS WITH 0 */

        departments.forEach((dept: any) => {
          groupedDepartments[dept.title] = 0;
        });

        /* COUNT EMPLOYEES */

        appointments.forEach((x: any) => {
          const departmentName = x.department?.title;

          if (!departmentName) {
            return;
          }

          groupedDepartments[departmentName]++;
        });

        /* CONVERT TO ARRAY */

        this.departmentStats = Object.keys(groupedDepartments)
          .map((key) => ({
            department: key,
            count: groupedDepartments[key],
          }))
          .sort((a, b) => b.count - a.count);

        /* =========================================
           LEAVES TODAY
        ========================================== */

        const todayLeaves = leaves.filter((x: any) => {
          const start = new Date(x.startDate).toISOString().split("T")[0];

          const end = new Date(x.endDate).toISOString().split("T")[0];

          return (
            today >= start &&
            today <= end &&
            (x.statusFlag === 1 || x.statusFlag === 0)
          );
        });

        this.leaveToday = todayLeaves.length;

        this.leaveEmployees = [
          ...new Set(todayLeaves.map((x: any) => x.employeeName)),
        ];

        /* =========================================
           MEETINGS TODAY
        ========================================== */

        const todayMeetings = meetings.filter((x: any) => {
          if (!x.startTime) {
            return false;
          }

          const meetingDate = new Date(x.startTime).toISOString().split("T")[0];

          return meetingDate === today;
        });

        this.meetingsToday = todayMeetings.length;

        const groupedMeetings: any = {};

        todayMeetings.forEach((x: any) => {
          const empName = x.attendeeName || x.userName || x.userId || "Unknown";

          if (!groupedMeetings[empName]) {
            groupedMeetings[empName] = 0;
          }

          groupedMeetings[empName]++;
        });

        this.meetingEmployees = Object.keys(groupedMeetings).map((name) => {
          const total = groupedMeetings[name];

          return total > 1 ? `${name} (${total})` : name;
        });
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  openEmployeePopup(type: string) {
    this.showEmployeePopup = true;

    if (type === "present") {
      this.popupTitle = "Present Employees";

      this.popupEmployees = this.presentEmployees;
    }

    if (type === "absent") {
      this.popupTitle = "Absent Employees";

      this.popupEmployees = this.absentEmployees;
    }

    if (type === "leave") {
      this.popupTitle = "Employees On Leave";

      this.popupEmployees = this.leaveEmployees;
    }

    if (type === "late") {
      this.popupTitle = "Late Employees";

      this.popupEmployees = this.lateEmployees;
    }

    if (type === "meeting") {
      this.popupTitle = "Meeting Employees";

      this.popupEmployees = this.meetingEmployees;
    }
  }

  closePopup() {
    this.showEmployeePopup = false;
  }
}
