import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { ActivityDto } from 'src/app/shared/models/activity-dto';
import { AnalyticalTableComponent } from "src/app/shared/components/analytical-table/analytical-table.component";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-mcv-activity-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, AnalyticalTableComponent, MatIconModule],
  templateUrl: './mcv-activity-dialog.component.html',
  styleUrls: ['./mcv-activity-dialog.component.scss']
})
export class McvActivityDialogComponent implements OnInit {
  activityChanges: any[] = [];
  tableColumns = [
    { key: 'person', label: 'Person', type: 'text', filterable: false, sortable: false },
    { key: 'timeStamp', label: 'TimeStamp', type: 'text', filterable: false, sortable: false },
    { key: 'field', label: 'Field', type: 'text', filterable: false, sortable: false },
    { key: 'oldValue', label: 'Old Value', type: 'text', filterable: false, sortable: false },
    { key: 'newValue', label: 'New Value', type: 'text', filterable: false, sortable: false }
  ];

  constructor(
    public dialogRef: MatDialogRef<McvActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { entity: string; entityID: number; activities: ActivityDto[] }
  ) {}

  ngOnInit(): void {
    this.loadActivityChanges();
  }

  loadActivityChanges(): void {
    this.activityChanges = [];
    
    this.data.activities.forEach(activity => {
      if (activity.propertyChanges && activity.propertyChanges.length > 0) {
        activity.propertyChanges.forEach((change: any) => {
          this.activityChanges.push({
            person: activity.contactName,
            timeStamp: new Date(activity.created).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            field: change.propertyName,
            oldValue: change.oldValue,
            newValue: change.newValue
          });
        });
      }
    });

    
    // Sort by timestamp descending
    this.activityChanges.sort((a, b) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime());
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
