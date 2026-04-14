import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfTaskListItemComponent } from './wf-task-list-item.component';

describe('WfTaskListItemComponent', () => {
  let component: WfTaskListItemComponent;
  let fixture: ComponentFixture<WfTaskListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WfTaskListItemComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(WfTaskListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
