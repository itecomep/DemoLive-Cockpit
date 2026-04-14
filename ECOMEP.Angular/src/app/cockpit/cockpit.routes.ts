import { Routes } from "@angular/router";
import { AuthGuard } from "../helpers/auth.guard";

export const COCKPIT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/cockpit-view/cockpit-view.component').then(m => m.CockpitViewComponent),
    data: { title: 'My Cockpit' },
    canActivate: [AuthGuard]
  }
];

