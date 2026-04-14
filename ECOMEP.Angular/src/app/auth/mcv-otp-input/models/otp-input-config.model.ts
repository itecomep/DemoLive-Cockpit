export class OtpInputConfig
{
    inputStyles?: { [key: string]: any };
    containerStyles?: { [key: string]: any };
    /**
     * @deprecated Don't use as this will be removed in upcoming versions
     */
    allowKeyCodes?: string[];
    length: number = 0;
    allowNumbersOnly: boolean = false;
    inputClass!: string;
    containerClass?: string;
    isPasswordInput: boolean = false;
    disableAutoFocus: boolean = false;
    placeholder?: string;
    letterCase: "Upper" | "Lower" = "Upper";
}

export class OtpInputKeyboardUtil
{

    static ifBackspaceOrDelete(event: KeyboardEvent)
    {
        return this.ifKey(event, 'Backspace;Delete;Del');
    }
    static ifRightArrow(event: KeyboardEvent)
    {
        return this.ifKey(event, 'ArrowRight;Right')
    }
    static ifLeftArrow(event: KeyboardEvent)
    {
        return this.ifKey(event, 'ArrowLeft;Left')
    }
    static ifSpacebar(event: KeyboardEvent)
    {
        return this.ifKey(event, 'Spacebar; ')//don't remove the space after ; as this will check for space key
    }
    static ifKey(event: KeyboardEvent, keys: string): boolean
    {
        let keysToCheck = keys.split(';');
        return keysToCheck.some(k => k === event.key);
    }
}