import { Routes } from '@angular/router';
import { AllowedIpComponent } from './allowed-ip.component';
import { BypassAllowedUserComponent } from './bypass-allowed-user/bypass-allowed-user.component';

export const ALLOWED_IP_ROUTES: Routes = [
  {
    path: '',
    component: AllowedIpComponent,
     data: 
    { 
      title: 'Allowed IP Management',
      permissions: ['PROJECT_ALLOWED_IP_BYPASS_VIEW']
    }
  },
  {
    path: 'bypass',
    component: BypassAllowedUserComponent,
    data: 
    { 
      title: 'Bypass Allowed Users',
      permissions: ['PROJECT_ALLOWED_IP_BYPASS_VIEW']
    }
  }
];
