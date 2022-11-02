import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthPayload } from '../../store/auth/auth.reducers';
import { authCheckTokenFail, authLogout } from '../../store/auth/auth.actions';

@Injectable({
    providedIn: 'root',
})
export class HttpAuthUnauthorizedInterceptor implements HttpInterceptor {
    /***************  CONSTRUCTOR  ***************/

    constructor(private store: Store<{ auth: AuthPayload }>) {}

    /***************  METHODS   ***************/

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err instanceof HttpErrorResponse && err.status === 401) {
                    this.store.dispatch(authCheckTokenFail());
                }

                return throwError(() => new Error(err.message));
            })
        );
    }
}
