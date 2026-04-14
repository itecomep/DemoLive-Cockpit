import { Injectable } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class McvSeoService
{

    constructor(
        private title: Title,
        private meta: Meta
    ) { }

    updateTitle(title: string)
    {
        this.title.setTitle(title);
    }

    updateMetaTags(metaTags: MetaDefinition[])
    {
        console.log('meta', this.meta, metaTags);
        metaTags.forEach(m => this.meta.updateTag(m));
    }
}