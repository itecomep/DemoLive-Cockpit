import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-mcv-filter-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './mcv-filter-sidenav.component.html',
  styleUrls: ['./mcv-filter-sidenav.component.scss']
})
export class McvFilterSidenavComponent {
  isSidenavOpen = false;
  @Output() refreshFiltersEvent = new EventEmitter<void>();
  @Output() sidenavClose = new EventEmitter<void>();

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  closeSidenav() {
    this.isSidenavOpen = false;
    this.sidenavClose.emit();
  }

  onRefreshFilters(): void {
    this.refreshFiltersEvent.emit(); // Emit the event to the parent
  }

  onSidenavClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
