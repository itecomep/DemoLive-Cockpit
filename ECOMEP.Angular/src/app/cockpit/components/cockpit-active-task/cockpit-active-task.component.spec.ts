import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CockpitActiveTaskComponent } from './cockpit-active-task.component';

describe('CockpitActiveTaskComponent', () => {
  let component: CockpitActiveTaskComponent;
  let fixture: ComponentFixture<CockpitActiveTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CockpitActiveTaskComponent]
    });
    fixture = TestBed.createComponent(CockpitActiveTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
