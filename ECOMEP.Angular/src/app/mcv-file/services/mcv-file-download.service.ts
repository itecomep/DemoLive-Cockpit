import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, last, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class McvFileDownloadService {
  constructor(private http: HttpClient) {}

  /**
   * Downloads multiple files with progress tracking.
   * @param files Array of objects with `url` (file URL) and `fileName` (downloaded file name).
   * @param bypassCache If true, bypass Angular Service Worker cache.
   */
  downloadMultipleFiles(files: { url: string; fileName: string }[], bypassCache: boolean = false): void {
    const headers = bypassCache
      ? new HttpHeaders({ 'Cache-Control': 'no-cache, no-store, must-revalidate', Pragma: 'no-cache', Expires: '0', 'No-Auth': 'true' })
      : undefined;

    let currentFileIndex = 0;

    Swal.fire({
      title: 'Downloading Files...',
      html: `<strong>File 1 of ${files.length}: 0%</strong>`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();

        const downloadFile = (file: { url: string; fileName: string }, index: number): Observable<void> => {
          return this.http
            .get(file.url, { headers, responseType: 'blob', observe: 'events', reportProgress: true })
            .pipe(
              map((event: HttpEvent<any>) => {
                if (event.type === HttpEventType.DownloadProgress) {
                  const progress = event.total ? Math.round((100 * event.loaded) / event.total) : 0;
                  Swal.update({
                    html: `<strong>File ${index + 1} of ${files.length}: ${progress}%</strong>`,
                  });
                }
                return event;
              }),
              last(),
              map((event) => {
                if (event.type === HttpEventType.Response) {
                  // Trigger file download
                  const blob = event.body;
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = file.fileName;
                  link.click();
                  URL.revokeObjectURL(link.href);
                  link.remove();
                }
              }),
              catchError((error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Download Failed',
                  text: `Failed to download file ${file.fileName}.`,
                });
                console.error(`Error downloading file ${file.fileName}:`, error);
                return of(undefined); // Allow sequence to continue for other files
              })
            );
        };

        // Process each file sequentially
        const processFilesSequentially = (index: number): void => {
          if (index >= files.length) {
            Swal.fire({
              icon: 'success',
              title: 'All Downloads Complete',
              text: 'All files have been downloaded successfully!',
              timer: 3000,
              showConfirmButton: false,
            });
            return;
          }

          downloadFile(files[index], index).subscribe({
            next: () => {
              processFilesSequentially(index + 1);
            },
            error: () => {
              processFilesSequentially(index + 1); // Skip to the next file on error
            },
          });
        };

        processFilesSequentially(currentFileIndex);
      },
    });
  }
}
