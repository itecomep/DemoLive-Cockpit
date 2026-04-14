import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitevisitMinutesViewComponent } from './site-visit-minutes-view.component';

describe('SitevisitMinutesViewComponent', () => {
  let component: SitevisitMinutesViewComponent;
  let fixture: ComponentFixture<SitevisitMinutesViewComponent>;

  beforeEach(async() => {
      await TestBed.configureTestingModule({
      imports: [SitevisitMinutesViewComponent]
    })
    .compileComponents(); 
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(SitevisitMinutesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
