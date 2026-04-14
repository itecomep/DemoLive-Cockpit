import { Injectable } from '@angular/core';
import { McvBaseApiService } from 'src/app/shared/services/mcv-base-api.service';
import { ContactAssociation } from '../models/contact';
import { firstValueFrom, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactAssociationApiService extends McvBaseApiService
{

  override apiRoute = this.config.apiContactAssociations;
  constructor()
  {
    super();
  }

  createdItems: ContactAssociation[] = [];
  updatedItems: ContactAssociation[] = [];
  deletedItems: ContactAssociation[] = [];

  resetItems()
  {
    this.createdItems = [];
    this.updatedItems = [];
    this.deletedItems = [];
  }
  async updateItems()
  {
    if (this.deletedItems.length != 0)
    {

      var deleteRequests = this.deletedItems
        .map(x => this.delete(x.id));
      await firstValueFrom(forkJoin(deleteRequests));
      this.deletedItems = [];
    }

    if (this.updatedItems.length != 0)
    {
      var updateRequests = this.updatedItems
        .map(x => this.update(x));
      await firstValueFrom(forkJoin(updateRequests));
      this.updatedItems = [];
    }

    if (this.createdItems.length != 0)
    {
      var createRequests = this.createdItems
        .map(x => this.create(x));
      await firstValueFrom(forkJoin(createRequests));
      this.createdItems = [];
    }

  }
}
