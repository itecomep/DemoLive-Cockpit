import { Routes } from '@angular/router';
import { AuthGuard } from '../helpers/auth.guard';

export const CONTACT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/contact-list/',
    pathMatch: 'full',
  },
  {
    path: ':id',
    loadComponent: () => import('./components/contact-list-view/contact-list-view.component').then(m => m.ContactListViewComponent),
    data: {
      title: 'Contact List',
      roles: ['CONTACT_LIST']
    },
    canActivate: [AuthGuard]
  },
];

