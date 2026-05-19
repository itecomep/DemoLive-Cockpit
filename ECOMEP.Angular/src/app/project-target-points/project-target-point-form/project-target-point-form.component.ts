import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { HeaderComponent } from "../../mcv-header/components/header/header.component";
import { TeamTargetPointApiService } from "../services/team-target-point-api.service";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-project-target-point-form",
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, RouterModule],
  templateUrl: "./project-target-point-form.component.html",
  styleUrls: ["./project-target-point-form.component.scss"],
})
export class ProjectTargetPointFormComponent implements OnInit {
  teams: any[] = [];

  formData: any = {
    contactTeamID: null,
    points: null,
  };

  constructor(
    private http: HttpClient,
    private api: TeamTargetPointApiService,
  ) {}

  ngOnInit(): void {
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

  save() {
    this.api.create(this.formData).subscribe({
      next: () => {
        alert("Saved Successfully");

        this.formData = {
          contactTeamID: null,
          points: null,
        };
      },

      error: (err) => {
        if (err.status === 400) {
          alert(err.error);
        } else {
          alert("Something went wrong");
        }

        console.log(err);
      },
    });
  }

  // save() {

  //   this.api.create(this.formData).subscribe({

  //     next: () => {

  //       alert("Saved Successfully");

  //       this.formData = {
  //         contactTeamID: null,
  //         points: null,
  //       };
  //     },

  //     error: (err) => {

  //       console.log(err);
  //     },
  //   });
  // }
}
