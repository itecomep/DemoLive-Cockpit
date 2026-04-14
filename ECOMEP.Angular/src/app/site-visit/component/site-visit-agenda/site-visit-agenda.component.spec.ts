import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitevisitAgendaComponent } from './site-visit-agenda.component';

describe('SitevisitAgendaComponent', () => {
  let component: SitevisitAgendaComponent;
  let fixture: ComponentFixture<SitevisitAgendaComponent>;

  beforeEach(async() => {
      await TestBed.configureTestingModule({
      imports: [SitevisitAgendaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SitevisitAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
