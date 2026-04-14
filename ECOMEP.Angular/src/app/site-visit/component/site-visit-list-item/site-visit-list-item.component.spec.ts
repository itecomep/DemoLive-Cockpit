import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitevisitListItemComponent } from './site-visit-list-item.component';

describe('SitevisitListItemComponent', () => {
  let component: SitevisitListItemComponent;
  let fixture: ComponentFixture<SitevisitListItemComponent>;

  beforeEach(async() => {
      await TestBed.configureTestingModule({
      imports: [SitevisitListItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SitevisitListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
