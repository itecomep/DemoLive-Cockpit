import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";

import { HeaderComponent } from "../../mcv-header/components/header/header.component";

import { AuthService } from "src/app/auth/services/auth.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";

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
  ) {}

  ngOnInit(): void {
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

        // GROUP BY MONTH
        const groupedByMonth: any = {};

        filteredData.forEach((x) => {
          const date = new Date(x.punchDate);

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
}
