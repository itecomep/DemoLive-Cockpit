import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistCreateComponent } from './checklist-create.component';

describe('ChecklistCreateComponent', () => {
  let component: ChecklistCreateComponent;
  let fixture: ComponentFixture<ChecklistCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChecklistCreateComponent]
    });
    fixture = TestBed.createComponent(ChecklistCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
