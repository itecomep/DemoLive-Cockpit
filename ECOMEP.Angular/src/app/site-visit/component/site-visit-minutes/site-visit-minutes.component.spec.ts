import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SitevisitMinutesComponent } from './site-visit-minutes.component';
describe('SitevisitMinutesComponent', () => {
  let component: SitevisitMinutesComponent;
  let fixture: ComponentFixture<SitevisitMinutesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SitevisitMinutesComponent]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SitevisitMinutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
