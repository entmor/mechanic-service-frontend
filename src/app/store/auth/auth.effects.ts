import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import { catchError, map, of, switchMap, tap } from 'rxjs';
import {
    authCheckToken,
    authCheckTokenFail,
    authCheckTokenSuccess,
    authFail,
    authLogin,
    authLogout,
    authStart,
} from './auth.actions';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthPayload } from './auth.reducers';

@Injectable()
export class AuthEffects {
    authStart$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authStart),
            switchMap((authData) =>
                this.authService.setAuth(authData.email, authData.password).pipe(
                    map(({ user, token }) =>
                        authLogin({
                            token,
                            user: {
                                email: user.email,
                                id: String(user.id),
                                firstname: user.firstname,
                                role: user.role,
                            },
                            redirect: true,
                        })
                    ),
                    catchError(() => of(authFail()))
                )
            )
        )
    );

    authLogin$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(authLogin),
                tap((value: AuthPayload & { redirect: boolean }) => {
                    if (value.redirect) {
                        this.router.navigate(['/dashboard']);
                    }
                })
            ),
        { dispatch: false }
    );

    authCheckToken$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authCheckToken),
            switchMap((authData) =>
                this.authService.getAuth(authData.token).pipe(
                    map(({ user, token }) =>
                        authCheckTokenSuccess({
                            token,
                            user: {
                                email: user.email,
                                id: String(user.id),
                                firstname: user.firstname,
                                role: user.role,
                            },
                        })
                    ),
                    catchError(() => of(authCheckTokenFail()))
                )
            )
        )
    );

    authLogout$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(authLogout),
                switchMap(({ token }) => {
                    if (token) {
                        return this.authService.deleteAuth(token || '').pipe(map((value) => {}));
                    } else {
                        return of({});
                    }
                }),
                tap(() => this.router.navigate(['/login']))
            ),
        { dispatch: false }
    );

    authCheckTokenFail$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(authCheckTokenFail),
                tap(() => this.router.navigate(['/login']))
            ),
        { dispatch: false }
    );

    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: Router
    ) {}
}
