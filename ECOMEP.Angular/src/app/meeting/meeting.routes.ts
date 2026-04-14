import { Routes } from '@angular/router';
import { AuthGuard } from '../helpers/auth.guard';

export const MEETING_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/meeting-list/',
    pathMatch: 'full'
  },
  {
    path: ':id',
    loadComponent: () => import('./components/meeting-list-view/meeting-list-view.component').then(m => m.MeetingListViewComponent),
    data: { title: 'Meeting List' },
    canActivate: [AuthGuard]
  },
];
