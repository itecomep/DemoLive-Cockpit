import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfTaskListViewComponent } from './wf-task-list-view.component';

describe('WfTaskListViewComponent', () => {
  let component: WfTaskListViewComponent;
  let fixture: ComponentFixture<WfTaskListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WfTaskListViewComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(WfTaskListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
