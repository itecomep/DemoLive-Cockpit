import { Routes } from "@angular/router";
import { AuthGuard } from "../helpers/auth.guard";

export const STATUS_MASTER_ROUTES: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/app-setting-master/',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    loadComponent: () => import('./components/status-master/status-master.component').then(m => m.StatusMasterComponent),
  
    canActivate: [AuthGuard]
  },
];


