import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoAgendaComponent } from './todo-agenda.component';

describe('TodoAgendaComponent', () => {
  let component: TodoAgendaComponent;
  let fixture: ComponentFixture<TodoAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TodoAgendaComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TodoAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
