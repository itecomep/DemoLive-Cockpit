import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { Project } from 'src/app/project/models/project.model';
import { Contact } from '../../models/contact';
import { ApiFilter } from 'src/app/shared/models/api-filters';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-projects.component.html',
  styleUrls: ['./contact-projects.component.scss']
})
export class ContactProjectsComponent {

  projectService = inject(ProjectApiService);

  contact!: Contact;
  projects: Project[] = [];

  @Input('contact') set contactValue(value: any) {
    if (value) {
      this.contact = value;
      if (this.contact) {
        this.getProjects();
      }
    }
  }

  getStatusColor(item: Project) { return this.projectService.getStatusColor(item.statusFlag); }

  async getProjects() {
    const _filter: ApiFilter[] = [
      { key: 'ProjectPartnerOrAssociateContactID', value: this.contact.id.toString() }
    ];

    this.projects = await firstValueFrom(this.projectService.get(_filter));
  }
}
