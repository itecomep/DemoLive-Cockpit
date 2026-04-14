import { Routes } from "@angular/router";
import { AuthGuard } from "../helpers/auth.guard";

export const PROJECT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/project-list/',
    pathMatch: 'full'
  },
  {
    path: ':id',
    loadComponent: () => import('./components/project-list-view/project-list-view.component').then(m => m.ProjectListViewComponent),
    data: { title: 'Project List', roles: ['PROJECT_LIST'] },
    canActivate: [AuthGuard]
  },

];

