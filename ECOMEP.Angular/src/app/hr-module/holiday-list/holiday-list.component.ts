import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HolidayMasterService } from "../../leave/services/holiday-master-api.service";
import { Holiday } from "../../leave/models/holiday.model";

@Component({
  selector: "app-holiday-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./holiday-list.component.html",
  styleUrls: ["./holiday-list.component.scss"],
})
export class HolidayListComponent implements OnInit {
  holidaysMasterArr: Holiday[] = [];

  constructor(private holidayService: HolidayMasterService) {}

  ngOnInit(): void {
    this.getHolidayData();
  }

  getHolidayData() {
    this.holidayService.get().subscribe((data: Holiday[]) => {
      const currentYear = new Date().getFullYear();

      this.holidaysMasterArr = data.filter((item) => {
        return new Date(item.holidayDate).getFullYear() === currentYear;
      });

      this.holidaysMasterArr.sort(
        (a, b) =>
          new Date(a.holidayDate).getTime() - new Date(b.holidayDate).getTime(),
      );
    });
  }
}
