import { Routes } from '@angular/router';

export const SITE_VISIT_MINUTES_ROUTES: Routes = [
  {
    path: ':uid',
    loadComponent: () => import('./component/site-visit-minutes-view/site-visit-minutes-view.component').then(m => m.SitevisitMinutesViewComponent),
    data: { title: 'Minutes of Sitevisit' },
  },
];

