import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { McvPopoverPlacement } from '../../models/mcv-popover-placements';
import { McvPopoverDirective } from '../../directives/mcv-popover.directive';
import { NgClass } from '@angular/common';

@Component({
    selector: 'mcv-popover-content',
    templateUrl: './mcv-popover-content.component.html',
    styleUrls: ['./mcv-popover-content.component.scss'],
    standalone: true,
    imports: [NgClass]
})
export class McvPopoverContentComponent implements AfterViewInit, OnDestroy
{
  // -------------------------------------------------------------------------
  // Inputs / Outputs
  // -------------------------------------------------------------------------
  @Input()
  public content!: string;
  @Input() public placement: McvPopoverPlacement = McvPopoverPlacement.Top;
  @Input()
  public title!: string;
  @Input()
  public parentClass!: string;
  @Input() public animation = true;
  @Input() public closeOnClickOutside = false;
  @Input() public closeOnMouseOutside = false;
  @Input() public appendToBody = false;
  @Input() public size: 'small' | 'medium-small' | 'medium' | 'large' | 'auto' = 'small';

  // -------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------
  @ViewChild('popoverDiv', { static: true })
  public popoverDiv!: ElementRef;

  public popover!: McvPopoverDirective;
  public onCloseFromOutside = new EventEmitter();
  public top = -10000;
  public left = -10000;
  public isIn = false;
  public effectivePlacement!: string;
  public opacity = 0;
  public transitionEnabled = false;

  public windowWidth = window.innerWidth;
  public windowHeight = window.innerHeight;

  public listenClickFunc: any;
  public listenMouseFunc: any;
  public listenTouchFunc: any;

  // -------------------------------------------------------------------------
  // Anonymous
  // -------------------------------------------------------------------------

  /**
   * Closes dropdown if user clicks outside of this directive.
   */
  public onDocumentMouseDown = (event: any) =>
  {
    const element = this.element.nativeElement;
    if (!element || !this.popover)
    {
      return;
    }
    if (element.contains(event.target) || this.popover.getElement().contains(event.target))
    {
      return;
    }
    this.onCloseFromOutside.emit(undefined);
  }

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  constructor(protected element: ElementRef,
    protected cdr: ChangeDetectorRef,
    protected renderer: Renderer2)
  {
  }

  // -------------------------------------------------------------------------
  // Lifecycle callbacks
  // -------------------------------------------------------------------------

  public ngAfterViewInit(): void
  {
    if (this.closeOnClickOutside)
    {
      this.listenClickFunc = this.renderer.listen('document', 'mousedown', (event: any) => this.onDocumentMouseDown(event));
    }
    if (this.closeOnMouseOutside)
    {
      this.listenMouseFunc = this.renderer.listen('document', 'mouseover', (event: any) => this.onDocumentMouseDown(event));
    }
    // Always close on mobile touch event outside.
    this.listenTouchFunc = this.renderer.listen('document', 'touchstart', (event: any) => this.onDocumentMouseDown(event));

    this.show();
    this.cdr.detectChanges();
  }

