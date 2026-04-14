import { Routes } from '@angular/router';
import { AuthGuard } from '../helpers/auth.guard';

export const SITE_VISIT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/sitevisit-list/',
    pathMatch: 'full'
  },
  {
    path: ':id',
    loadComponent: () => import('./component/site-visit-list-view/site-visit-list-view.component').then(m => m.SitevisitListViewComponent),
    data: { title: 'Sitevisit List' },
    canActivate: [AuthGuard]
  },
];
