import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvTimeLineComponent } from './mcv-time-line.component';

describe('McvTimeLineComponent', () => {
  let component: McvTimeLineComponent;
  let fixture: ComponentFixture<McvTimeLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [McvTimeLineComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(McvTimeLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
