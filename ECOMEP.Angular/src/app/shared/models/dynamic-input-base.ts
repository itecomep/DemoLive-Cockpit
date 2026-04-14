export class DynamicInputBase
{
  value: any;
  key: string;
  label: string;
  placeHolder: string;
  hint: string;
  required: boolean;
  email: boolean;
  minLength: number = 0;
  min?: number | null;
  maxLength?: number | null;
  max?: number | null;
  order: number;
  controlType: string;
  options: string[];

  constructor(options: {
    value?: any;
    label?: string;
    placeHolder?: string;
    hint?: string;
    required?: boolean;
    email?: boolean;
    minLength?: number;
    min?: number;
    maxLength?: number;
    max?: number;
    order?: number;
    controlType?: string;
    options?: string[];
  } = {})
  {
    this.value = options.value;
    this.key = options.label?.toLowerCase().trim().replace(' ', '_') || '';
    this.required = !!options.required;
    this.email = !!options.email || options.controlType == 'email';
    this.label = options.label || '';
    this.placeHolder = options.placeHolder || '';
    this.hint = options.hint || '';
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || 'text';
    this.options = options.options || [];
  }
}
