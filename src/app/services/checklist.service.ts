import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from "rxjs/operators"
import { Checklist } from '../interfaces/checklist';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  private checklists$: BehaviorSubject<Checklist[]> = new BehaviorSubject<Checklist[]>([]);
  private checklists: Checklist[] = [];
  private loaded: boolean = false;

  constructor(private storage: Storage) { }

  async load(): Promise<void> {
    return Promise.resolve();
  }

  getChecklists(): Observable<Checklist[]> {
    return this.checklists$;
  }

  getChecklist(checklistId: string): Observable<Checklist> {
    return this.checklists$.pipe(map((checklists) => checklists.find((checklist) => checklist.id === checklistId))
    );
  }

  async createChecklist(title: string): Promise<void> {
    await this.load();
    const newChecklist = {
      id : this.generateSlug(title),
      title : title,
      items: []
    }

    this.checklists = [...this.checklists, newChecklist]
    await this.save();
  }

  async updateChecklist(checklistId: string, newTitle: string): Promise<void> {
    this.checklists = this.checklists.map((checklist) => {
      return checklist.id === checklistId ? {...checklist, title:newTitle} : checklist
    })
  }

  async removeChecklist(checklistId: string): Promise<void> {}

  async addItemChecklist(checklistId: string, title: string): Promise<void> {}

  removeItemFromChecklist(checklistId: string, itemId: string): void {}

  updateItemInChecklist(checklistId: string, itemId: string, newTitle: string): void {}

  setItemStatus(checklistId: string, itemId: string, checked: boolean): void {}

  resetItemStatusChecklist(checklistId: string): void {}

  save(): Promise<void> {
    return Promise.resolve();
  }

  generateSlug(title: string): string {
    return "";
  }
}
