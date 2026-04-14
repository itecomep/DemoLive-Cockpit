import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvLightBoxComponent } from './mcv-light-box.component';

describe('McvLightBoxComponent', () => {
  let component: McvLightBoxComponent;
  let fixture: ComponentFixture<McvLightBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [McvLightBoxComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McvLightBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
