import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitevisitAgendaFileListComponent } from './sitevisit-agenda-file-list.component';
import { before } from 'lodash';

describe('SitevisitAgendaFileListComponent', () => {
  let component: SitevisitAgendaFileListComponent;
  let fixture: ComponentFixture<SitevisitAgendaFileListComponent>;

  beforeEach(async() => {
      await TestBed.configureTestingModule({
      imports: [SitevisitAgendaFileListComponent]
    })
    .compileComponents();

  });

    beforeEach(()=> {
    fixture = TestBed.createComponent(SitevisitAgendaFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
