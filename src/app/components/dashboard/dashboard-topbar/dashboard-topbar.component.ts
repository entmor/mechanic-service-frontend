import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { toogleMenu } from '../../../store/sidemenu/sidemenu.action';
import { SideMenuState } from '../../../store/sidemenu/sidemenu.reducer';
import { AuthState } from '../../../store/auth/auth.reducers';
import { authLogout } from '../../../store/auth/auth.actions';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import { first } from 'rxjs';

@Component({
    selector: 'app-dashboard-topbar',
    templateUrl: './dashboard-topbar.component.html',
    styleUrls: ['./dashboard-topbar.component.scss'],
})
export class DashboardTopbarComponent {
    /***************  GETTERS / SETTERS / INPUTES / OUTPUTES ETC.  ***************/

    user$ = this.store.select(selectAuthUser);
    sidemenu$ = this.store.select('sidemenu');

    /***************  CONSTRUCTOR  ***************/

    constructor(private store: Store<{ sidemenu: SideMenuState; auth: AuthState }>) {}

    /***************  METHODS   ***************/

    toogleMenu(): void {
        this.store.dispatch(toogleMenu());
    }

    logout(): void {
        this.store
            .select((store) => store.auth.token)
            .pipe(first())
            .subscribe((token) => {
                this.store.dispatch(authLogout({ token: token || '' }));
            });
    }
}
