import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvTimeLineEventDetailComponent } from './mcv-time-line-event-detail.component';

describe('McvTimeLineEventDetailComponent', () => {
  let component: McvTimeLineEventDetailComponent;
  let fixture: ComponentFixture<McvTimeLineEventDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [McvTimeLineEventDetailComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(McvTimeLineEventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
