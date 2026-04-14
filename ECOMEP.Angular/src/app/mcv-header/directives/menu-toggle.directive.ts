import { Directive, OnInit, OnDestroy, HostListener } from "@angular/core";
import { AppService } from "src/app/shared/services/app.service";


@Directive({
    selector: '[appMenuToggle]',
    standalone: true
})
export class MenuToggleDirective implements OnInit, OnDestroy
{

  isOpen?: boolean;

  constructor(
    private appService: AppService
  )
  {
  }
  ngOnInit()
  {
    this.appService.getMenuStatus().subscribe((value) =>
    {
      setTimeout(() =>
      {
        this.isOpen = value;
      });
    });
  }

  ngOnDestroy()
  {
    this.appService.setMenuStatus(false);
  }

  @HostListener('click', ['$event']) onClick(e: any)
  {
    e.preventDefault();
    this.isOpen = !this.isOpen;
    this.appService.setMenuStatus(this.isOpen);
  }
}
