import { Routes } from '@angular/router';
import { AuthGuard } from '../helpers/auth.guard';

export const PERMISSIONS_ROUTES: Routes = [
  
  {
    path: '',
    loadComponent: () => import('./components/permissions/permissions.component').then(m => m.PermissionsComponent),
    data: { title: 'Permissions' },
    canActivate: [AuthGuard]
  },
];
