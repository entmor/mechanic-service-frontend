import { createAction, props } from '@ngrx/store';
import { AuthPayload } from './auth.reducers';

export const authStart = createAction(
    '[AUTH] Auth Start',
    props<{ email: string; password: string }>()
);

export const authLogin = createAction(
    '[AUTH] Auth Login',
    props<AuthPayload & { redirect: boolean }>()
);

export const authLogout = createAction('[AUTH] Auth Logout', props<{ token: string }>());

export const authFail = createAction('[AUTH] Auth Fail');

export const authCheckToken = createAction('[AUTH] Auth Check Token', props<{ token: string }>());

export const authCheckTokenSuccess = createAction(
    '[AUTH] Auth Check Token Success',
    props<AuthPayload>()
);

export const authCheckTokenFail = createAction('[AUTH] Auth Check Token Fail');
