import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsentsComponent } from './absents.component';

describe('AbsentsComponent', () => {
  let component: AbsentsComponent;
  let fixture: ComponentFixture<AbsentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AbsentsComponent]
    });
    fixture = TestBed.createComponent(AbsentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
