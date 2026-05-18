import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStagePopupComponent } from './create-stage-popup.component';

describe('CreateStagePopupComponent', () => {
  let component: CreateStagePopupComponent;
  let fixture: ComponentFixture<CreateStagePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateStagePopupComponent]
    });
    fixture = TestBed.createComponent(CreateStagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
