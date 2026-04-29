import { Component, Inject, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'; // ✅ UPDATED
import { BillAnalysisRowService } from './bill-analysis-row.service';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProjectApiService } from 'src/app/project/services/project-api.service';
import { firstValueFrom } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-bill-analysis-row',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    MatIconModule,
    MatMenuModule,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    HttpClientModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './bill-analysis-row.component.html',
  styleUrls: ['./bill-analysis-row.component.scss']
})
export class BillAnalysisRowComponent implements OnInit {

  editId: number | null = null;
  existingFiles: any[] = [];
  loggedInUser: string = '';

  // ================= BILL =================
  bill: any;

  // ================= HISTORY =================
  followUps: any[] = [];

  // ================= ATTACHMENTS =================
  attachments: File[] = [];
  attachmentPreview: string | null = null;
  previewFile: any = null;
  projectContacts: any[] = [];

  // ================= FORM =================
  formData: {
    communicationDate: Date;
    communicatedTo: string;
    response: string;
    nextFollowUpDate: Date | null;
  } = {
    communicationDate: new Date(),
    communicatedTo: '',
    response: '',
    nextFollowUpDate: null
  };

  formatContact(c: any): string {
  const name = c.contact?.fullName || '';
  const email = c.contact?.email || '';
  const phone = c.contact?.phone || '';

  return `${name} (${email}) ${phone}`;
}

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private followUpService: BillAnalysisRowService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<BillAnalysisRowComponent>,   // ✅ ADDED
     private projectService: ProjectApiService
  ) {
    this.bill = data?.bill;
  }

  // ================= INIT =================
  // ngOnInit(): void {

  //   const user = this.authService.currentUserStore;

  //   this.loggedInUser =
  //     user?.contact?.name ||
  //     user?.username ||
  //     'Unknown User';

  //   this.loadHistory();
  // }

