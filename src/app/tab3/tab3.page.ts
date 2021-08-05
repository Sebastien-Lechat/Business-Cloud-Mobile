import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillI } from 'src/interfaces/billInterface';
import { StatisticI } from 'src/interfaces/globalInterface';
import { AccountService } from '../services/account/account.service';
import { BillService } from '../services/bill/bill.service';
import { GlobalService } from '../services/global/global.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  statistics: StatisticI;
  nearlyLateBills: any[];
  lateBills: any[];
  loading = false;

  constructor(
    private router: Router,
    private location: Location,
    private billService: BillService,
    private globalService: GlobalService,
    public accountService: AccountService,
  ) { }

  ngOnInit(): void {
  }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }

  nagivateBack() {
    this.location.back();
  }

  ionViewDidEnter() {
    this.initData();
  }

  initData() {
    this.loading = true;
    this.globalService.getStatistics().subscribe({
      next: (data: { error: boolean, statistics: StatisticI }) => {
        if (data.statistics.projectTimeTotal !== undefined) {
          data.statistics.projectTimeTotal = !isNaN(parseFloat((data.statistics.projectTimeTotal as number / (1000 * 60 * 60)).toFixed(2))) ? parseFloat((data.statistics.projectTimeTotal as number / (1000 * 60 * 60)).toFixed(2)) : 0;
        }
        this.statistics = data.statistics;
        this.statistics.billUnpaidAmountTotal = parseFloat(this.statistics.billUnpaidAmountTotal.toFixed(2));
        this.statistics.gainTotal = parseFloat(this.statistics.gainTotal.toFixed(1));
        if (this.statistics && this.nearlyLateBills && this.lateBills) {
          this.loading = false;
        }
      }
    });
    this.billService.getBillList().subscribe({
      next: (data: { error: boolean, bills: BillI[] }) => {
        this.lateBills = data.bills.filter((bill: BillI) => bill.status === 'En retard');
        this.nearlyLateBills = data.bills.filter((bill: BillI) => bill.status !== 'En retard' && bill.status !== 'Payée');
        this.nearlyLateBills.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if (this.statistics && this.nearlyLateBills && this.lateBills) {
          this.loading = false;
        }
      }
    });
  }

}
