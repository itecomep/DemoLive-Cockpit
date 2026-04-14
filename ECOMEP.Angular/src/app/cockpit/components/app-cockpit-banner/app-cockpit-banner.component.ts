import { Component, Input, OnInit } from '@angular/core';
import { BannerData } from 'src/app/shared/models/banner-data';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-cockpit-banner',
    templateUrl: './app-cockpit-banner.component.html',
    styleUrls: ['./app-cockpit-banner.component.scss'],
    standalone: true,
    imports: [NgIf]
})
export class CockpitBannerComponent implements OnInit
{
  @Input() data!: BannerData;

  constructor() { }

  ngOnInit()
  {
  }

}
