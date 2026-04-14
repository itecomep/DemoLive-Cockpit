import { Directive, HostListener, OnDestroy, OnInit } from "@angular/core";
import { AppService } from "../services/app.service";

@Directive({
    selector: '[appFilterToggle]',
    standalone: true
})
export class FilterToggleDirective implements OnInit, OnDestroy
{
  isOpen: boolean = false;

  constructor(
    private appService: AppService
  )
  {
  }
  ngOnInit()
  {
    this.appService.getMobileFilterStatus().subscribe((value) =>
    {
      setTimeout(() =>
      {
        this.isOpen = value;
      });
    });
  }

  ngOnDestroy()
  {
    this.appService.setMobileFilterStatus(false);
  }

  @HostListener('click', ['$event']) onClick(e: any)
  {
    e.preventDefault();
    this.isOpen = !this.isOpen;
    this.appService.setMobileFilterStatus(this.isOpen);
  }
}
