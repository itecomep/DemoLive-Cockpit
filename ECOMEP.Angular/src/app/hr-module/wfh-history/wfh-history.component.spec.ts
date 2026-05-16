import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfhHistoryComponent } from './wfh-history.component';

describe('WfhHistoryComponent', () => {
  let component: WfhHistoryComponent;
  let fixture: ComponentFixture<WfhHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WfhHistoryComponent]
    });
    fixture = TestBed.createComponent(WfhHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
