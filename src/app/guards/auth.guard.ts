import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    private localUser = localStorage.getItem('currentUser');

    constructor(private router: Router) { }

    canActivate() {
        if (this.localUser) {
            return true;
        }
        this.router.navigate(['auth/login']);
        return false;
    }
}
