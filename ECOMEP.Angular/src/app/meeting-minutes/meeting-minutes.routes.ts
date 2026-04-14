import { Routes } from '@angular/router';

export const MEETING_MINUTES_ROUTES: Routes = [
  {
    path: ':uid',
    loadComponent: () => import('./components/meeting-minutes-view/meeting-minutes-view.component').then(m => m.MeetingMinutesViewComponent),
    data: { title: 'Minutes of Meeting' },
  },
];

