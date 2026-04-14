import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitevisitAttendeeFormComponent } from './site-visit-attendee-form.component';

describe('SitevisitAttendeeFormComponent', () => {
  let component: SitevisitAttendeeFormComponent;
  let fixture: ComponentFixture<SitevisitAttendeeFormComponent>;

  beforeEach(async() => {
      await TestBed.configureTestingModule({
      imports: [SitevisitAttendeeFormComponent]
    })
    .compileComponents();

  
    fixture = TestBed.createComponent(SitevisitAttendeeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
