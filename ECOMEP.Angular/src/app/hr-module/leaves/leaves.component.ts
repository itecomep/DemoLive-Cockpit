import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HrModuleService } from '../hr-module.service'; // ✅ adjust path if needed

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent implements OnInit {

  displayedColumns: string[] = [
    'employee',
    'reason',
    'type',
    'start',
    'end',
    'total',
    'status',
    'attachment'
  ];

  dataSource: any[] = [];

  constructor(private service: HrModuleService) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves() {
    this.service.getLeaves().subscribe({
      next: (res: any[]) => {

        this.dataSource = res.map(x => ({
          id: x.id,

          // ✅ API mapping
          employeeName: x.employeeName,
          reason: x.reason,
          type: x.applicationType,

          start: new Date(x.startDate),
          end: new Date(x.endDate),
          total: x.days,

          // ✅ convert status string → flag for icons
          statusFlag:
            x.status === 'Approved' ? 1 :
            x.status === 'Rejected' ? -1 : 0,

          // ✅ optional (if backend adds later)
          attachmentUrl: x.attachmentUrl || ''
        }));

      },
      error: (err) => {
        console.error('Error fetching leaves:', err);
      }
    });
  }


  toggleReason(row: any): void {
  row.expanded = !row.expanded;
}




updateStatus(row: any, status: 'Approved' | 'Rejected') {

  // 🔥 update UI instantly
  row.statusFlag = status === 'Approved' ? 1 : -1;

  // ✅ use correct service method
  this.service.updateStatus(row.id, status).subscribe({
    next: () => {
      console.log('Status updated');
    },
    error: (err: any) => {   // ✅ FIX 2 (typing)
      console.error('Error updating status', err);
    }
  });
}

}