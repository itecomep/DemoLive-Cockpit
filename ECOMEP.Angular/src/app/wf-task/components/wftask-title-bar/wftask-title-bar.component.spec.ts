import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WftaskTitleBarComponent } from './wftask-title-bar.component';

describe('WftaskTitleBarComponent', () => {
  let component: WftaskTitleBarComponent;
  let fixture: ComponentFixture<WftaskTitleBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WftaskTitleBarComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(WftaskTitleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
