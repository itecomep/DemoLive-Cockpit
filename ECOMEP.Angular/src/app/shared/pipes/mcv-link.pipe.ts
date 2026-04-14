import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'mcvLink',
  standalone: true
})
export class McvLinkPipe implements PipeTransform {

  constructor(private _domSanitizer: DomSanitizer) { }

  transform(value: any, args?: any): any {
    return this._domSanitizer.bypassSecurityTrustHtml(this.stylize(value));
  }

  // Modify this method according to your custom logic
  private stylize(text: string): string {
    if (!text) {
      return text;
    }

    // Regex to match URLs starting with http(s) or www
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map(part => {
      if (part.match(urlRegex)) {
        const url = part.startsWith('www') ? 'http://' + part : part; // Add http:// to URLs starting with www
        return `<a style="color:#0070b7;" href="${url}" target="_blank">${part}</a>`;
      } else {
        return part;
      }
    }).join(' ');
  }
}
