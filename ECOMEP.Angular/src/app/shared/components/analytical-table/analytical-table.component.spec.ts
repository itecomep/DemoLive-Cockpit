import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticalTableComponent } from './analytical-table.component';

describe('AnalyticalTableComponent', () => {
  let component: AnalyticalTableComponent;
  let fixture: ComponentFixture<AnalyticalTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AnalyticalTableComponent]
    });
    fixture = TestBed.createComponent(AnalyticalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
