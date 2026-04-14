import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'mcvHastagLink',
    standalone: true
})
export class McvHastagLinkPipe implements PipeTransform
{

  //We are using DomSanitizer for inspection of untrusted value, turning it
  //into a value that's safe to insert into the DOM.
  constructor(private domSanitizer: DomSanitizer)
  {
  }

  transform(value: any, ...args: any[])
  {
    return this.domSanitizer.bypassSecurityTrustHtml(this.convertToLink(value));
  }

  private convertToLink(text: string)
  {
    let urlLink: string = '';
    if (text && text.length > 0 && text.includes('http') || text.includes('#'))
    {
      // console.log(text);
      //Check https or # from the string
      var linkRegex = (/(https|#)[a-z0-9:/.]+/gi);
      for (let t of text.replace(/\n/g, " ").split(" "))
      {
        if (t.includes('https') || t.includes('#'))
        {
          const links = text.match(linkRegex);
          if (links)
          {
            links.forEach(link =>
            {
              // console.log(link);
              urlLink += `<a style="color:#0070b7;display:block" href="${link}" target="_blank">${link}</a>`;
            });
          }
        } else
        {
          urlLink += t + " ";
        }
      }
      return urlLink;
    }
    else return text;
  }
}