  public ngOnDestroy(): void
  {
    if (this.closeOnClickOutside && this.listenClickFunc)
    {
      this.listenClickFunc();
    }
    if (this.closeOnMouseOutside && this.listenMouseFunc)
    {
      this.listenMouseFunc();
    }
    if (!!this.listenTouchFunc)
    {
      this.listenTouchFunc();
    }
  }

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  @HostListener('window:resize', ['$event'])
  public onResize(event: any): void
  {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  public updatePosition(): void
  {
    // if visible, reposition
    if (this.opacity)
    {
      const p = this.positionElements(this.popover.getElement(), this.popoverDiv.nativeElement, this.placement);
      this.top = p.top;
      this.left = p.left;
    }
  }

  public show(): void
  {
    if (!this.popover || !this.popover.getElement())
    {
      return;
    }

    const p = this.positionElements(this.popover.getElement(), this.popoverDiv.nativeElement, this.placement);
    this.top = p.top;
    this.left = p.left;
    this.isIn = true;
    this.transitionEnabled = true;
    this.opacity = 1;
  }

  public hide(): void
  {
    this.top = -10000;
    this.left = -10000;
    this.isIn = true;
    this.popover.hide();
  }

  public hideFromPopover(): void
  {
    this.top = -10000;
    this.left = -10000;
    this.isIn = true;
    this.transitionEnabled = false;
    this.opacity = 0;
  }

  // -------------------------------------------------------------------------
  // Protected Methods
  // -------------------------------------------------------------------------

  protected positionElements(hostEl: HTMLElement, targetEl: HTMLElement, positionStr: McvPopoverPlacement, appendToBody: boolean = false): { top: number, left: number }
  {
    const positionStrParts = (positionStr as string).split(' ');
    let pos0 = positionStrParts[0];
    const pos1 = positionStrParts[1] || 'center';
    const hostElPos = this.appendToBody || appendToBody ? this.offset(hostEl) : this.position(hostEl);
    const targetElWidth = targetEl.offsetWidth;
    const targetElHeight = targetEl.offsetHeight;

    this.effectivePlacement = pos0 = this.getEffectivePlacement(pos0, hostEl, targetEl);

    const shiftWidth: any = {
      center: function (): number
      {
        return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
      },
      left: function (): number
      {
        return hostElPos.left;
      },
      right: function (): number
      {
        return hostElPos.left + hostElPos.width;
      },
      topOrBottomRight: function (): number
      {
        return hostElPos.left + hostElPos.width / 2;
      },
      topOrBottomLeft: function (): number
      {
        return hostElPos.left - targetElWidth + hostElPos.width / 2;
      }
    };

    const shiftHeight: any = {
      center: function (): number
      {
        return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
      },
      top: function (): number
      {
        return hostElPos.top;
      },
      bottom: function (): number
      {
        return hostElPos.top + hostElPos.height;
      }
    };

    let targetElPos: { top: number, left: number };
    switch (pos0)
    {
      case McvPopoverPlacement.Right:
        targetElPos = {
          top: shiftHeight[pos1](),
          left: shiftWidth[pos0]()
        };
        break;

      case McvPopoverPlacement.Left:
        targetElPos = {
          top: shiftHeight[pos1](),
          left: hostElPos.left - targetElWidth
        };
        break;

      case McvPopoverPlacement.Bottom:
        targetElPos = {
          top: shiftHeight[pos0](),
          left: shiftWidth[pos1]()
        };
        break;
      case McvPopoverPlacement.TopLeft:
        targetElPos = {
          top: hostElPos.top - targetElHeight,
          left: shiftWidth['topOrBottomLeft']()
        };
        break;
      case McvPopoverPlacement.TopRight:
        targetElPos = {
          top: hostElPos.top - targetElHeight,
          left: shiftWidth['topOrBottomRight']()
        };
        break;
      case McvPopoverPlacement.BottomLeft:
        targetElPos = {
          top: shiftHeight[McvPopoverPlacement.Bottom](),
          left: shiftWidth['topOrBottomLeft']()
        };
        break;
      case McvPopoverPlacement.BottomRight:
        targetElPos = {
          top: shiftHeight[McvPopoverPlacement.Bottom](),
          left: shiftWidth['topOrBottomRight']()
        };
        break;

      default:
        targetElPos = {
          top: hostElPos.top - targetElHeight,
          left: shiftWidth[pos1]()
        };
        break;
    }

    return targetElPos;
  }

  protected position(nativeEl: HTMLElement): { width: number, height: number, top: number, left: number }
  {
    let offsetParentBCR = { top: 0, left: 0 };
    const elBCR = this.offset(nativeEl);
    const offsetParentEl = this.parentOffsetEl(nativeEl);
    if (offsetParentEl !== window.document)
    {
      offsetParentBCR = this.offset(offsetParentEl);
      offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
      offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
    }

    const boundingClientRect = nativeEl.getBoundingClientRect();
    return {
      width: boundingClientRect.width || nativeEl.offsetWidth,
      height: boundingClientRect.height || nativeEl.offsetHeight,
      top: elBCR.top - offsetParentBCR.top,
      left: elBCR.left - offsetParentBCR.left
    };
  }

  protected offset(nativeEl: any): { width: number, height: number, top: number, left: number }
  {
    const boundingClientRect = nativeEl.getBoundingClientRect();
    return {
      width: boundingClientRect.width || nativeEl.offsetWidth,
      height: boundingClientRect.height || nativeEl.offsetHeight,
      top: boundingClientRect.top + (window.pageYOffset || window.document.documentElement.scrollTop),
      left: boundingClientRect.left + (window.pageXOffset || window.document.documentElement.scrollLeft)
    };
  }

  protected getStyle(nativeEl: HTMLElement, cssProp: string): string
  {
    if ((nativeEl as any).currentStyle)
    { // IE
      return (nativeEl as any).currentStyle[cssProp];
    }

    if (window.getComputedStyle)
    {
      return (window.getComputedStyle as any)(nativeEl)[cssProp];
    }

    // finally try and get inline style
    return (nativeEl.style as any)[cssProp];
  }

  protected isStaticPositioned(nativeEl: HTMLElement): boolean
  {
    return (this.getStyle(nativeEl, 'position') || 'static') === 'static';
  }

  protected parentOffsetEl(nativeEl: HTMLElement): any
  {
    let offsetParent: any = nativeEl.offsetParent || window.document;
    while (offsetParent && offsetParent !== window.document && this.isStaticPositioned(offsetParent))
    {
      offsetParent = offsetParent.offsetParent;
    }
    return offsetParent || window.document;
  }

  // Check for overflow of the viewport and reflect the position if necessary.
  protected getEffectivePlacement(placement: string, hostElement: HTMLElement, targetElement: HTMLElement): string
  {
    const hostElBoundingRect = hostElement.getBoundingClientRect();

    const desiredPlacement = placement || McvPopoverPlacement.Top;

    // Determines if a popover overflows in a direction when in a specific position.
    const overflows = {
      positionTop: {
        top: hostElBoundingRect.top - targetElement.offsetHeight < 0,
        right: hostElBoundingRect.left + hostElBoundingRect.width / 2 + targetElement.offsetWidth / 2 > this.windowWidth,
        left: hostElBoundingRect.left + hostElBoundingRect.width / 2 - targetElement.offsetWidth / 2 < 0
      },
      positionTopRight: {
        top: hostElBoundingRect.top - targetElement.offsetHeight < 0,
        right: hostElBoundingRect.right + targetElement.offsetWidth > this.windowWidth
      },
      positionRight: {
        top: hostElBoundingRect.top + hostElBoundingRect.height / 2 - targetElement.offsetHeight / 2 < 0,
        right: hostElBoundingRect.right + targetElement.offsetWidth > this.windowWidth,
        bottom: hostElBoundingRect.top + hostElBoundingRect.height / 2 + targetElement.offsetHeight / 2 > this.windowHeight
      },
      positionBottomRight: {
        right: hostElBoundingRect.right + targetElement.offsetWidth > this.windowWidth,
        bottom: hostElBoundingRect.bottom + targetElement.offsetHeight > this.windowHeight
      },
      positionBottom: {
        right: hostElBoundingRect.left + hostElBoundingRect.width / 2 + targetElement.offsetWidth / 2 > this.windowWidth,
        bottom: hostElBoundingRect.bottom + targetElement.offsetHeight > this.windowHeight,
        left: hostElBoundingRect.left + hostElBoundingRect.width / 2 - targetElement.offsetWidth / 2 < 0
      },
      positionBottomLeft: {
        bottom: hostElBoundingRect.bottom + targetElement.offsetHeight > this.windowHeight,
        left: hostElBoundingRect.left - targetElement.offsetWidth < 0
      },
      positionLeft: {
        left: hostElBoundingRect.left < targetElement.offsetWidth,
        top: hostElBoundingRect.top + hostElBoundingRect.height / 2 - targetElement.offsetHeight / 2 < 0,
        bottom: hostElBoundingRect.top + hostElBoundingRect.height / 2 + targetElement.offsetHeight / 2 > this.windowHeight
      },
      positionTopLeft: {
        top: hostElBoundingRect.top - targetElement.offsetHeight < 0,
        left: hostElBoundingRect.left - targetElement.offsetWidth < 0
      }
    }

    if (desiredPlacement === McvPopoverPlacement.Top)
    {
      // If it overflows on the top AND left, go to bottom-right.
      if (overflows.positionTop.top && overflows.positionTop.left)
      {
        return McvPopoverPlacement.BottomRight;

        // If it overflows on the top AND right, go to bottom-left.
      } else if (overflows.positionTop.top && overflows.positionTop.right)
      {
        return McvPopoverPlacement.BottomLeft;

        // If it only overflows on the top, go to bottom.
      } else if (overflows.positionTop.top)
      {
        return McvPopoverPlacement.Bottom;

        // If it only overflows to the right, go to top-left.
      } else if (overflows.positionTop.right)
      {
        return McvPopoverPlacement.TopLeft;

        // If it only overflows to the left, go to top-right.
      } else if (overflows.positionTop.left)
      {
        return McvPopoverPlacement.TopRight;

      } else
      {
        return McvPopoverPlacement.Top;
      }
    }

    if (desiredPlacement === McvPopoverPlacement.TopRight)
    {
      // If it overflows on the top AND the right, try in the order: bottom, Bottom-left, left.
      if (overflows.positionTopRight.top && overflows.positionTopRight.right)
      {
        if (overflows.positionBottom.bottom)
        {
          return McvPopoverPlacement.Left;
        } else if (overflows.positionBottom.right)
        {
          return McvPopoverPlacement.BottomLeft;
        } else
        {
          return McvPopoverPlacement.Bottom;
        }

        // If it only overflows on the top, try in the order: right, bottom-right.
      } else if (overflows.positionTopRight.top)
      {
        if (overflows.positionRight.top)
        {
          return McvPopoverPlacement.BottomRight;
        } else
        {
          return McvPopoverPlacement.Right;
        }

        // If it only overflows on the right, try in the order: top, top-left.
      } else if (overflows.positionTopRight.right)
      {
        if (overflows.positionTop.right)
        {
          return McvPopoverPlacement.TopLeft;
        } else
        {
          return McvPopoverPlacement.Top;
        }

      } else
      {
        return McvPopoverPlacement.TopRight;
      }
    }

    if (desiredPlacement === McvPopoverPlacement.Right)
    {
      // If it overflows on the right AND the top, try in the order: bottom-right, bottom, bottom-left.
      if (overflows.positionRight.right && overflows.positionRight.top)
      {
        if (overflows.positionBottomRight.right && overflows.positionBottom.right)
        {
          return McvPopoverPlacement.BottomLeft;
        } else if (overflows.positionBottomRight.right)
        {
          return McvPopoverPlacement.Bottom;
        } else
        {
          return McvPopoverPlacement.BottomRight;
        }

        // If it overflows on the right AND the bottom, try in the order: top-right, top, top-left.
      } else if (overflows.positionRight.right && overflows.positionRight.bottom)
      {
        if (overflows.positionTopRight.right && overflows.positionTop.right)
        {
          return McvPopoverPlacement.TopLeft;
        } else if (overflows.positionTopRight.right)
        {
          return McvPopoverPlacement.Top;
        } else
        {
          return McvPopoverPlacement.TopRight;
        }

        // If it only overflows on the right, try all top positions from right to left, then try all bottom positions right to left.
      } else if (overflows.positionRight.right)
      {
        if (overflows.positionTop.top)
        {
          if (overflows.positionBottom.right)
          {
            return McvPopoverPlacement.BottomLeft;
          } else if (overflows.positionBottomRight.right)
          {
            return McvPopoverPlacement.Bottom;
          } else
          {
            return McvPopoverPlacement.BottomRight;
          }
        } else
        {
          if (overflows.positionTop.right)
          {
            return McvPopoverPlacement.TopLeft;
          } else if (overflows.positionTopRight.right)
          {
            return McvPopoverPlacement.Top;
          } else
          {
            return McvPopoverPlacement.TopRight;
          }
        }

        // If it only over flows on the top, go bottom-right.
      } else if (overflows.positionRight.top)
      {
        return McvPopoverPlacement.BottomRight;

        // If it only overflows on the bottom, go top-right.
      } else if (overflows.positionRight.bottom)
      {
        return McvPopoverPlacement.TopRight;

      } else
      {
        return McvPopoverPlacement.Right;
      }
    }

    if (desiredPlacement === McvPopoverPlacement.BottomRight)
    {
      // If it overflows on the bottom AND the right, try in the order: top, top-left, left.
      if (overflows.positionBottomRight.bottom && overflows.positionBottomRight.right)
      {
        if (overflows.positionTop.top)
        {
          return McvPopoverPlacement.Left;
        } else if (overflows.positionTop.right)
        {
          return McvPopoverPlacement.TopLeft;
        } else
        {
          return McvPopoverPlacement.Top;
        }

        // If it only overflows on the bottom, try in the order: right, top-right.
      } else if (overflows.positionBottomRight.bottom)
      {
        if (overflows.positionRight.bottom)
        {
          return McvPopoverPlacement.TopRight;
        } else
        {
          return McvPopoverPlacement.Right;
        }

        // If it only overflows on the right, try in the order: bottom, bottom-left.
      } else if (overflows.positionBottomRight.right)
      {
        if (overflows.positionBottom.right)
        {
          return McvPopoverPlacement.BottomLeft;
        } else
        {
          return McvPopoverPlacement.Bottom;
        }

      } else
      {
        return McvPopoverPlacement.BottomRight;
      }
    }

    if (desiredPlacement === McvPopoverPlacement.Bottom)
    {
      // If it overflows on the bottom AND left, go to top-right.
      if (overflows.positionBottom.bottom && overflows.positionBottom.left)
      {
        return McvPopoverPlacement.TopRight;

        // If it overflows on the bottom AND right, go to top-left.
      } else if (overflows.positionBottom.bottom && overflows.positionBottom.right)
      {
        return McvPopoverPlacement.TopLeft;

        // If it only overflows on the bottom, go to top.
      } else if (overflows.positionBottom.bottom)
      {
        return McvPopoverPlacement.Top;

        // If it only overflows to the right, go to bottom-left.
      } else if (overflows.positionBottom.right)
      {
        return McvPopoverPlacement.BottomLeft;

        // If it only overflows to the left, go to bottom-right.
      } else if (overflows.positionBottom.left)
      {
        return McvPopoverPlacement.BottomRight;

      } else
      {
        return McvPopoverPlacement.Bottom;
      }
    }

    if (desiredPlacement === McvPopoverPlacement.BottomLeft)
    {
      // If it overflows on the bottom AND the left, try in the order: top, top-right, right.
      if (overflows.positionBottomLeft.bottom && overflows.positionBottomLeft.left)
      {
        if (overflows.positionTop.top)
        {
          return McvPopoverPlacement.Right;
        } else if (overflows.positionTop.left)
        {
          return McvPopoverPlacement.TopRight;
        } else
        {
          return McvPopoverPlacement.Top;
        }

        // If it only overflows on the bottom, try in the order: left, top-left.
      } else if (overflows.positionBottomLeft.bottom)
      {
        if (overflows.positionLeft.bottom)
        {
          return McvPopoverPlacement.TopLeft;
        } else
        {
          return McvPopoverPlacement.Left;
        }

        // If it only overflows on the left, try in the order: bottom, bottom-right.
      } else if (overflows.positionBottomLeft.left)
      {
        if (overflows.positionBottom.left)
        {
          return McvPopoverPlacement.BottomRight;
        } else
        {
          return McvPopoverPlacement.Bottom;
        }

      } else
      {
        return McvPopoverPlacement.BottomLeft;
      }
    }

    if (desiredPlacement === McvPopoverPlacement.Left)
    {
      // If it overflows on the left AND the top, try in the order: bottom-left, bottom, bottom-right.
      if (overflows.positionLeft.left && overflows.positionLeft.top)
      {
        if (overflows.positionBottomLeft.left && overflows.positionBottom.left)
        {
          return McvPopoverPlacement.BottomRight;
        } else if (overflows.positionBottomRight.right)
        {
          return McvPopoverPlacement.Bottom;
        } else
        {
          return McvPopoverPlacement.BottomLeft;
        }

        // If it overflows on the left AND the bottom, try in the order: top-left, top, top-right.
      } else if (overflows.positionLeft.left && overflows.positionLeft.bottom)
      {
        if (overflows.positionTopLeft.left && overflows.positionTop.left)
        {
          return McvPopoverPlacement.TopRight;
        } else if (overflows.positionTopLeft.left)
        {
          return McvPopoverPlacement.Top;
        } else
        {
          return McvPopoverPlacement.TopLeft;
        }

        // If it only overflows on the left, try all top positions from left to right, then try all bottom positions left to right.
      } else if (overflows.positionLeft.left)
      {
        if (overflows.positionTop.top)
        {
          if (overflows.positionBottom.left)
          {
            return McvPopoverPlacement.BottomRight;
          } else if (overflows.positionBottomLeft.left)
          {
            return McvPopoverPlacement.Bottom;
          } else
          {
            return McvPopoverPlacement.BottomLeft;
          }
        } else
        {
          if (overflows.positionTop.left)
          {
            return McvPopoverPlacement.TopRight;
          } else if (overflows.positionTopLeft.left)
          {
            return McvPopoverPlacement.Top;
          } else
          {
            return McvPopoverPlacement.TopLeft;
          }
        }

        // If it only over flows on the top, go bottom-left.
      } else if (overflows.positionLeft.top)
      {
        return McvPopoverPlacement.BottomLeft;

        // If it only overflows on the bottom, go top-left.
      } else if (overflows.positionLeft.bottom)
      {
        return McvPopoverPlacement.TopLeft;

      } else
      {
        return McvPopoverPlacement.Left;
      }
    }

    if (desiredPlacement === McvPopoverPlacement.TopLeft)
    {
      // If it overflows on the top AND the left, try in the order: bottom, Bottom-right, right.
      if (overflows.positionTopLeft.top && overflows.positionTopLeft.left)
      {
        if (overflows.positionBottom.bottom)
        {
          return McvPopoverPlacement.Right;
        } else if (overflows.positionBottom.left)
        {
          return McvPopoverPlacement.BottomRight;
        } else
        {
          return McvPopoverPlacement.Bottom;
        }

        // If it only overflows on the top, try in the order: left, bottom-left.
      } else if (overflows.positionTopLeft.top)
      {
        if (overflows.positionLeft.top)
        {
          return McvPopoverPlacement.BottomLeft;
        } else
        {
          return McvPopoverPlacement.Left;
        }

        // If it only overflows on the left, try in the order: top, top-right.
      } else if (overflows.positionTopLeft.left)
      {
        if (overflows.positionTop.left)
        {
          return McvPopoverPlacement.TopRight;
        } else
        {
          return McvPopoverPlacement.Top;
        }

      } else
      {
        return McvPopoverPlacement.TopLeft;
      }
    }

    return desiredPlacement;
  }
}