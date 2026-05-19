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

fromDate: string = "";

toDate: string = "";

filteredData: any[] = [];

  constructor(
    private api: TeamTargetPointApiService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.getTeams();
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

      this.groupByMonth();

      this.isLoading = false;
    },

    error: (err) => {
      console.log(err);

      this.isLoading = false;
    },
  });
}

// groupByMonth() {

//   const grouped: any = {};

//   this.filteredData.forEach((item) => {

//     const month = new Date(item.created).toLocaleString("default", {
//       month: "long",
//       year: "numeric",
//     });

//     if (!grouped[month]) {
//       grouped[month] = [];
//     }

//     grouped[month].push(item);

//   });

//   this.groupedTargetPoints = Object.keys(grouped).map((month) => ({
//     month: month,
//     items: grouped[month],
//   }));

// }

groupByMonth() {

  const grouped: any = {};

  this.filteredData.forEach((item) => {

    const month = new Date(item.created).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!grouped[month]) {
      grouped[month] = {
        items: [],
        totalPoints: 0
      };
    }

    grouped[month].items.push(item);

    grouped[month].totalPoints += item.points;

  });

  this.groupedTargetPoints = Object.keys(grouped).map((month) => ({

    month: month,

    items: grouped[month].items,

    totalPoints: grouped[month].totalPoints

  }));

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

    // TEAM SEARCH

    const matchesSearch =
      !this.searchText ||
      item.teamName
        ?.toLowerCase()
        .includes(this.searchText.toLowerCase());

    // DATE FILTER

    const itemDate = new Date(item.created);

    const from =
      !this.fromDate ||
      itemDate >= new Date(this.fromDate);

    const to =
      !this.toDate ||
      itemDate <= new Date(this.toDate + 'T23:59:59');

    return matchesSearch && from && to;

  });

  this.groupByMonth();

}

resetFilters() {

  this.searchText = "";

  this.fromDate = "";

  this.toDate = "";

  this.filteredData = [...this.targetPoints];

  this.groupByMonth();

}

}
