import { Routes } from "@angular/router";
import { AuthGuard } from "../helpers/auth.guard";

export const APP_SETTING_MASTER_ROUTES: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/app-setting-master/',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    loadComponent: () => import('./components/app-setting-master/app-setting-master.component').then(m => m.AppSettingMasterComponent),
  
    canActivate: [AuthGuard]
  },
];


