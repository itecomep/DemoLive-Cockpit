import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

import { HeaderComponent } from "../mcv-header/components/header/header.component";

import { TeamTargetPointApiService } from "./services/team-target-point-api.service";

@Component({
  selector: "app-project-target-points",
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: "./project-target-points.component.html",
  styleUrls: ["./project-target-points.component.scss"],
})
export class ProjectTargetPointsComponent implements OnInit {
  targetPoints: any[] = [];

  groupedTargetPoints: any[] = [];

  teams: any[] = [];

  isLoading = false;

  editId: number = 0;

  searchText: string = "";

  selectedMonth: string = "";

  selectedYear: string = "";

  months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  years: number[] = [];

  filteredData: any[] = [];

  constructor(
    private api: TeamTargetPointApiService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.getTeams();

    this.generateRecords();
  }

  generateRecords() {
    this.http
      .post(
        "http://localhost:5054/api/TeamTargetPoint/GenerateMonthlyRecords",
        {},
      )
      .subscribe({
        next: () => {
          this.loadData();
        },

        error: (err) => {
          console.log(err);
        },
      });
  }

  getTeams() {
    this.http
      .get<any[]>("http://localhost:5054/api/TeamTargetPoint/GetAllTeams")
      .subscribe({
        next: (res) => {
          this.teams = res;
        },

        error: (err) => {
          console.log(err);
        },
      });
  }

  loadData() {
    this.isLoading = true;

    this.api.getAll().subscribe({
      next: (res) => {
        this.targetPoints = res;

        this.filteredData = [...res];

        this.selectedMonth = "";

        this.selectedYear = "";

        this.groupByMonth();
        this.loadYears();

        this.isLoading = false;
      },

      error: (err) => {
        console.log(err);

        this.isLoading = false;
      },
    });
  }
  groupByMonth() {
    const grouped: any = {};

    this.filteredData.forEach((item) => {
      const date = new Date(item.created);

      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

      const monthLabel = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          month: monthLabel,
          items: [],
          totalPoints: 0,
          sortDate: date,
        };
      }

      grouped[monthKey].items.push(item);

      grouped[monthKey].totalPoints += item.points;
    });

    this.groupedTargetPoints = Object.values(grouped).sort(
      (a: any, b: any) => b.sortDate.getTime() - a.sortDate.getTime(),
    );
  }

  update(item: any) {
    const payload = {
      contactTeamID: item.contactTeamID,

      points: item.points,
    };

    this.api.update(item.id, payload).subscribe({
      next: () => {
        alert("Updated Successfully");

        this.editId = 0;

        this.loadData();
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  cancelEdit() {
    this.editId = 0;

    this.loadData();
  }

  delete(id: number) {
    if (!confirm("Are you sure you want to delete this item ?")) {
      return;
    }

    this.api.delete(id).subscribe({
      next: () => {
        alert("Deleted Successfully");

        this.loadData();
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  applyFilters() {
    this.filteredData = this.targetPoints.filter((item) => {
      // SEARCH

      const matchesSearch =
        !this.searchText ||
        item.teamName?.toLowerCase().includes(this.searchText.toLowerCase());

      // MONTH FILTER

      const itemMonth = new Date(item.created).toLocaleString("default", {
        month: "long",
      });

      const matchesMonth =
        !this.selectedMonth || itemMonth === this.selectedMonth;

      // YEAR FILTER

      const itemYear = new Date(item.created).getFullYear().toString();

      const matchesYear = !this.selectedYear || itemYear === this.selectedYear;

      return matchesSearch && matchesMonth && matchesYear;
    });

    this.groupByMonth();
  }

  resetFilters() {
    this.searchText = "";

    this.selectedMonth = "";

    this.selectedYear = "";

    this.filteredData = [...this.targetPoints];

    this.groupByMonth();
  }
  loadYears() {
    const uniqueYears = this.targetPoints.map((x) =>
      new Date(x.created).getFullYear(),
    );

    this.years = [...new Set(uniqueYears)];
  }
}
