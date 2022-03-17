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
    if (!this.loaded) {
      const checklist = await this.storage.get("checklists");
      if (checklist !== null) {
        this.checklists = checklist;
        this.checklists$.next(this.checklists);
      }

      this.loaded = true;
    }
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

  async removeChecklist(checklistId: string): Promise<void> {
    this.checklists = this.checklists.filter((checklist) => 
    checklist.id !== checklistId);
    this.save()
  }

  async addItemChecklist(checklistId: string, title: string):Promise<void> {
    const newItem = {
      id: Date.now().toString(),
      title : title, 
      checked : false,
    };

    this.checklists = this.checklists.map((checklist) => {
      return checklist.id == checklistId 
      ? {...checklist, items: [...checklist.items, newItem]}
      : checklist;
    });  

    this.save();

  }

  removeItemFromChecklist(checklistId: string, itemId: string): void {
    this.checklists = this.checklists.map((checklist) => {
      return checklist.id === checklistId
      ? { ...checklist, items:[...checklist.items.filter((item) =>
        item.id !== itemId)]}
      : checklist;
    })
  }

  updateItemInChecklist(checklistId: string, itemId: string, newTitle: string): void {
    this.checklists = this.checklists.map((checklist) => {
      return checklist.id === checklistId
      ? {
        ...checklist, 
        items: [
          ...checklist.items.map((item) => 
            item.id === itemId ? {...item, title: newTitle} : item),
        ],
      }
      : checklist;
    });
    this.save();
  }

  setItemStatus(checklistId: string, itemId: string, checked: boolean): void {
    this.checklists = this.checklists.map((checklist) => {
      return checklist.id === checklistId
        ? {
          ...checklist, 
          items: [
            ...checklist.items.map((item) =>
              item.id === itemId ? {...item, checked: checked} : item),
          ],
        }
        : checklist;
    });
    this.save();
  }

  resetItemStatusChecklist(checklistId: string): void {
    this.checklists = this.checklists.map((checklist) => {
      return checklist.id == checklistId
        ? {
          ...checklist, 
          items : [
            ...checklist.items.map((item) => {
              return {...item, checked: false};
            }),
          ],
        }
        :checklist;
    });

    this.save();
  }

  save(): Promise<void> {
    this.checklists$.next(this.checklists)
    return this.storage.set("checklists", this.checklists)
  }

  generateSlug(title: string): string {
    let slug = title.toLowerCase().replace(/\s+/g, "-");

    const matchingSlugs = this.checklists.filter((checklist) => {
      return checklist.id.substring(0, slug.length) === slug;
    });

    if (matchingSlugs.length > 0) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }
}
