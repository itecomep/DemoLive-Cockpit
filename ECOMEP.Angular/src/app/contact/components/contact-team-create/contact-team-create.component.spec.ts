import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTeamCreateComponent } from './contact-team-create.component';

describe('ContactTeamCreateComponent', () => {
  let component: ContactTeamCreateComponent;
  let fixture: ComponentFixture<ContactTeamCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ContactTeamCreateComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ContactTeamCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
