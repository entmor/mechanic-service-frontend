import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { selectIsLogged } from '../store/auth/auth.selectors';
import { Store } from '@ngrx/store';
import { AuthState } from '../store/auth/auth.reducers';

@Injectable({
    providedIn: 'root',
})
export class IsNotLoggedGuard implements CanActivate, CanLoad {
    /***************  CONSTRUCTOR  ***************/

    constructor(private store: Store<{ auth: AuthState }>, private router: Router) {}

    /***************  METHODS   ***************/

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.isNotLogged();
    }
    canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.isNotLogged();
    }

    private isNotLogged(): Promise<boolean | UrlTree> {
        return new Promise((resolve, reject) => {
            this.store.select(selectIsLogged).subscribe((isLogged: boolean) => {
                if (isLogged) resolve(this.router.createUrlTree(['/dashboard']));
                resolve(true);
            });
        });
    }
}
