import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
class LoggedInGuard {
    constructor(private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
            const token = localStorage.getItem('accessToken');

            if (token) {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                const expiresIn = tokenPayload.exp * 1000 - Date.now();

                if (expiresIn > 0) {
                    //const expiresInSec = Math.round(expiresIn / 1000);
                    return true;
                }
                this.router.navigate(['/login'], { queryParams: { error: 'Erro de permissão' } });
                    return false;
            }
            this.router.navigate(['/login'], { queryParams: { error: 'Erro de permissão' } });
            return false;
        }
}

export const IsLoggedInGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    return inject(LoggedInGuard).canActivate(route, state);
}