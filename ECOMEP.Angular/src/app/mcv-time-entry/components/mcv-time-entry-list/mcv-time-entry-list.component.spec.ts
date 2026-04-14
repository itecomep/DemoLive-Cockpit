import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvTimeEntryListComponent } from './mcv-time-entry-list.component';

describe('McvTimeEntryListComponent', () => {
  let component: McvTimeEntryListComponent;
  let fixture: ComponentFixture<McvTimeEntryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [McvTimeEntryListComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(McvTimeEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
