import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController,  IonList } from '@ionic/angular';
import { ChecklistService } from '../services/checklist.service';
import { Checklist } from '../interfaces/checklist';
import { ChecklistItem } from '../interfaces/checklist-item';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit, OnDestroy {
  @ViewChild(IonList, { static: false}) slidingList: IonList;
  private checklistSubscription: Subscription

  public checklist: Checklist = {
    id: "",
    title: "",
    items: [],
  };

  constructor(
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private checklistService: ChecklistService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    this.checklistSubscription = this.checklistService.getChecklist(id).subscribe((checklist) =>
    {
      this.checklist = checklist;
    });
  }

  ngOnDestroy() {
    if (this.checklistSubscription !== null) {
      this.checklistSubscription.unsubscribe();
    }
  }

  async addItem(): Promise<void> {}

  async renameItem(item: ChecklistItem): Promise<void> {}

  async removeItem(item: ChecklistItem): Promise<void> {}

  toggleItem(item: ChecklistItem): void {}

  restartList(): void {}

}
