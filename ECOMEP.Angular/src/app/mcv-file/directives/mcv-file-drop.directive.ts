import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[mcvFileDrop]',
    standalone: true
})
export class McvFileDropDirective
{
  @Output() filesDropped = new EventEmitter<FileList>();
  constructor() { }

  @HostBinding('class.fileover') fileOver: boolean = false;

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent)
  {
    event.preventDefault();
    event.stopPropagation();
    console.log('Drag Over');
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent)
  {
    event.preventDefault();
    event.stopPropagation();
    console.log('Drag Leave');
  }

  @HostListener('drop', ['$event']) onDrop(event: any)
  {
    event.preventDefault();
    event.stopPropagation();
    console.log('Drop');

    this.fileOver = false;
    const files = event.dataTransfer.files;
    if (files.length > 0)
    {
      console.log(`dropped ${files.length} files`, files);
      this.filesDropped.emit(files);
    }
  }
}
