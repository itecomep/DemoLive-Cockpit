import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CockpitTaskListItemComponent } from './cockpit-task-list-item.component';

describe('CockpitTaskListItemComponent', () => {
  let component: CockpitTaskListItemComponent;
  let fixture: ComponentFixture<CockpitTaskListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CockpitTaskListItemComponent]
    });
    fixture = TestBed.createComponent(CockpitTaskListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
