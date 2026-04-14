import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoMeetingAgendaComponent } from './todo-meeting-agenda.component';

describe('TodoMeetingAgendaComponent', () => {
  let component: TodoMeetingAgendaComponent;
  let fixture: ComponentFixture<TodoMeetingAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TodoMeetingAgendaComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TodoMeetingAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
