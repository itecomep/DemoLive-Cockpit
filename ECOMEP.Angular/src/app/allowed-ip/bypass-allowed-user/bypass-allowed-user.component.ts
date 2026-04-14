import { Component, OnInit } from '@angular/core';
import { AllowedIpService, BypassUser } from '../services/allowed-ip.service';
import { FormControl } from '@angular/forms';
import { AddBypassUserDialogComponent } from './add-bypass-user-dialog.component';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bypass-allowed-user',
  templateUrl: './bypass-allowed-user.component.html',
  styleUrls: ['./bypass-allowed-user.component.scss']
})
export class BypassAllowedUserComponent implements OnInit {
  users: BypassUser[] = [];
  filteredUsers: BypassUser[] = [];
  isLoading = true;
  headerTitle: string = '';
  headerTitleCount: number = 0;
  displayedColumns: string[] = ['id', 'username', 'isActive', 'action'];

  searchFilter = new FormControl('');

  constructor(private service: AllowedIpService,private dialog: MatDialog,private location: Location, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
    if (data['title']) {
        this.headerTitle = data['title'];
      }
    });
    this.fetchUsers();
    this.searchFilter.valueChanges.subscribe(value => {
      const search = (value || '').toLowerCase();
      this.filteredUsers = this.users.filter(u =>
        u.username.toLowerCase().includes(search)
      );
    });
  }

  fetchUsers(): void {
  this.isLoading = true;
    this.service.getBypassUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }


  deleteUser(id: number) {
    this.service.deleteBypassUser(id).subscribe({
      next: () => this.fetchUsers(),
    });
  }

  refresh(): void {
    this.fetchUsers();
  }

  openAddBypassUserDialog(): void {
    this.dialog.open(AddBypassUserDialogComponent, {
      width: '350px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.fetchUsers();
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

}
