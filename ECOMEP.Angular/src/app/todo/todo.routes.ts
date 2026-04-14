import { Routes } from "@angular/router";
import { AuthGuard } from "../helpers/auth.guard";

export const TODO_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/todo-list/',
    pathMatch: 'full'
  },
  {
    path: ':id',
    loadComponent: () => import('./components/todo-list-view/todo-list-view.component').then(m => m.TodoListViewComponent),
    data: { title: 'Todo List', roles: ['TODO_LIST'] },
    canActivate: [AuthGuard]
  },
];

