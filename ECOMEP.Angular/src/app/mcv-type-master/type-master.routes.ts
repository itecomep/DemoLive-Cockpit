import { Routes } from "@angular/router";
import { AuthGuard } from "../helpers/auth.guard";

export const TYPE_MASTER_ROUTES: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/app-setting-master/',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    loadComponent: () => import('./components/type-master/type-master.component').then(m => m.TypeMasterComponent),
  
    canActivate: [AuthGuard]
  },
];


