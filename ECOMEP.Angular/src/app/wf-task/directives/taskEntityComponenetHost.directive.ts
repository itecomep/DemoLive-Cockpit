import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[wfTaskEntityComponentHost]',
    standalone: true
})
export class WFTaskEntityComponentHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
