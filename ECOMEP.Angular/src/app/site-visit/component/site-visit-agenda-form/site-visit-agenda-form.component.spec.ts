import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitevisitAgendaFormComponent } from './site-visit-agenda-form.component';

describe('SitevisitAgendaFormComponent', () => {
  let component: SitevisitAgendaFormComponent;
  let fixture: ComponentFixture<SitevisitAgendaFormComponent>;

  beforeEach(async() => {
      await TestBed.configureTestingModule({
      imports: [SitevisitAgendaFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SitevisitAgendaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
