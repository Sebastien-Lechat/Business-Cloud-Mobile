import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { ProjectService } from 'src/app/services/project/project.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { ExpenseCreateI, ExpenseJsonI } from 'src/interfaces/expenseInterface';
import { ProjectJsonI } from 'src/interfaces/projectInterface';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss'],
})
export class AddExpenseComponent implements OnInit {

  expenseNum = '';
  price = 0;
  accountNumber = 999999;
  category = '';
  description = '';
  billable = true;

  projectList: ProjectJsonI[] = [];
  filteredProjectList: ProjectJsonI[] = [];
  selectedProject = { name: '', selectedId: '' };

  selectedPicture: any;
  showFlag = false;
  croppedImage: string;
  fileToUpload: File;

  height: number;

  @ViewChild('file') file: ElementRef;

  @Input('id') set id(value: string) {
    if (value) {
      this.selectedProject.selectedId = value;
      this.initAutocomplete();
    } else {
      this.initAutocomplete();
    }
  }

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private expenseService: ExpenseService,
    private toasterService: ToasterService,
    private loadingController: LoadingController,
    public globalService: GlobalService,
    private afStorage: AngularFireStorage
  ) { }

  ngOnInit() {
  }

  initAutocomplete() {
    this.globalService.findNextNumber('EXP').subscribe({
      next: (data: { error: boolean, nextNumber: string }) => {
        this.expenseNum = data.nextNumber;
      }
    });

    this.projectService.getProjectList().subscribe({
      next: (data: { error: false, projects: ProjectJsonI[] }) => {
        this.projectList = data.projects;
        this.filteredProjectList = data.projects;
        if (this.selectedProject.selectedId) {
          this.selectedProject.name = this.projectList.find(project => project.id === this.selectedProject.selectedId)?.title;
        }
      },
    });
  }

  filterProject(event?: any) {
    if (event) {
      this.selectedProject.selectedId = event.option.value;
      this.projectList.map(project => {
        if (project.id === event.option.value) { this.selectedProject.name = project.title; }
      });
    } else {
      this.selectedProject.selectedId = '';
      this.filteredProjectList = this.projectList.filter(project => {
        if (project.title.toLocaleLowerCase().includes(this.selectedProject.name.toLocaleLowerCase())) { return true; }
      });
    }
  }

  async createExpense() {
    if (!this.expenseNum.trim() || !this.price || !this.accountNumber || !this.selectedProject.selectedId) {
      this.toasterService.presentErrorToast('Données obligatoires manquantes');
    } else {
      const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Création...' });
      await loading.present();

      const file = this.base64ToFile(this.croppedImage, 'image.png');

      this.afStorage.upload('/images/' + file.name + '_' + this.expenseNum.trim(), file)
        .then(() => {
          const creationData: ExpenseCreateI = {
            expenseNum: this.expenseNum.trim(),
            price: this.price,
            accountNumber: this.accountNumber,
            category: this.category,
            file: file.name + '_' + this.expenseNum.trim(),
            description: (this.description.trim()) ? this.description.trim() : '',
            projectId: this.selectedProject.selectedId,
            billable: this.billable,
          };

          this.expenseService.create(creationData).subscribe({
            next: async (data: { error: false, expense: ExpenseJsonI }) => {
              await loading.dismiss();
              this.router.navigate(['/tabs/show-expense/', data.expense.id]).then(() => {
                this.toasterService.presentSuccessToast('Création réussie');
              });
            },
            error: async (error: HttpErrorResponse) => {
              await loading.dismiss();
              if (error.error.code === '111101') { this.toasterService.presentErrorToast('Données obligatoires manquantes'); }
              else if (error.error.code === '111102') { this.toasterService.presentErrorToast('Numéro de dépense invalide'); }
              else if (error.error.code === '111103') { this.toasterService.presentErrorToast('Format du numéro de compte invalide'); }
              else if (error.error.code === '111104') { this.toasterService.presentErrorToast('Format du prix invalide'); }
              else if (error.error.code === '111106') { this.toasterService.presentErrorToast('ID du projet invalide'); }
              else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
            }
          });
        })
        .catch(async () => {
          await loading.dismiss();
          this.toasterService.presentErrorToast('Erreur lors de l\' enregistrement de l\'image');
        });
    }
  }

  selectFile() {
    this.file.nativeElement.click();
  }

  fileChangeEvent(event: any) {
    this.selectedPicture = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.height = event.height;
  }

  validate() {
    this.selectedPicture = undefined;
  }

  loadImageFailed() {
    this.toasterService.presentErrorToast('Erreur lors de l\'importation');
  }

  showLightbox() {
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
  }

  base64ToFile(data: string, filename: string) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

}
