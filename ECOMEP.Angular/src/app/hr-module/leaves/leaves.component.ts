// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatDialog } from '@angular/material/dialog';
// import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';

// @Component({
//   selector: 'app-leaves',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     MatTooltipModule
//   ],
//   templateUrl: './leaves.component.html',
//   styleUrls: ['./leaves.component.scss']
// })
// export class LeavesComponent {

//   constructor(private dialog: MatDialog) {}

//   // ✅ HARD CODE DATA ONLY
//   dataList: any[] = [
//     {
//       id: 1,
//       contact: { name: 'Rohit Sharma', photoUrl: '' },
//       title: 'Sick Leave',
//       status: 'Pending'
//     },
//     {
//       id: 2,
//       contact: { name: 'Aadhya Mehta', photoUrl: '' },
//       title: 'WFH',
//       status: 'Approved'
//     },
//     {
//       id: 3,
//       contact: { name: 'John Doe', photoUrl: '' },
//       title: 'Annual Leave',
//       status: 'Rejected'
//     }
//   ];

//   openPhotoDialog(member: any) {
//     this.dialog.open(ContactPhotoNameDialogComponent, {
//       data: member
//     });
//   }

//   loadMoreRecords() {
//     console.log('Show more clicked');
//   }
// }















// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatDialog } from '@angular/material/dialog';
// import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';

// @Component({
//   selector: 'app-leaves',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatTooltipModule
//   ],
//   templateUrl: './leaves.component.html',
//   styleUrls: ['./leaves.component.scss']
// })
// export class LeavesComponent {

//   constructor(private dialog: MatDialog) {}

//   // ✅ HARD CODED TABLE DATA
//   dataList: any[] = [
//     {
//       contact: { name: 'Rohit Sharma', photoUrl: '' },
//       title: 'Sick Leave',
//       status: 'Pending',
//       totalLeaves: 2
//     },
//     {
//       contact: { name: 'Aadhya Mehta', photoUrl: '' },
//       title: 'WFH',
//       status: 'Approved',
//       totalLeaves: 5
//     },
//     {
//       contact: { name: 'John Doe', photoUrl: '' },
//       title: 'Annual Leave',
//       status: 'Rejected',
//       totalLeaves: 1
//     },
//     {
//       contact: { name: 'Priya Shah', photoUrl: '' },
//       title: 'Sick Leave',
//       status: 'Approved',
//       totalLeaves: 3
//     }
//   ];

//   openPhotoDialog(member: any) {
//     this.dialog.open(ContactPhotoNameDialogComponent, {
//       data: member
//     });
//   }
// }











import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
export class LeavesComponent {

  displayedColumns: string[] = [
    'employee',
    'type',
    'dates',
    'total',
    'status'
  ];

  dataSource: any[] = [
    {
      id: 1,
      contact: { name: 'Rohit Sharma', photoUrl: '' },
      typeValue: 'Sick Leave',
      start: new Date(),
      end: new Date(),
      statusFlag: 0,
      total: 2
    },
    {
      id: 2,
      contact: { name: 'Aadhya Mehta', photoUrl: '' },
      typeValue: 'WFH',
      start: new Date(),
      end: new Date(),
      statusFlag: 1,
      total: 5
    },
    {
      id: 3,
      contact: { name: 'John Doe', photoUrl: '' },
      typeValue: 'Annual Leave',
      start: new Date(),
      end: new Date(),
      statusFlag: -1,
      total: 1
    }
  ];
}
