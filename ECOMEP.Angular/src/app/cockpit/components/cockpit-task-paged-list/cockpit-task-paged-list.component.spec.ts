import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CockpitTaskPagedListComponent } from './cockpit-task-paged-list.component';

describe('CockpitTaskPagedListComponent', () => {
  let component: CockpitTaskPagedListComponent;
  let fixture: ComponentFixture<CockpitTaskPagedListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CockpitTaskPagedListComponent]
    });
    fixture = TestBed.createComponent(CockpitTaskPagedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
