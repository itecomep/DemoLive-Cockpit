import { Routes } from "@angular/router";
import { AuthGuard } from "../helpers/auth.guard";

export const WFTASK_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/wftask-list/',
    pathMatch: 'full'
  },
  {
    path: ':id',
    loadComponent: () => import('./components/wf-task-list-view/wf-task-list-view.component').then(m => m.WfTaskListViewComponent),
    data: { name: 'Task-List' },
    canActivate: [AuthGuard]
  },
];


