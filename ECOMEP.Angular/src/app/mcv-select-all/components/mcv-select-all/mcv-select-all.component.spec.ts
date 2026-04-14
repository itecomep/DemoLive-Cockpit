import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvSelectAllComponent } from './mcv-select-all.component';

describe('McvSelectAllComponent', () => {
  let component: McvSelectAllComponent;
  let fixture: ComponentFixture<McvSelectAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [McvSelectAllComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(McvSelectAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
