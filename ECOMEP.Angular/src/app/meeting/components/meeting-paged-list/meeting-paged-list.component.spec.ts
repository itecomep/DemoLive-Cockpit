import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingPagedListComponent } from './meeting-paged-list.component';

describe('MeetingPagedListComponent', () => {
  let component: MeetingPagedListComponent;
  let fixture: ComponentFixture<MeetingPagedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MeetingPagedListComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(MeetingPagedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
