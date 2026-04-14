import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRequestTicketViewComponent } from './project-request-ticket-view.component';

describe('ProjectRequestTicketViewComponent', () => {
  let component: ProjectRequestTicketViewComponent;
  let fixture: ComponentFixture<ProjectRequestTicketViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ProjectRequestTicketViewComponent]
});
    fixture = TestBed.createComponent(ProjectRequestTicketViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
