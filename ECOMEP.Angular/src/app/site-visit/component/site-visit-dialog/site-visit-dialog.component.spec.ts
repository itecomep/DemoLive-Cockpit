import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SitevisitDialogComponent } from './site-visit-dialog.component';

describe('SitevisitDialogComponent', () => {
  let component: SitevisitDialogComponent;
  let fixture: ComponentFixture<SitevisitDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SitevisitDialogComponent]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SitevisitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
