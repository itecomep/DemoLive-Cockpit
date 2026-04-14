import { Routes } from "@angular/router";
import { AuthGuard } from "../helpers/auth.guard";

export const BILLS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/analysis/',
    pathMatch: 'full'
  },
  {
    path: ':id',
    loadComponent: () => import('./../analysis/bills/bills.component').then(m => m.BillsComponent),
    data: { title: 'Analysis', roles: ['ANALYSIS_LIST_VIEW'] },
    canActivate: [AuthGuard]
  }
];
