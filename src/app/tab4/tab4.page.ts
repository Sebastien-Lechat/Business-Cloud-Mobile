import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShortUserListI } from 'src/interfaces/userInterface';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  users: ShortUserListI[] = [];

  filteredUsers: ShortUserListI[] = [];
  searchValue = '';
  filter = '0';

  loading = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.loading = true;
    this.userService.getUsersList().subscribe({
      next: (data: { error: false, users: ShortUserListI[] }) => {
        this.users = data.users;
        this.filteredUsers = data.users;
        this.loading = false;
      },
    });
  }

  filterUsers(event?: any) {
    if (event && event.detail.value) { this.filter = event.detail.value; }
    this.filteredUsers = this.users.filter(user => {
      if (this.filter === '0') {
        if (user.role && user.role.toLowerCase().includes(this.searchValue.toLowerCase())) {
          return true;
        } else if (user.name.toLowerCase().includes(this.searchValue.toLowerCase())) { return true; }
      } else if (this.filter === '1') {
        if (user.type === 'user') {
          if (user.role && user.role.toLowerCase().includes(this.searchValue.toLowerCase())) {
            return true;
          } else if (user.name.toLowerCase().includes(this.searchValue.toLowerCase())) { return true; }
        }
      } else {
        if (user.type === 'client') {
          if (user.role && user.role.toLowerCase().includes(this.searchValue.toLowerCase())) {
            return true;
          } else if (user.name.toLowerCase().includes(this.searchValue.toLowerCase())) { return true; }
        }
      }
    });
  }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }

  capitalize(s: any) {
    if (typeof s !== 'string') { return ''; }
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  refreshData(event: any) {
    this.initData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

}
