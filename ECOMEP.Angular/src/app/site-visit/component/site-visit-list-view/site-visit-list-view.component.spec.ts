import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitevisitListViewComponent } from './site-visit-list-view.component';

describe('SitevisitListViewComponent', () => {
  let component: SitevisitListViewComponent;
  let fixture: ComponentFixture<SitevisitListViewComponent>;

  beforeEach(async() => {
      await TestBed.configureTestingModule({
      imports: [SitevisitListViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SitevisitListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
