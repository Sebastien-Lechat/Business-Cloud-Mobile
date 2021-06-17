import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root',
})
export class BackGuard {

    constructor(private router: Router) { }

    canActivate() {
        const localUser = localStorage.getItem('currentUser');
        if (localUser) {
            this.router.navigate(['/tabs/tab3']);
            return false;
        }
        return true;
    }
}
