import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfTaskPagedListComponent } from './wf-task-paged-list.component';

describe('WfTaskPagedListComponent', () => {
  let component: WfTaskPagedListComponent;
  let fixture: ComponentFixture<WfTaskPagedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WfTaskPagedListComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(WfTaskPagedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
