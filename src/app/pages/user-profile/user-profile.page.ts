import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillService } from 'src/app/services/bill/bill.service';
import { EstimateService } from 'src/app/services/estimate/estimate.service';
import { UserService } from 'src/app/services/user/user.service';
import { BillI } from 'src/interfaces/billInterface';
import { EstimateI } from 'src/interfaces/estimateInterface';
import { ShortUserListI, UserJsonI } from 'src/interfaces/userInterface';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  id = '';
  user: UserJsonI;

  files: any[] = [];

  requestEnd = 0;

  updateFile = false;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService,
    private billService: BillService,
    private estimateService: EstimateService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) { this.initData(); }
  }

  initData() {
    this.userService.getUser(this.id).subscribe({
      next: (data: { error: false, user: UserJsonI }) => {
        this.user = data.user;

        if (this.user.type === 'client') {
          this.updateFile = true;
          this.billService.getBillList().subscribe({
            next: (data2: { error: false, bills: BillI[] }) => {
              data2.bills = data2.bills.filter(bill => {
                return (bill.clientId as ShortUserListI).id === this.user.id;
              });
              data2.bills.map((bill) => {
                this.files.push(bill);
              });
              this.sortFiles(this.requestEnd += 1);
            },
          });

          this.estimateService.getEstimateList().subscribe({
            next: (data2: { error: false, estimates: EstimateI[] }) => {
              data2.estimates = data2.estimates.filter(estimate => {
                return (estimate.clientId as ShortUserListI).id === this.user.id;
              });
              data2.estimates.map((estimate) => {
                this.files.push(estimate);
              });
              this.sortFiles(this.requestEnd += 1);
            },
          });
        }
      }
    });

  }

  sortFiles(count: number) {
    if (count === 2) {
      this.updateFile = false;
      this.files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }

  nagivateBack() {
    this.location.back();
  }

}
