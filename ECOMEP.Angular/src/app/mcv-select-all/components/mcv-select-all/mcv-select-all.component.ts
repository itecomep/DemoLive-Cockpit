import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'mcv-select-all',
    templateUrl: './mcv-select-all.component.html',
    styleUrls: ['./mcv-select-all.component.scss'],
    standalone: true,
    imports: [MatCheckboxModule]
})
export class McvSelectAllComponent
{
  @Input() selectFC?: FormControl;
  @Input() values: any[] = [];
  @Input() text = 'Select All';

  isChecked(): boolean
  {
    if (!this.selectFC)
    {
      return false;
    }
    return this.selectFC.value && this.values.length
      && this.selectFC.value.length === this.values.length;
  }

  isIndeterminate(): boolean
  {
    if (!this.selectFC)
    {
      return false;
    }
    return this.selectFC.value && this.values.length && this.selectFC.value.length && this.selectFC.value.length < this.values.length;
  }

  toggleSelection(change: MatCheckboxChange): void
  {
    if (!this.selectFC)
    {
      return;
    }
    if (change.checked)
    {
      this.selectFC.setValue(this.values);
    } else
    {
      this.selectFC.setValue([]);
    }
  }
}
