import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillI } from 'src/interfaces/billInterface';
import { EstimateI } from 'src/interfaces/estimateInterface';
import { ShortUserListI } from 'src/interfaces/userInterface';
import { BillService } from '../services/bill/bill.service';
import { EstimateService } from '../services/estimate/estimate.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  files: any[] = [];
  filteredFiles: any[] = [];
  bills: BillI[] = [];
  estimates: EstimateI[] = [];
  searchValue = '';

  loading = false;
  requestEnd = 0;

  filterStatus = '0';
  filterType = '0';

  constructor(private router: Router, private billService: BillService, private estimateService: EstimateService) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.loading = true;

    this.requestEnd = 0;

    this.files = [];
    this.filteredFiles = [];
    this.bills = [];
    this.estimates = [];

    this.billService.getBillList().subscribe({
      next: (data: { error: false, bills: BillI[] }) => {
        data.bills.map((bill) => {
          bill.deadline = formatDate(bill.deadline, 'longDate', 'fr-FR', 'Europe/France');
          this.bills.push(bill);
          this.files.push(bill);
        });
        this.sortFiles(this.requestEnd += 1);
      },
    });

    this.estimateService.getEstimateList().subscribe({
      next: (data: { error: false, estimates: EstimateI[] }) => {
        data.estimates.map((estimate) => {
          estimate.deadline = formatDate(estimate.deadline, 'longDate', 'fr-FR', 'Europe/France');
          this.estimates.push(estimate);
          this.files.push(estimate);
        });
        this.sortFiles(this.requestEnd += 1);
      },
    });
  }

  navigateTo(path: string, id?: string) {
    this.router.navigate([path, id]);
  }

  sortFiles(count: number) {
    if (count === 2) {
      this.filteredFiles = this.files;
      this.files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.filteredFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.loading = false;
    }
  }

  filterFiles(event?: any) {
    if (event && event.target.id === 'status' && event.detail.value) { this.filterStatus = event.detail.value; }
    if (event && event.target.id === 'type' && event.detail.value) { this.filterType = event.detail.value; }

    if (this.filterType === '1') {
      this.filteredFiles = this.bills.filter(bill => {
        const searchBill = (): boolean => {
          if (bill.billNum.toLowerCase().includes(this.searchValue.toLowerCase())) {
            return true;
          } else if ((bill.clientId as ShortUserListI).name.toLowerCase().includes(this.searchValue.toLowerCase())) { return true; }
        };

        if (this.filterStatus === '1' && bill.status === 'Payée') {
          return searchBill();
        } else if (this.filterStatus === '2' && bill.status === 'En retard') {
          return searchBill();
        } else if (this.filterStatus === '3' && (bill.status === 'Partiellement payée' || bill.status === 'Non payée')) {
          return searchBill();
        } else if (this.filterStatus === '0') {
          return searchBill();
        }
      });
    } else if (this.filterType === '2') {
      this.filteredFiles = this.estimates.filter(estimate => {
        const searchEstimate = (): boolean => {
          if (estimate.estimateNum.toLowerCase().includes(this.searchValue.toLowerCase())) {
            return true;
          } else if ((estimate.clientId as ShortUserListI).name.toLowerCase().includes(this.searchValue.toLowerCase())) { return true; }
        };

        if (this.filterStatus === '1' && estimate.status === 'Acceptée') {
          return searchEstimate();
        } else if (this.filterStatus === '2' && (estimate.status === 'Refusé' || estimate.status === 'En retard')) {
          return searchEstimate();
        } else if (this.filterStatus === '3' && estimate.status === 'En attente') {
          return searchEstimate();
        } else if (this.filterStatus === '0') {
          return searchEstimate();
        }
      });
    } else {
      this.filteredFiles = this.files.filter(file => {
        const searchFile = (): boolean => {
          if ((file.billNum && file.billNum.toLowerCase().includes(this.searchValue.toLowerCase())) || (file.estimateNum && file.estimateNum.toLowerCase().includes(this.searchValue.toLowerCase()))) {
            return true;
          } else if (file.clientId.name.toLowerCase().includes(this.searchValue.toLowerCase())) { return true; }
        };
        if (this.filterStatus === '1' && (file.status === 'Acceptée' || file.status === 'Payée')) {
          return searchFile();
        } else if (this.filterStatus === '2' && (file.status === 'En retard' || file.status === 'Refusé')) {
          return searchFile();
        } else if (this.filterStatus === '3' && (file.status === 'Partiellement payée' || file.status === 'Non payée' || file.status === 'En attente')) {
          return searchFile();
        } else if (this.filterStatus === '0') {
          return searchFile();
        }
      });
    }
  }

}
