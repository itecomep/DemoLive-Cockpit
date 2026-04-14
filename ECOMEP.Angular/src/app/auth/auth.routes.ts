import { Routes } from "@angular/router";
import { AuthGuard } from "../helpers/auth.guard";

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    data: { title: 'Login' }
  },
  {
    path: 'change-password',
    loadComponent: () => import('./components/change-password/change-password.component').then(m => m.ChangePasswordComponent),
    data: { title: 'Change Password' },
    canActivate: [AuthGuard]
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    data: { title: 'Reset Password' },
    canActivate: [AuthGuard]
  },
  {
    path: 'eula',
    loadComponent: () => import('./components/eula/eula.component').then(m => m.EulaComponent),
    data: { title: 'EULA' },
    canActivate: [AuthGuard]
  },
  {
    path: 'user-sessions',
    loadComponent: () => import('./components/user-sessions-view/user-sessions-view.component').then(m => m.UserSessionsViewComponent),
    data: { title: 'Login Sessions' },
    canActivate: [AuthGuard]
  },
];

