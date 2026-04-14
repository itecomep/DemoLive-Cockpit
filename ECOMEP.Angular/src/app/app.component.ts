import { Component, HostListener, OnInit, inject } from '@angular/core';
import { SwPush, SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs';
import { UtilityService } from './shared/services/utility.service';
import { AuthService } from './auth/services/auth.service';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { AppService } from './shared/services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [LoaderComponent, RouterOutlet]
})
export class AppComponent implements OnInit {
  title = 'Lighting-Concepts';

  private readonly authService = inject(AuthService);

  constructor(
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    private utilityService: UtilityService,
    private appService: AppService
  ) {
  }

  ngOnInit(): void {
    this.checkForVersionUpdate();
    this.subscribeToNotificationClick();
  }

  private subscribeToNotificationClick() {
    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      // console.log('notification click', action, notification);
    });
  }

  private checkForVersionUpdate() {
    if (this.authService.currentUserStore && this.authService.currentUserStore.isAuth) {
      const updatesAvailable = this.swUpdate.versionUpdates.pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map(evt => ({
          type: 'UPDATE_AVAILABLE',
          current: evt.currentVersion,
          available: evt.latestVersion,
        }))
      );
  
      updatesAvailable.subscribe((e) => {
        console.log('version ready', e);
        this.appService.setIsVersionUpdateAvailable(true);
        this.utilityService.showConfirmationDialog(`A new version is available. Would you like to update now?`, () => {
          this.swUpdate.activateUpdate().then(() => {
            this.utilityService.showSwalToast('Version Update', 'New version installed!');
            window.location.reload();
            this.appService.setIsVersionUpdateAvailable(false);
          });
        })
       
      });
    }
  }


}
