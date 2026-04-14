import { Routes } from '@angular/router';
import { AuthGuard } from '../helpers/auth.guard';

export const CONTACT_TEAM_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/team-list/',
    pathMatch: 'full',
  },
  {
    path: ':id',
    loadComponent: () => import('./components/contact-team-list-view/contact-team-list-view.component').then(m => m.ContactTeamListViewComponent),
    data: {
      title: 'Team List',
      roles: ['TEAM_LIST']
    },
    canActivate: [AuthGuard]
  },
];

