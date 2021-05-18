import { formatDate, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet, LoadingController, ModalController } from '@ionic/angular';
import { CalendarProjectComponent } from 'src/app/components/modals/calendar-project/calendar-project.component';
import { ExpenseListComponent } from 'src/app/components/modals/expense-list/expense-list.component';
import { TimeProjectComponent } from 'src/app/components/modals/time-project/time-project.component';
import { ProjectService } from 'src/app/services/project/project.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { UserService } from 'src/app/services/user/user.service';
import { ProjectJsonI } from 'src/interfaces/projectInterface';
import { ClientI } from 'src/interfaces/userInterface';

@Component({
  selector: 'app-show-project',
  templateUrl: './show-project.page.html',
  styleUrls: ['./show-project.page.scss'],
})
export class ShowProjectPage implements OnInit {

  id = '';
  project: ProjectJsonI;
  client: ClientI;

  edit = true;

  constructor(
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService,
    private projectService: ProjectService,
    private loadingController: LoadingController,
    private toasterService: ToasterService,
    // private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) { this.initData(); }
  }

  async initData() {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Récupération...' });
    await loading.present();
    this.projectService.getOneProject(this.id).subscribe({
      next: async (data: { error: false, project: ProjectJsonI }) => {
        data.project.createdAt = formatDate(data.project.createdAt, 'yyyy-MM-dd', 'fr-FR', 'Europe/France');
        data.project.deadline = formatDate(data.project.deadline, 'yyyy-MM-dd', 'fr-FR', 'Europe/France');
        this.project = data.project;
        this.userService.getUser(this.project.clientId.id).subscribe({
          next: async (data2: { error: false, user: ClientI }) => {
            this.client = data2.user;
            await loading.dismiss();
          }
        });
      },
      error: async (error: HttpErrorResponse) => {
        await loading.dismiss();
        this.toasterService.presentErrorToast('Impossible de récupérer cette facture.', { error });
      }
    });
  }

  async showAddTimeModal() {
    const modal = await this.modalController.create({
      component: TimeProjectComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        projectId: this.id,
      }
    });
    return await modal.present();
  }

  async showCalendarModal() {
    const modal = await this.modalController.create({
      component: CalendarProjectComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

  async showListExpenseModal() {
    const modal = await this.modalController.create({
      component: ExpenseListComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

  redirectToExpense() {
    this.router.navigate(['/tabs/add-page'], { state: { projectId: this.id } });
  }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }

  nagivateBack() {
    this.location.back();
  }

}
