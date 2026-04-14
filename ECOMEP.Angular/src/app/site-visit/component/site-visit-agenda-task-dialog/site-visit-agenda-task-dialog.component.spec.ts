import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitevisitAgendaTaskDialogComponent } from './site-visit-agenda-task-dialog.component';

describe('SitevisitAgendaTaskDialogComponent', () => {
  let component: SitevisitAgendaTaskDialogComponent;
  let fixture: ComponentFixture<SitevisitAgendaTaskDialogComponent>;

  beforeEach(async() => {
      await TestBed.configureTestingModule({
      imports: [SitevisitAgendaTaskDialogComponent]
    })
    .compileComponents();

  });
  beforeEach(() => {
    fixture = TestBed.createComponent(SitevisitAgendaTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