async ngOnInit(): Promise<void> {

  const user = this.authService.currentUserStore;

  this.loggedInUser =
    user?.contact?.name ||
    user?.username ||
    'Unknown User';

  this.loadHistory();

  console.log('BILL DATA:', this.bill); // 🔥 DEBUG

  // 🔥 FIX START
  if (this.bill?.projectId) {
    await this.loadProjectContacts(this.bill.projectId);
  } else if (this.bill?.projectCode) {
    await this.loadProjectByCode(this.bill.projectCode);
  }
}
  // ================= CLOSE DIALOG =================
  
  // ================= LOAD HISTORY =================
  loadHistory() {
    if (!this.bill?.id) {
      this.followUps = [];
      return;
    }

    this.followUpService.get(this.bill.id).subscribe({
      next: (res: any[]) => {
        this.followUps = (res || []).map(x => ({
          ...x,
          files: x.files || [],
          communicatedByClient: x.communicatedByClient || '-',
          communicatedTo: x.communicatedTo || '-',
          response: x.response || '-'
        }));
      },
      error: (err) => {
        console.error('Error loading follow-ups:', err);
        this.followUps = [];
      }
    });
  }

  // ================= FILE SELECT =================
  onFileSelected(event: any) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      this.attachments.push(files[i]);
    }

    event.target.value = '';
  }

  // ================= SAVE =================
  save() {
    if (!this.bill?.id) return;

    const formData = new FormData();

    const payload = {
      billId: this.bill.id,
      communicatedByClient: this.loggedInUser,
      communicationDate: this.formData.communicationDate,
      communicatedTo: this.formData.communicatedTo,
      response: this.formData.response,
      // nextFollowUpDate: this.formData.nextFollowUpDate,
      nextFollowUpDate: this.formatDate(this.formData.nextFollowUpDate),

      attachmentUrl: this.existingFiles.map(f => {
        const url = f.url || '';
        return url.split('/').pop();
      }).join(',')
    };

    formData.append('data', JSON.stringify(payload));

    this.attachments.forEach(file => {
      formData.append('files', file);
    });

    if (this.editId) {
      this.followUpService.update(this.editId, formData).subscribe(() => {
        this.loadHistory();
        this.resetForm();
        this.editId = null;
      });
    } else {
      this.followUpService.save(formData).subscribe(() => {
        this.loadHistory();
        this.resetForm();
      });
    }
  }



  formatDate(date: Date | null): string | null {
  if (!date) return null;

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`; // ✅ YYYY-MM-DD (no timezone issue)
}


  // ================= RESET =================
  resetForm() {
    this.editId = null;
    this.existingFiles = [];

    this.formData = {
      communicationDate: new Date(),
      communicatedTo: '',
      response: '',
      nextFollowUpDate: null
    };

    this.attachments = [];
    this.attachmentPreview = null;
  }

  // ================= HELPERS =================
  isImage(url: string): boolean {
    return url?.includes('image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  }

  editFollowUp(f: any) {
    this.editId = f.id;

    this.formData = {
      communicationDate: new Date(f.communicationDate),
      communicatedTo: f.communicatedTo,
      response: f.response,
      nextFollowUpDate: f.nextFollowUpDate ? new Date(f.nextFollowUpDate) : null
    };

    this.existingFiles = f.files || [];
    this.attachments = [];
  }

  deleteFollowUp(id: number) {
    if (!confirm('Are you sure you want to delete this follow-up?')) return;

    this.followUpService.delete(id).subscribe(() => {
      this.loadHistory();
    });
  }

  openPreview(file: any) {
    this.previewFile = file;
  }

  closePreview() {
    this.previewFile = null;
  }

  getFileName(file: any): string {
    let name = file?.name;

    if (!name && file?.url) {
      name = file.url.split('/').pop();
    }

    if (!name) return 'file';

    name = name.split('?')[0];

    if (name.includes('_')) {
      name = name.substring(name.indexOf('_') + 1);
    }

    return name;
  }

  removeExistingFile(index: number) {
    this.existingFiles.splice(index, 1);
  }

  // ================= BILL CALCULATIONS =================
  getReceivedPayment(bill: any) {
    return (bill?.payments || []).reduce((a: number, b: any) => a + b.amount, 0);
  }

  getPendingPayment(bill: any) {
    return bill?.payableAmount - this.getReceivedPayment(bill);
  }

 getBillNo(bill: any) {
  if (!bill) return '-';

  // normalize typeFlag safely (string/number both handled)
  const typeFlag = String(bill.typeFlag);

  const isProforma =
    typeFlag === '1' ||
    typeFlag.toLowerCase() === 'proforma' ||
    typeFlag.toLowerCase() === 'proforma_invoice';

  if (isProforma) {
    return bill.proformaInvoiceNo || bill.taxInvoiceNo || '-';
  }

  return bill.taxInvoiceNo || bill.proformaInvoiceNo || '-';
}


 closeDialog(): void {
  this.dialogRef.close();
}


// async loadProjectContacts(projectId: number) {
//   try {
//     const project = await firstValueFrom(
//       this.projectService.getById(projectId)
//     );

//     this.projectContacts = project.associations || [];

//     // 🔥 AUTO-FILL communicatedTo
//     // this.formData.communicatedTo = this.projectContacts
//     //   .map(x => x.contact?.fullName)
//     //   .filter(Boolean)
//     //   .join(', ');

//     this.formData.communicatedTo = this.projectContacts
//   .map(x => {
//     const name = x.contact?.fullName || '';
//     const email = x.contact?.email || '';
//     const phone = x.contact?.phone || '';

//     // 🔥 format how you want
//     return `${name} (${email}) ${phone}`;
//   })
//   .filter(Boolean)
//   .join('\n'); // 👈 each contact in new line

//   } catch (err) {
//     console.error('Error loading project contacts', err);
//   }
// }
async loadProjectContacts(projectId: number) {
  try {
    const project = await firstValueFrom(
      this.projectService.getById(projectId)
    );

    this.projectContacts = project.associations || [];

    // 🔥 RESET selection (important)
    this.formData.communicatedTo = '';

  } catch (err) {
    console.error('Error loading project contacts', err);
  }
}

async loadProjectByCode(projectCode: string) {
  try {
    const projects: any = await firstValueFrom(
      this.projectService.getProjectsForEmail(0, 1000, true)
    );

    const matched = projects.list.find((p: any) =>
      p.code === projectCode
    );

    if (matched) {
      await this.loadProjectContacts(matched.id);
    } else {
      console.warn('Project not found for code:', projectCode);
    }

  } catch (err) {
    console.error('Error finding project by code', err);
  }
}

}
