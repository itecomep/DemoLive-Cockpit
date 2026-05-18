import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Contact } from 'src/app/contact/models/contact';

@Component({
  selector: 'app-my-info',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './my-info.component.html',
  styleUrls: ['./my-info.component.scss']
})
export class MyInfoComponent implements OnInit {

  entityApiService = inject(ContactApiService);
  authService = inject(AuthService);

  currentUser!: Contact;

  ngOnInit(): void {

    const contactId =
      this.authService.currentUserStore?.contact?.id;

    if (!contactId) return;

    this.entityApiService
      .getById(contactId)
      .subscribe((res: Contact) => {

        this.currentUser = res;

      });

  }

}