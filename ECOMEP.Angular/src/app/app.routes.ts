import { Routes } from '@angular/router';
import { AuthGuard } from "./helpers/auth.guard";
import { BillsComponent } from './analysis/bills/bills.component';

export const ROOT_ROUTES: Routes = [
  { path: 'cockpit', loadChildren: () => import('./cockpit').then(m => m.COCKPIT_ROUTES), canActivate: [AuthGuard] },
  { path: 'allowed-ip',loadChildren: () => import('./allowed-ip/allowed-ip.module').then(m => m.AllowedIpModule),canActivate: [AuthGuard] },
  { path: 'bypass-allowed-user',loadChildren: () => import('./allowed-ip/allowed-ip.module').then(m => m.AllowedIpModule),canActivate: [AuthGuard]},
  { path: 'auth', loadChildren: () => import('./auth').then(m => m.AUTH_ROUTES) },
  { path: 'gmail/compose', loadChildren: () => import('./gmail/compose-email/gmail-compose.module').then(m => m.GmailComposeModule), canActivate: [AuthGuard]  },
  { path: 'asset-view', loadChildren: () => import('./asset/asset.routes').then(m => m.ASSET_ROUTES) },
  { path: 'contact-list', loadChildren: () => import('./contact').then(m => m.CONTACT_ROUTES), canActivate: [AuthGuard] },
  { path: 'team-list', loadChildren: () => import('./contact').then(m => m.CONTACT_TEAM_ROUTES), canActivate: [AuthGuard] },
  { path: 'project-list', loadChildren: () => import('./project').then(m => m.PROJECT_ROUTES), canActivate: [AuthGuard] },

  { path: 'meeting-list', loadChildren: () => import('./meeting').then(m => m.MEETING_ROUTES), canActivate: [AuthGuard] },
  { path: 'sitevisit-list', loadChildren: () => import('./site-visit').then(m => m.SITE_VISIT_ROUTES), canActivate: [AuthGuard] },
  { path: 'leave-list', loadChildren: () => import('./leave').then(m => m.LEAVE_ROUTES), canActivate: [AuthGuard] },

  { path: 'minutes', loadChildren: () => import('./meeting-minutes').then(m => m.MEETING_MINUTES_ROUTES), canActivate: [AuthGuard] },
  { path: 'sitevisit-minutes', loadChildren: () => import('./site-visit-minutes').then(m => m.SITE_VISIT_MINUTES_ROUTES), canActivate: [AuthGuard] },
  
  { path: 'request-ticket-list', loadChildren: () => import('./request-ticket').then(m => m.REQUEST_TICKET_ROUTES), canActivate: [AuthGuard] },
  { path: 'todo-list', loadChildren: () => import('./todo').then(m => m.TODO_ROUTES), canActivate: [AuthGuard] },
  { path: 'wftask-list', loadChildren: () => import('./wf-task').then(m => m.WFTASK_ROUTES), canActivate: [AuthGuard] },
  { path: 'app-setting-master', loadChildren: () => import('./mcv-app-setting-master').then(m => m.APP_SETTING_MASTER_ROUTES), canActivate: [AuthGuard] },
  { path: 'company-master', loadChildren: () => import('./mcv-company-master').then(m => m.COMPANY_MASTER_ROUTES), canActivate: [AuthGuard] },
  { path: 'type-master', loadChildren: () => import('./mcv-type-master').then(m => m.TYPE_MASTER_ROUTES), canActivate: [AuthGuard] },
  { path: 'status-master', loadChildren: () => import('./mcv-status-master').then(m => m.STATUS_MASTER_ROUTES), canActivate: [AuthGuard] },
  { path: 'permissions', loadChildren: () => import('./permissions').then(m => m.PERMISSIONS_ROUTES), canActivate: [AuthGuard] },
  { path: 'analysis', loadChildren: () => import('././analysis/bills.routes').then(m => m.BILLS_ROUTES), canActivate: [AuthGuard] },
  // { path: 'checklist', loadComponent: () => import('./checklist/checklist.component').then(m => m.ChecklistComponent), canActivate: [AuthGuard] },
  {
    path: 'bill-follow-up',
    loadComponent: () => import('./project/components/project-bill-analysis/bill-analysis-row/bill-analysis-row.component')
      .then(m => m.BillAnalysisRowComponent),
    canActivate: [AuthGuard]
  },
  { path: 'checklist', canActivate: [AuthGuard], children: 
    [
      {
        path: '',
        loadComponent: () => import('./checklist/checklist.component')
          .then(m => m.ChecklistComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./checklist/checklist-create/checklist-create.component')
          .then(m => m.ChecklistCreateComponent)
      }
    ]
  },

  { path: '', redirectTo: 'cockpit', pathMatch: 'full' },
  { path: '**', redirectTo: '/cockpit', pathMatch: 'full' },
];

