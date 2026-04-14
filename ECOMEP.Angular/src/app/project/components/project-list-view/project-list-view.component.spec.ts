import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListViewComponent } from './project-list-view.component';

describe('ProjectListViewComponent', () => {
  let component: ProjectListViewComponent;
  let fixture: ComponentFixture<ProjectListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProjectListViewComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ProjectListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
