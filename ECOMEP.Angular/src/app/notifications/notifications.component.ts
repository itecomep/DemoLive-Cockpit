import { Component, OnInit, ViewChild } from "@angular/core";
import { Notification, NotificationService } from "./notification.service";
import { MatDatepicker } from "@angular/material/datepicker";
import { Router } from "@angular/router";

import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { HeaderComponent } from "../mcv-header/components/header/header.component";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HeaderComponent,
  ],
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  selectedTab: string = "all";

  selectedDate: Date | null = null;
  selectedMonth: number | null = null;
  selectedYear: number | null = null;

  filterMode: "year" | "month" | "date" | null = null;
  filterType: "year" | "month" | "date" | null = null;

  @ViewChild("picker") picker!: MatDatepicker<Date>;

  constructor(
    private notificationService: NotificationService,
    private router: Router, // ✅ added router
  ) {}

  // ngOnInit(): void {
  //   this.loadNotifications();
  // }

  ngOnInit(): void {
    this.notificationService.loadNotificationsFromApi();

    this.notificationService.getNotifications().subscribe((res) => {
      this.notifications = [...res]; // 🔥 IMPORTANT (new reference)
    });
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe((res) => {
      this.notifications = res;
    });
  }

  /* ================= BACK BUTTON ================= */

  goHome() {
    this.router.navigate(["/cockpit"]); // change route if needed
  }

  /* ================= NOTIFICATION ================= */

  openNotification(notif: Notification) {
    this.notificationService.markAsRead(notif.id);
    notif.isRead = true;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  /* ================= DATE HANDLERS ================= */

  chosenYearHandler(normalizedYear: Date, datepicker: MatDatepicker<Date>) {
    if (this.filterType === "year") {
      this.selectedYear = normalizedYear.getFullYear();
      this.selectedMonth = null;
      this.selectedDate = null;

      datepicker.close();
    }
  }

  chosenMonthHandler(normalizedMonth: Date, datepicker: MatDatepicker<Date>) {
    if (this.filterType === "month") {
      this.selectedMonth = normalizedMonth.getMonth() + 1;
      this.selectedYear = normalizedMonth.getFullYear();
      this.selectedDate = null;

      datepicker.close();
    }
  }

  /* ================= FILTER PICKERS ================= */

  openYearPicker() {
    this.filterType = "year";
    this.picker.startView = "multi-year";
    this.picker.open();
  }

  openMonthPicker() {
    this.filterType = "month";
    this.picker.startView = "year";
    this.picker.open();
  }

  openDatePicker() {
    this.filterType = "date";
    this.picker.startView = "month";
    this.picker.open();
  }

  onDateSelected(event: any) {
    const date = event.value;
    if (!date) return;

    if (this.filterType === "year") {
      this.selectedYear = date.getFullYear();
      this.selectedMonth = null;
      this.selectedDate = null;
    } else if (this.filterType === "month") {
      this.selectedMonth = date.getMonth() + 1;
      this.selectedYear = date.getFullYear();
      this.selectedDate = null;
    } else if (this.filterType === "date") {
      this.selectedDate = date;
      this.selectedMonth = date.getMonth() + 1;
      this.selectedYear = date.getFullYear();

      this.picker.close();
    }
  }

  clearFilters() {
    this.selectedYear = null;
    this.selectedMonth = null;
    this.selectedDate = null;
    this.filterType = null;
  }

  /* ================= FILTER LOGIC ================= */

  get filteredNotifications(): Notification[] {
    let filtered = [...this.notifications]; // 🔥 create new reference

    // TAB FILTER
    if (this.selectedTab !== "all") {
      if (this.selectedTab === "hr") {
        filtered = filtered.filter(
          (n) => n.source === "leave-status" || n.source === "wfh-status",
        );
      } else {
        filtered = filtered.filter((n) => n.source === this.selectedTab);
      }
    }

    // YEAR FILTER
    if (this.selectedYear) {
      filtered = filtered.filter(
        (n) => new Date(n.createdAt).getFullYear() === this.selectedYear,
      );
    }

    // MONTH FILTER
    if (this.selectedMonth) {
      filtered = filtered.filter(
        (n) => new Date(n.createdAt).getMonth() + 1 === this.selectedMonth,
      );
    }

    // DATE FILTER
    if (this.selectedDate) {
      filtered = filtered.filter((n) => {
        const d = new Date(n.createdAt);
        return (
          d.getFullYear() === this.selectedDate!.getFullYear() &&
          d.getMonth() === this.selectedDate!.getMonth() &&
          d.getDate() === this.selectedDate!.getDate()
        );
      });
    }

    // SORT NEWEST FIRST
    filtered = filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return filtered;
  }
}
