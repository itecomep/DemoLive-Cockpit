import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitevisitPagedListComponent } from './site-visit-paged-list.component';

describe('SitevisitPagedListComponent', () => {
  let component: SitevisitPagedListComponent;
  let fixture: ComponentFixture<SitevisitPagedListComponent>;

  beforeEach(async() => {
      await TestBed.configureTestingModule({
      imports: [SitevisitPagedListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SitevisitPagedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
