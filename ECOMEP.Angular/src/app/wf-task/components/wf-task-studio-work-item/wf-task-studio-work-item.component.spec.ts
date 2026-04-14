import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfTaskStudioWorkItemComponent } from './wf-task-studio-work-item.component';

describe('WfTaskStudioWorkItemComponent', () => {
  let component: WfTaskStudioWorkItemComponent;
  let fixture: ComponentFixture<WfTaskStudioWorkItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WfTaskStudioWorkItemComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(WfTaskStudioWorkItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
