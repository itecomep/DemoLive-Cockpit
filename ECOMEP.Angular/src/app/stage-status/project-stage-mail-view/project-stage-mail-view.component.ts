import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-project-stage-mail-view',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './project-stage-mail-view.component.html',
  styleUrls: ['./project-stage-mail-view.component.scss']
})
export class ProjectStageMailViewComponent {
  safeBody!: SafeHtml;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private sanitizer: DomSanitizer
  ) {
    this.safeBody =
      this.sanitizer.bypassSecurityTrustHtml(
        data.body || ''
      );
  }
}