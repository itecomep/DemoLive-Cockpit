import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { environment } from 'src/environments/environment';
import { AppService } from '../../services/app.service';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: true,
    imports: [NgIf, NgClass]
})
export class FooterComponent implements OnInit, OnDestroy
{
  searchQuery!: string;
  version!: string;
  showMobileFilters: boolean = false;
  showGetLoader: boolean = false;
  message!: string;

  constructor(
    private appService: AppService,
    private service: LoaderService
  ) { }

  ngOnInit()
  {
    this.version = environment.appVersion;
    // this.getVerion();
    this.getMobileFilterStatus();

    //Loader
    this.service.showGetLoader.subscribe((value: any) =>
    {
      setTimeout(() =>
      {
        this.showGetLoader = value;
      });
    });

    //Message
    this.service.message.subscribe((value: any) =>
    {
      setTimeout(() =>
      {
        this.message = value;
      })
    })
  }

  ngOnDestroy()
  {

  }

  getVerion()
  {
    this.appService.getVersion().subscribe((value: any) =>
    {
      setTimeout(() =>
      {
        this.version = value;
      });
    });
  }

  getMobileFilterStatus()
  {
    this.appService.getMobileFilterStatus().subscribe((value) =>
    {
      setTimeout(() =>
      {
        this.showMobileFilters = value;
      });
    });
  }

}
