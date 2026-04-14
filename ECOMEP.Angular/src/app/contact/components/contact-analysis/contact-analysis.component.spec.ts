import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAnalysisComponent } from './contact-analysis.component';

describe('ContactAnalysisComponent', () => {
  let component: ContactAnalysisComponent;
  let fixture: ComponentFixture<ContactAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ContactAnalysisComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ContactAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
