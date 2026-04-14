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
    MatButtonModule
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private followUpService: BillAnalysisRowService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<BillAnalysisRowComponent>   // ✅ ADDED
  ) {
    this.bill = data?.bill;
  }

  // ================= INIT =================
  ngOnInit(): void {

    const user = this.authService.currentUserStore;

    this.loggedInUser =
      user?.contact?.name ||
      user?.username ||
      'Unknown User';

    this.loadHistory();
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
      nextFollowUpDate: this.formData.nextFollowUpDate,
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


}
