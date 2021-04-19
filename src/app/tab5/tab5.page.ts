import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('currentUser');
        this.navigateTo('/auth/login');
      },
      error: () => {
        localStorage.removeItem('currentUser');
        this.navigateTo('/auth/login');
      },
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
