import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from "@angular/material/core";

@Component({
  selector: 'app-analytical-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatOptionModule
],
  templateUrl: './analytical-table.component.html',
  styleUrls: ['./analytical-table.component.scss']
})
export class AnalyticalTableComponent {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() showTotals: boolean = false;
  @Input() enableFilters: boolean = false;
  @Input() stateKey: string = 'analytical-table';
  
  @Output() sortChange = new EventEmitter<any>();
  @Output() filterChange = new EventEmitter<any>();
  
  filteredData: any[] = [];
  originalData: any[] = [];
  
  // Dynamic filter properties
  filterProperties: { [key: string]: {
    keySearch: string;
    filtered: string[];
    distinct: string[];
    selected: string[];
  }} = {};
  
  sortState: {
    activeColumn: string;
    [key: string]: '' | 'newFirst' | 'oldFirst' | string;
  } = { activeColumn: '' };

  ngOnInit() {
    this.originalData = [...this.data];
    this.filteredData = [...this.data];
    this.initializeFilters();
    this.restoreState();
  }
  
  ngOnChanges() {
    this.originalData = [...this.data];
    this.filteredData = [...this.data];
    this.initializeFilters();
    this.restoreState();
  }
  
  private initializeFilters() {
    if (!this.enableFilters) return;
    
    this.columns.forEach(col => {
      if (col.filterable) {
        const distinctValues = [...new Set(this.data.map(x => x[col.key]))].sort();
        this.filterProperties[col.key] = {
          keySearch: '',
          filtered: [...distinctValues],
          distinct: [...distinctValues],
          selected: []
        };
        
        // Initialize sort state for column
        this.sortState[col.key] = '';
      }
    });
  }
  
  applyFilters() {
    let filteredList = [...this.originalData];
    
    // Apply column filters
    this.columns.forEach(col => {
      if (col.filterable && this.filterProperties[col.key]?.selected.length > 0) {
        filteredList = filteredList.filter(item =>
          this.filterProperties[col.key].selected.includes(item[col.key])
        );
      }
    });
    
    this.filteredData = filteredList;
    
    // Preserve sorting after filtering
    if (this.sortState.activeColumn) {
      this.applySorting();
    }
    
    this.filterChange.emit({
      filters: this.filterProperties,
      filteredCount: this.filteredData.length
    });
    
    this.saveState();
  }
  
  sortData(column: string) {
    if (column === '') {
      this.filteredData = [...this.originalData];
      this.sortState = { activeColumn: '' };
      this.columns.forEach(col => this.sortState[col.key] = '');
      this.applyFilters();
      return;
    }

    const currentSort = this.sortState[column];

    if (currentSort === 'newFirst') {
      this.sortState[column] = 'oldFirst';
    } else if (currentSort === 'oldFirst') {
      this.sortState[column] = '';
      this.sortState.activeColumn = '';
      this.filteredData = [...this.originalData];
      this.applyFilters();
      return;
    } else {
      this.sortState[column] = 'newFirst';
    }

    this.sortState.activeColumn = column;

    // Clear other column sorts
    this.columns.forEach(col => {
      if (col.key !== column) {
        this.sortState[col.key] = '';
      }
    });

    this.applySorting();
    this.sortChange.emit({ column, direction: this.sortState[column] });
    this.saveState();
  }
  
  private applySorting() {
    const column = this.sortState.activeColumn;
    if (!column) return;
    
    this.filteredData.sort((a, b) => {
      const valueA = Number(a[column]) || 0;
      const valueB = Number(b[column]) || 0;
      return this.sortState[column] === 'newFirst' ? valueA - valueB : valueB - valueA;
    });
  }
  
  filterDistinctValues(columnKey: string) {
    const filter = this.filterProperties[columnKey];
    if (!filter) return;
    
    const searchLower = filter.keySearch.toLowerCase();
    filter.filtered = filter.distinct.filter(element =>
      element.toString().toLowerCase().includes(searchLower)
    ).sort();
  }
  
  clearSearch(columnKey: string) {
    if (this.filterProperties[columnKey]) {
      this.filterProperties[columnKey].keySearch = '';
      this.filterDistinctValues(columnKey);
    }
  }
  
  toggleSelectAll(columnKey: string) {
    const filter = this.filterProperties[columnKey];
    if (!filter) return;
    
    filter.selected = this.isAllSelected(columnKey) ? [] : [...filter.distinct];
    this.applyFilters();
  }
  
  isAllSelected(columnKey: string): boolean {
    const filter = this.filterProperties[columnKey];
    return filter && filter.selected.length === filter.distinct.length && filter.selected.length > 0;
  }
  
  toggleSelection(value: string, columnKey: string) {
    const filter = this.filterProperties[columnKey];
    if (!filter) return;
    
    const index = filter.selected.indexOf(value);
    if (index > -1) {
      filter.selected.splice(index, 1);
    } else {
      filter.selected.push(value);
    }
    this.applyFilters();
  }
  
  clearSelection(columnKey: string) {
    if (this.filterProperties[columnKey]) {
      this.filterProperties[columnKey].selected = [];
      this.applyFilters();
    }
  }
  
  resetAllFilters() {
    Object.keys(this.filterProperties).forEach(key => {
      this.filterProperties[key].selected = [];
      this.filterProperties[key].keySearch = '';
      this.filterDistinctValues(key);
    });
    
    this.sortState = { activeColumn: '' };
    this.columns.forEach(col => this.sortState[col.key] = '');
    
    this.filteredData = [...this.originalData];
    this.clearState();
  }
  
  getSelectedFilters() {
    const selected: { [key: string]: string[] } = {};
    Object.keys(this.filterProperties).forEach(key => {
      if (this.filterProperties[key].selected.length > 0) {
        selected[key] = this.filterProperties[key].selected;
      }
    });
    return selected;
  }
  
  hasActiveFilters(): boolean {
    return Object.keys(this.getSelectedFilters()).length > 0;
  }
  
  getTotals() {
    const totals: any = {};
    this.columns.forEach(col => {
      if (col.totalable) {
        totals[col.key] = this.filteredData.reduce((sum, item) => sum + (item[col.key] || 0), 0);
      }
    });
    return totals;
  }

  saveState() {
    const state = {
      sortState: this.sortState,
      filterProperties: Object.keys(this.filterProperties).reduce((acc, key) => {
        acc[key] = {
          selected: this.filterProperties[key].selected
        };
        return acc;
      }, {} as any)
    };
    localStorage.setItem(this.stateKey, JSON.stringify(state));
  }

  restoreState() {
    const savedState = localStorage.getItem(this.stateKey);
    if (savedState) {
      const state = JSON.parse(savedState);
      this.sortState = { ...this.sortState, ...state.sortState };
      
      Object.keys(state.filterProperties || {}).forEach(key => {
        if (this.filterProperties[key]) {
          this.filterProperties[key].selected = state.filterProperties[key].selected || [];
        }
      });
      
      this.applyFilters();
    }
  }

  clearState() {
    localStorage.removeItem(this.stateKey);
  }
}
