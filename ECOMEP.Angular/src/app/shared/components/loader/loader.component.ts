import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { environment } from 'src/environments/environment';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    standalone: true,
    imports: [NgIf]
})
export class LoaderComponent
{
  showLoader: boolean = false;
  message!: string;
  logoUrl: string = environment.logoUrl;

  constructor(private service: LoaderService) { }

  ngOnInit()
  {

    this.service.showLoader.subscribe(value =>
    {
      setTimeout(() =>
      {
        this.showLoader = value;
      });
    });
    this.service.message.subscribe(value =>
    {
      setTimeout(() =>
      {
        this.message = value;
      });
    });

  }

}
