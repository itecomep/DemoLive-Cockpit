import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AllowedIpService, AllowedIp } from '../../app/allowed-ip/services/allowed-ip.service';
import { MatDialog } from '@angular/material/dialog';
import { AllowedIpDialogComponent } from './allowed-ip-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-allowed-ip',
  templateUrl: './allowed-ip.component.html',
  styleUrls: ['./allowed-ip.component.scss']
})
export class AllowedIpComponent implements OnInit {

  ipList: AllowedIp[] = [];
  filteredIpList: AllowedIp[] = [];
  headerTitle: string = '';
  headerTitleCount: number = 0;
  newIp: AllowedIp = { ipAddress: '', description: '' };

  searchFilter = new FormControl('');

  displayedColumns: string[] = ['id', 'ipAddress', 'description', 'action'];

  constructor(private ipService: AllowedIpService, private dialog: MatDialog,private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    let activeRoute = this.route;
    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    activeRoute.data.subscribe(data => {
      if (data['title']) {
        this.headerTitle = data['title'];
      }
    });
    this.loadIps();

    this.searchFilter.valueChanges.subscribe(value => {
      this.applyFilter(value ?? '');
    });
  }

  loadIps(): void {
    this.ipService.getAll().subscribe(res => {
      this.ipList = res;
      this.applyFilter(this.searchFilter.value ?? '');
    });
  }

  applyFilter(filterValue: string) {
    const value = filterValue.toLowerCase();
    this.filteredIpList = this.ipList.filter(ip =>
      ip.ipAddress.toLowerCase().includes(value) ||
      (ip.description && ip.description.toLowerCase().includes(value))
    );
  }

  addIp(): void {
    if (!this.newIp.ipAddress) return;

    this.ipService.add(this.newIp).subscribe({
      next: () => {
        this.newIp = { ipAddress: '', description: '' };
        this.loadIps();
      },
      error: err => {
        if (err.status === 409) {
          alert('IP already exists');
        } else {
          alert('Failed to add IP');
        }
      }
    });
  }

  deleteIp(id: number): void {
    this.ipService.delete(id).subscribe(() => this.loadIps());
  }

  refresh(): void {
    this.loadIps();
  }

  openAddIpDialog(): void {
    const dialogRef = this.dialog.open(AllowedIpDialogComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ipService.add(result).subscribe(() => this.loadIps());
      }
    });
  }

  goToAllowedUser(): void {
    this.router.navigate(['/bypass-allowed-user/bypass']);
  }

}
