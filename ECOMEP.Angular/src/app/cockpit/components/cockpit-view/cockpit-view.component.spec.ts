import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CockpitViewComponent } from './cockpit-view.component';

describe('CockpitViewComponent', () => {
  let component: CockpitViewComponent;
  let fixture: ComponentFixture<CockpitViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CockpitViewComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CockpitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
