import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfTaskActionComponent } from './wf-task-action.component';

describe('WfTaskActionComponent', () => {
  let component: WfTaskActionComponent;
  let fixture: ComponentFixture<WfTaskActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WfTaskActionComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(WfTaskActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
