import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CockpitActivityComponent } from './cockpit-activity.component';

describe('CockpitActivityComponent', () => {
  let component: CockpitActivityComponent;
  let fixture: ComponentFixture<CockpitActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CockpitActivityComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CockpitActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
