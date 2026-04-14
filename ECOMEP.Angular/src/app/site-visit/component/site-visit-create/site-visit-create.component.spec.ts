import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitevisitCreateComponent } from './site-visit-create.component';

describe('SitevisitCreateComponent', () => {
  let component: SitevisitCreateComponent;
  let fixture: ComponentFixture<SitevisitCreateComponent>;

  beforeEach(async () => {
      await TestBed.configureTestingModule({
      imports: [SitevisitCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SitevisitCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
