import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root',
})
export class AuthGuard {

    constructor(private router: Router) { }

    canActivate() {
        const localUser = localStorage.getItem('currentUser');
        if (localUser) {
            return true;
        }
        this.router.navigate(['auth/login']);
        return false;
    }
}
