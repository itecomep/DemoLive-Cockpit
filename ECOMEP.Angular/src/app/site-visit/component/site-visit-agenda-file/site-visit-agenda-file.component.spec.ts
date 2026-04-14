import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitevisitAgendaFileComponent } from './site-visit-agenda-file.component';

describe('SitevisitAgendaFileComponent', () => {
  let component: SitevisitAgendaFileComponent;
  let fixture: ComponentFixture<SitevisitAgendaFileComponent>;

  beforeEach(async() => {
      await TestBed.configureTestingModule({
      imports: [SitevisitAgendaFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SitevisitAgendaFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
