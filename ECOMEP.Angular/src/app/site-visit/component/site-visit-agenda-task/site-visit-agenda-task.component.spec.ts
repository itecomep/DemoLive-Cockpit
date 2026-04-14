import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitevisitAgendaTaskComponent } from './site-visit-agenda-task.component';

describe('SitevisitAgendaTaskComponent', () => {
  let component: SitevisitAgendaTaskComponent;
  let fixture: ComponentFixture<SitevisitAgendaTaskComponent>;

  beforeEach(async() => {
      await TestBed.configureTestingModule({
      imports: [SitevisitAgendaTaskComponent]
    })
    .compileComponents();
  });
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [SitevisitAgendaTaskComponent] })
    fixture = TestBed.createComponent(SitevisitAgendaTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
