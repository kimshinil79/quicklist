import { Component, ViewChild, OnInit } from '@angular/core';
import { AlertController, IonContent, IonList, NavController } from '@ionic/angular';
import { ChecklistService } from '../services/checklist.service';
import { Checklist } from '../interfaces/checklist';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonList, {static: false}) slidingList: IonList;
  @ViewChild(IonContent, {static: false}) contentArea: IonContent;

  public checklists:Checklist[] = [];

  constructor(
    private checklistService: ChecklistService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.checklistService.getChecklists().subscribe((checklists) => {
      this.checklists = checklists;
    });
  }

  async addChecklist(): Promise<void> {}

  async renameChecklist(checklist: Checklist): Promise<void> {}

  async removeChecklist(checklist: Checklist): Promise<void> {}

}
