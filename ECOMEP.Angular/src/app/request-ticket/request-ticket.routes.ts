import { Routes } from "@angular/router";
import { AuthGuard } from "../helpers/auth.guard";

export const REQUEST_TICKET_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/request-ticket-list/',
    pathMatch: 'full'
  },
  {
    path: ':id',
    loadComponent: () => import('./components/request-ticket-list-view/request-ticket-list-view.component').then(m => m.RequestTicketListViewComponent),
    data: { title: 'Request Ticket List', roles: ['REQUEST_TICKET_LIST'] },
    canActivate: [AuthGuard]
  },
];

