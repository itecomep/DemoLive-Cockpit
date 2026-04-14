import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OtpInputConfig, OtpInputKeyboardUtil } from '../../models/otp-input-config.model';
import { OtpInputKeysPipe } from '../../pipes/otp-input-keys.pipe';
import { NgIf, NgStyle, NgFor } from '@angular/common';

@Component({
    selector: 'app-otp-input',
    templateUrl: './otp-input.component.html',
    styleUrls: ['./otp-input.component.scss'],
    standalone: true,
    imports: [NgIf, NgStyle, NgFor, ReactiveFormsModule, OtpInputKeysPipe]
})
export class OtpInputComponent implements OnInit, AfterViewInit
{
  @Input() config: OtpInputConfig = {
    length: 4,
    allowNumbersOnly: false,
    inputClass: '',
    isPasswordInput: false,
    disableAutoFocus: false,
    letterCase: 'Upper'
  };
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onInputChange = new EventEmitter<string>();
  @Input() formControl: FormControl = new FormControl();
  otpForm: FormGroup = new FormGroup({});
  currentVal!: string;
  inputControls: FormControl[] = new Array(this.config.length);
  componentKey =
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36);
  get inputType()
  {
    return this.config?.isPasswordInput
      ? 'password'
      : this.config?.allowNumbersOnly
        ? 'tel'
        : 'text';
  }
  constructor(private keysPipe: OtpInputKeysPipe) { }

  ngOnInit()
  {
    this.otpForm = new FormGroup({});
    for (let index = 0; index < this.config.length; index++)
    {
      this.otpForm.addControl(this.getControlName(index), new FormControl());
    }
    this.otpForm.valueChanges.subscribe((v: object) =>
    {
      this.keysPipe.transform(this.otpForm.controls).forEach((k) =>
      {
        var val = this.otpForm.controls[k].value;
        if (val && val.length > 1)
        {
          if (val.length >= this.config.length)
          {
            this.setValue(val);
          } else
          {
            this.rebuildValue();
          }
        }
      });
    });
  }

  ngAfterViewInit(): void
  {
    if (!this.config.disableAutoFocus)
    {
      const containerItem = document.getElementById(`c_${this.componentKey}`);
      if (containerItem)
      {
        const ele: any = containerItem.getElementsByClassName('otp-input')[0];
        if (ele && ele.focus)
        {
          ele.focus();
        }
      }
    }
  }

  getFormControl(item: string | number)
  {
    return this.otpForm.controls[item] as FormControl;
  }

  private getControlName(idx: number)
  {
    return `ctrl_${idx}`;
  }

  onKeyDown($event: KeyboardEvent)
  {
    if (OtpInputKeyboardUtil.ifSpacebar($event))
    {
      $event.preventDefault();
    }
  }
  onInput(event: Event)
  {
    const inputValue = (event.target as HTMLInputElement).value;
    let newVal = this.currentVal ? `${this.currentVal}${inputValue}` : inputValue;
    if (this.config.allowNumbersOnly && !this.validateNumber(newVal))
    {
      (event.target as HTMLInputElement).value = '';
      event.stopPropagation();
      event.preventDefault();
      return;
    }
  }



  onKeyUp(event: KeyboardEvent, index: number)
  {
    const nextInputId = this.appendKey(`otp_${index + 1}`);
    const prevInputId = this.appendKey(`otp_${index - 1}`);

    const isInputElement = event.target instanceof HTMLInputElement;

    if (OtpInputKeyboardUtil.ifRightArrow(event))
    {
      event.preventDefault();
      this.setSelected(nextInputId);
      return;
    }
    if (OtpInputKeyboardUtil.ifLeftArrow(event))
    {
      event.preventDefault();
      this.setSelected(prevInputId);
      return;
    }
    if (OtpInputKeyboardUtil.ifBackspaceOrDelete(event))
    {
      // Check if the event target is an HTMLInputElement
      if (isInputElement && !event.target.value)
      {
        this.setSelected(prevInputId);
        this.rebuildValue();
        return;
      }
    }
    // Check if the event target is an HTMLInputElement
    if (isInputElement && !event.target.value)
    {
      return;
    }

    if (this.ifValidKeyCode(event))
    {
      this.setSelected(nextInputId);
    }
    this.rebuildValue();
  }

  validateNumber(val: string)
  {
    return val && /^\d*\.?\d*$/.test(val);
  }

  appendKey(id: string)
  {
    return `${id}_${this.componentKey}`;
  }

  setSelected(eleId: string)
  {
    this.focusTo(eleId);
    const ele: any = document.getElementById(eleId);
    if (ele && ele.setSelectionRange)
    {
      setTimeout(() =>
      {
        ele.setSelectionRange(0, 1);
      }, 0);
    }
  }

  ifValidKeyCode(event: KeyboardEvent)
  {
    const inp = event.key;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return (
      isMobile ||
      /[a-zA-Z0-9-_]/.test(inp) ||
      (this.config.allowKeyCodes &&
        this.config.allowKeyCodes.includes(event.code))
    );
  }

  focusTo(eleId: string)
  {
    const ele: any = document.getElementById(eleId);
    if (ele)
    {
      ele.focus();
    }
  }

  // method to set component value
  setValue(value: any)
  {
    if (this.config.allowNumbersOnly && isNaN(value))
    {
      return;
    }
    this.otpForm.reset();
    if (!value)
    {
      this.rebuildValue();
      return;
    }
    value = value.toString().replace(/\s/g, ''); // remove whitespace
    Array.from(value).forEach((c, idx) =>
    {
      const fname = this.getControlName(idx);
      const formControl = this.otpForm.get(fname);
      if (formControl)
      {
        formControl.setValue(c);
      }
    });
    if (!this.config.disableAutoFocus)
    {
      const containerItem = document.getElementById(`c_${this.componentKey}`);
      if (containerItem)
      {
        var indexOfElementToFocus = value.length < this.config.length ? value.length : (this.config.length - 1);
        let ele: any = containerItem.getElementsByClassName('otp-input')[indexOfElementToFocus];
        if (ele && ele.focus)
        {
          ele.focus();
        }
      }
    }
    this.rebuildValue();
  }

  rebuildValue()
  {
    let val = '';
    this.keysPipe.transform(this.otpForm.controls).forEach(k =>
    {
      if (this.otpForm.controls[k].value)
      {
        let ctrlVal = this.otpForm.controls[k].value;
        let isLengthExceed = ctrlVal.length > 1;
        let isCaseTransformEnabled = !this.config.allowNumbersOnly && this.config.letterCase && (this.config.letterCase.toLocaleLowerCase() == 'upper' || this.config.letterCase.toLocaleLowerCase() == 'lower');
        ctrlVal = ctrlVal[0];
        let transformedVal = isCaseTransformEnabled ? this.config.letterCase.toLocaleLowerCase() == 'upper' ? ctrlVal.toUpperCase() : ctrlVal.toLowerCase() : ctrlVal;
        if (isCaseTransformEnabled && transformedVal == ctrlVal)
        {
          isCaseTransformEnabled = false;
        } else
        {
          ctrlVal = transformedVal;
        }
        val += ctrlVal;
        if (isLengthExceed || isCaseTransformEnabled) 
        {
          this.otpForm.controls[k].setValue(ctrlVal);
        }
      }
    });
    if (val.length == this.config.length)
    {
      if (this.formControl?.setValue)
      {
        this.formControl.setValue(val);
      }
      this.onInputChange.emit(val);
      this.currentVal = val;
      console.log('OTP', val);
    }
  }


  handlePaste(e: { clipboardData: any; stopPropagation: () => void; preventDefault: () => void; })
  {
    // Get pasted data via clipboard API
    let clipboardData = e.clipboardData;// || window['clipboardData'];
    if (clipboardData)
    {
      var pastedData = clipboardData.getData('Text');
    }
    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();
    if (!pastedData || (this.config.allowNumbersOnly && !this.validateNumber(pastedData)))
    {
      return;
    }
    this.setValue(pastedData);
  }
}