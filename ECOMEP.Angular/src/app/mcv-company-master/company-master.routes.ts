import { Routes } from "@angular/router";
import { AuthGuard } from "../helpers/auth.guard";

export const COMPANY_MASTER_ROUTES: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/app-setting-master/',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    loadComponent: () => import('./components/company-master/company-master.component').then(m => m.CompanyMasterComponent),
  
    canActivate: [AuthGuard]
  },
];


