import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { HrModuleService } from "../hr-module.service";

@Component({
  selector: "app-absents",
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: "./absents.component.html",
  styleUrls: ["./absents.component.scss"],
})
export class AbsentsComponent implements OnInit {
  selectedMonth: number = new Date().getMonth() + 1;
  selectedDate: string = "";

  selectedYear: number = new Date().getFullYear();

  filters = {
    employeeName: "",
  };

  @ViewChild("profileDialog") profileDialog!: TemplateRef<any>;
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

  attendanceData: any[] = [];
  leaderCardNos: string[] = [];

  selectedTab = "today";

  tabs = [
    { key: "today", label: "Today" },
    { key: "twoDays", label: "2 Days" },
    { key: "threeDays", label: "3 Days" },
    { key: "fourDays", label: "4 Days" },
    { key: "fiveDays", label: "5 Days" },
    { key: "sixDays", label: "6 Days" },
    { key: "sevenDays", label: "7 Days" },
  ];

  absentGroups: any = {
    today: [],
    twoDays: [],
    threeDays: [],
    fourDays: [],
    fiveDays: [],
    sixDays: [],
    sevenDays: [],
  };

  constructor(
    private http: HttpClient,
    private service: HrModuleService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadAttendance();
  }

  loadAttendance() {
    this.service.getContactTeams().subscribe({
      next: (teams: any[]) => {
        teams.forEach((team) => {
          team.members?.forEach((m: any) => {
            if (m.contactID === team.leaderID) {
              const cardNo = m.contact?.card_No?.toString().trim();

              if (cardNo && !this.leaderCardNos.includes(cardNo)) {
                this.leaderCardNos.push(cardNo);
              }
            }
          });
        });

        this.http.get<any[]>("http://localhost:5054/api/Attendance").subscribe({
          next: (data) => {
            this.attendanceData = data.map((x: any) => {
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

              const matchedMember = teams
                .flatMap((t: any) => t.members || [])
                .find((m: any) => {
                  const memberCardNo = m.contact?.card_No
                    ?.toString()
                    .replace(/\s+/g, "")
                    .toLowerCase();

                  const attendanceCardNo = x.cardNo
                    ?.toString()
                    .replace(/\s+/g, "")
                    .toLowerCase();

                  return memberCardNo === attendanceCardNo;
                });

              // console.log("MATCHED MEMBER => ", matchedMember);

              return {
                ...x,

                employeeName: matchedMember?.contact?.name || x.employeeName,

                name: matchedMember?.contact?.name || x.employeeName,

                photoUrl:
                  matchedMember?.contact?.photoUrl ||
                  matchedMember?.photoUrl ||
                  x.photoUrl ||
                  "",

                isTeamLeader: this.leaderCardNos.includes(
                  x.cardNo?.toString().trim(),
                ),
              };
            });

            const uniqueYears = [
              ...new Set(
                data
                  .filter((x: any) => x.punchDate)
                  .map((x: any) => new Date(x.punchDate).getFullYear()),
              ),
            ];

            this.years = uniqueYears.sort((a, b) => a - b);

            this.applyFilters();
          },

          error: (err) => {
            console.error(err);
          },
        });
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  processAbsents(filteredAttendance: any[]) {
    const grouped: any = {};

    filteredAttendance.forEach((item: any) => {
      const cardNo = item.cardNo;

      if (!grouped[cardNo]) {
        grouped[cardNo] = {
          // name: item.employeeName,
          name: item.name || item.employeeName,
          cardNo: item.cardNo,
          records: [],
        };
      }

      grouped[cardNo].records.push(item);
    });

    Object.values(grouped).forEach((emp: any) => {
      let absentDates: string[] = [];

      const sortedRecords = emp.records.sort((a: any, b: any) => {
        return (
          new Date(b.punchDate).getTime() - new Date(a.punchDate).getTime()
        );
      });
      const baseDate = this.selectedDate
        ? new Date(this.selectedDate)
        : new Date();

      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(baseDate);

        checkDate.setDate(baseDate.getDate() - i);

        const dateStr = checkDate.toISOString().split("T")[0];

        const found = sortedRecords.find((x: any) => {
          if (!x.punchDate) {
            return false;
          }

          const punchDate = new Date(x.punchDate).toISOString().split("T")[0];

          return punchDate === dateStr;
        });

        if (!found || !found.firstPunch) {
          absentDates.push(dateStr);
        } else {
          break;
        }
      }

      const absentCount = absentDates.length;

      const employeeData = {
        name: emp.name,
        cardNo: emp.cardNo,

        photoUrl: emp.records[0]?.photoUrl || "",

        absentCount: absentCount,

        absentDates: absentDates,

        isTeamLeader: emp.records[0]?.isTeamLeader || false,
      };

      // if (absentDates.length >= 1) {
      //   this.absentGroups.today.push({
      //     ...employeeData,
      //     absentCount: 1,
      //     absentDates: absentDates.slice(0, 1),
      //   });
      // }
      const selectedDateStr = this.selectedDate
        ? new Date(this.selectedDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      if (absentDates.length >= 1 && absentDates[0] === selectedDateStr) {
        this.absentGroups.today.push({
          ...employeeData,
          absentCount: 1,
          absentDates: absentDates.slice(0, 1),
        });
      }

      if (absentDates.length >= 2) {
        this.absentGroups.twoDays.push({
          ...employeeData,
          absentCount: 2,
          absentDates: absentDates.slice(0, 2),
        });
      }

      if (absentDates.length >= 3) {
        this.absentGroups.threeDays.push({
          ...employeeData,
          absentCount: 3,
          absentDates: absentDates.slice(0, 3),
        });
      }

      if (absentDates.length >= 4) {
        this.absentGroups.fourDays.push({
          ...employeeData,
          absentCount: 4,
          absentDates: absentDates.slice(0, 4),
        });
      }

      if (absentDates.length >= 5) {
        this.absentGroups.fiveDays.push({
          ...employeeData,
          absentCount: 5,
          absentDates: absentDates.slice(0, 5),
        });
      }

      if (absentDates.length >= 6) {
        this.absentGroups.sixDays.push({
          ...employeeData,
          absentCount: 6,
          absentDates: absentDates.slice(0, 6),
        });
      }

      if (absentDates.length >= 7) {
        this.absentGroups.sevenDays.push({
          ...employeeData,
          absentCount: 7,
          absentDates: absentDates.slice(0, 7),
        });
      }
    });
  }

  applyFilters() {
    this.absentGroups = {
      today: [],
      twoDays: [],
      threeDays: [],
      fourDays: [],
      fiveDays: [],
      sixDays: [],
      sevenDays: [],
    };

    let filteredAttendance = [...this.attendanceData];

    // filteredAttendance = filteredAttendance.filter((x: any) => {
    //   if (!x.punchDate) {
    //     return false;
    //   }

    //   const date = new Date(x.punchDate);

    //   const matchesMonthYear =
    //     date.getMonth() + 1 == this.selectedMonth &&
    //     date.getFullYear() == this.selectedYear;

    //   if (!matchesMonthYear) {
    //     return false;
    //   }

    //   // DATE FILTER
    //   if (this.selectedDate) {
    //     const punchDate = new Date(x.punchDate).toISOString().split("T")[0];

    //     return punchDate === this.selectedDate;
    //   }

    //   return true;
    // });

    filteredAttendance = filteredAttendance.filter((x: any) => {
      if (!x.punchDate) {
        return false;
      }

      const date = new Date(x.punchDate);

      return (
        date.getMonth() + 1 == this.selectedMonth &&
        date.getFullYear() == this.selectedYear
      );
    });

    if (this.filters.employeeName?.trim()) {
      const search = this.filters.employeeName.toLowerCase();

      filteredAttendance = filteredAttendance.filter((x: any) => {
        return (
          x.employeeName?.toLowerCase().includes(search) ||
          x.cardNo?.toString().includes(search)
        );
      });
    }

    this.processAbsents(filteredAttendance);
  }

  resetFilters() {
    this.filters = {
      employeeName: "",
    };

    this.selectedDate = "";

    this.selectedMonth = new Date().getMonth() + 1;

    this.selectedYear = new Date().getFullYear();

    this.selectedTab = "today";

    this.applyFilters();
  }

  openProfileModal(element: any) {
    this.dialog.open(this.profileDialog, {
      data: element,
      panelClass: "profile-dialog",
      backdropClass: "blur-backdrop",
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  onDateChange() {
    this.selectedTab = "today";
    this.applyFilters();
  }
}
