import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvFilterSidenavComponent } from './mcv-filter-sidenav.component';

describe('McvFilterSidenavComponent', () => {
  let component: McvFilterSidenavComponent;
  let fixture: ComponentFixture<McvFilterSidenavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [McvFilterSidenavComponent]
    });
    fixture = TestBed.createComponent(McvFilterSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
