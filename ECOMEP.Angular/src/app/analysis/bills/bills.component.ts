import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { firstValueFrom } from "rxjs";
import { FormControl, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { ProjectBillApiService } from "src/app/project/services/project-bill-api.service";
import { ProjectApiService } from "src/app/project/services/project-api.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { HeaderComponent } from "src/app/mcv-header/components/header/header.component";

interface Project {
  id: number;
  code: string;
  title?: string;
}

interface BillPayment {
  amount?: number;
}

interface Bill {
  projectID: number;
  projectTitle: string;
  billDate: Date | null;
  taxInvoiceNo?: string;
  proformaInvoiceNo?: string;
  billPercentage?: number;
  dueAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  payableAmount?: number;
  receivedAmount?: number;
  payments?: BillPayment[];
  amountLessGst?: number;
}

interface UserData {
  roles?: string[];
}

interface ProjectApiResponse {
  list: Project[];
}

@Component({
  selector: "app-bills",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    HeaderComponent,
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: "./bills.component.html",
  styleUrls: ["./bills.component.scss"],
})
export class BillsComponent implements OnInit {
  headerTitle = "Analysis";
  headerTitleCount = 0;
  allBills: Bill[] = [];
  filteredBills: Bill[] = [];
  projects: { id: number; code: string; name: string }[] = [];
  selectedProjectId: number | null = null;
  isLoading = false;

  currentSortColumn: string = "";
  isAsc: boolean = true;

  projectsControl = new FormControl<
    string | { id: number; code: string; name: string }
  >("");
  filteredProjects$:
    | Observable<{ id: number; code: string; name: string }[]>
    | undefined;
  filters = {
    billDate: "",
    billNumber: "",
    billAmount: null as number | null,
  };
  constructor(
    private billService: ProjectBillApiService,
    private projectApi: ProjectApiService,
  ) {}

  async ngOnInit() {
    await this.loadPermittedProjectsAndBills();

    this.filteredProjects$ = this.projectsControl.valueChanges.pipe(
      startWith(""),
      map((value) => {
        const name = typeof value === "string" ? value : value?.name;
        return name
          ? this.projects.filter((p) =>
              p.name.toLowerCase().includes(name.toLowerCase()),
            )
          : this.projects;
      }),
    );

    this.projectsControl.valueChanges.subscribe((value) => {
      if (!value) this.onProjectSelect(null);
    });
  }

  async loadPermittedProjectsAndBills() {
    this.isLoading = true;

    try {
      const userData: UserData = JSON.parse(
        localStorage.getItem("currentUser") || "{}",
      );
      const isFullAccess = userData.roles?.includes("MASTER") || false;

      const permittedRes: ProjectApiResponse = await firstValueFrom(
        this.projectApi.getProjectsForEmail(0, 10000, isFullAccess),
      );

      const permittedProjects = permittedRes?.list || [];
      if (!permittedProjects.length) {
        this.projects = [];
        this.allBills = [];
        this.filteredBills = [];
        return;
      }

      this.projects = permittedProjects.map((p) => ({
        id: p.id,
        code: p.code,
        name: p.title ? `${p.code} - ${p.title}` : p.code,
      }));

      const projectIds = this.projects.map((p) => p.id);

      const billsArray = await Promise.all(
        projectIds.map((pid) =>
          firstValueFrom(
            this.billService.get([{ key: "projectID", value: pid.toString() }]),
          ),
        ),
      );

      this.allBills = billsArray.flat().map((bill: Bill) => {
        const receivedAmount = (bill.payments || []).reduce(
          (sum: number, p: BillPayment) => sum + (p.amount || 0),
          0,
        );

        const amountLessGst = receivedAmount / 1.18;

        return {
          ...bill,
          billDate: bill.billDate ? new Date(bill.billDate) : null,
          payableAmount: bill.payableAmount || 0,
          receivedAmount,
          amountLessGst,
        };
      });

      this.filteredBills = [...this.allBills];
    } catch (err) {
      console.error("Error loading permitted projects or bills", err);
      this.projects = [];
      this.allBills = [];
      this.filteredBills = [];
    } finally {
      this.isLoading = false;
    }
  }

  onProjectSelect(projectId: number | null) {
    this.selectedProjectId = projectId;
    this.filteredBills = projectId
      ? this.allBills.filter((b) => b.projectID === projectId)
      : [...this.allBills];
  }

  displayProject(project: { id: number; code: string; name: string }): string {
    return project ? project.name : "";
  }

  sortTable(column: keyof Bill) {
    if (this.currentSortColumn === column) {
      this.isAsc = !this.isAsc;
    } else {
      this.currentSortColumn = column;
      this.isAsc = true;
    }

    this.filteredBills.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === "string" && typeof valB === "string") {
        return this.isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      if (valA instanceof Date && valB instanceof Date) {
        return this.isAsc
          ? valA.getTime() - valB.getTime()
          : valB.getTime() - valA.getTime();
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return this.isAsc ? valA - valB : valB - valA;
      }

      return 0;
    });
  }

  applyFilters() {
    this.filteredBills = this.allBills.filter((bill) => {
      let dateMatch: boolean = true;
      if (this.filters.billDate) {
        const filterDate = new Date(this.filters.billDate);
        dateMatch =
          !!bill.billDate &&
          bill.billDate.toDateString() === filterDate.toDateString();
      }

      let numberMatch: boolean = true;
      if (this.filters.billNumber) {
        const billNo = bill.taxInvoiceNo || bill.proformaInvoiceNo || "";
        numberMatch = billNo
          .toLowerCase()
          .includes(this.filters.billNumber.toLowerCase());
      }

      let amountMatch: boolean = true;
      if (this.filters.billAmount != null) {
        const filterVal = this.filters.billAmount;
        amountMatch =
          (bill.dueAmount ?? 0) === filterVal ||
          (bill.payableAmount ?? 0) === filterVal ||
          (bill.receivedAmount ?? 0) === filterVal ||
          (bill.amountLessGst ?? 0) === filterVal;
      }

      return dateMatch && numberMatch && amountMatch;
    });

    if (this.currentSortColumn) {
      this.sortTable(this.currentSortColumn as keyof Bill);
    }
  }
}
