import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';

import { McvTimeLineService } from '../services/mcv-time-line.service';
import { McvTimeLineCell } from '../model/mcv-time-line-cell';

@Directive({
    selector: '[mcvTimeLineCell]',
    standalone: true
})
export class McvTimeLineCellDirective implements OnInit, OnDestroy {

  private cellData!: McvTimeLineCell;
  @Input('mcvTimeLineCell')
  set cell(data: McvTimeLineCell) {
    if (data) {
      this.cellData = data;
      if (this.groupID) {
        this.cellData.groupID = this.groupID;
      }
      this.updateElement();
    }
  }

  private isDisabled: boolean = false;
  @Input('disabled')
  set disabled(value: boolean) {
    this.isDisabled = value;
    this.updateElement();
  }

  @Input()
  groupID!: string;

  get element(): HTMLElement {
    return this.el.nativeElement;
  }

  @Output() selectionStart = new EventEmitter<any>();
  @Output() selectionEnd = new EventEmitter<any>();

  subscription!: Subscription;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private service: McvTimeLineService
  ) { }

  ngOnInit(): void {
    // this.updateElement();

    this.subscribeToSelection();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateElement() {
    if (!this.isDisabled) {
      this.renderer.addClass(this.element, 'tl-selection-cell');
    } else {
      this.renderer.removeClass(this.element, 'tl-selection-cell');
    }
    this.renderer.removeStyle(this.element, 'width');
    this.renderer.setStyle(this.element, 'width', `${this.cellData.width}px`);

    const div = this.renderer.createElement('div');
    this.renderer.addClass(div, 'tl-selection-cell-content');
    this.renderer.appendChild(this.el.nativeElement, div);
    if (this.cellData && this.groupID) {
      this.cellData.groupID = this.groupID;
    }

  }

  @HostListener('mousedown', ['$event'])
  onMouseDown() {
    if (this.cellData) {
      this.service.startCellSelection(this.cellData);
      this.selectionStart.emit(this.cellData);
      this.renderer.addClass(this.element, 'selected');
    }
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver() {
    if (this.service.isCellSelectionActive) {

      if (this.cellData && this.service.selectedCellGroup?.groupID.toString() === this.cellData.groupID.toString()) {
        this.service.addSelectionCell(this.cellData);
        this.renderer.addClass(this.element, 'selected');

      }
    }
  }


  @HostListener('mouseup', ['$event'])
  onMouseUp() {
    // console.log('onMouseUp', this.service.selectedCells, this.service.selectedCellGroup);
    this.service.stopCellSelection();
    if (this.cellData) {
      this.selectionEnd.emit({
        groupID: this.groupID,
        cells: this.service.selectedCells,
        group: this.service.selectedCellGroup
      });
    }
  }

  subscribeToSelection() {
    this.subscription = this.service.clearCellSelection.subscribe((value: any) => {
      if (value) {
        this.renderer.removeClass(this.element, 'selected');
      }

    });
  }
}
