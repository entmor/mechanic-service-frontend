import { Injectable } from '@angular/core';
import { API_URL } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthSuccess } from '../interface/auth.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    /***************  GETTERS / SETTERS / INPUTES / OUTPUTES ETC.  ***************/

    private apiBaseUrl = API_URL;

    /***************  CONSTRUCTOR  ***************/

    constructor(private httpClient: HttpClient) {}

    /***************  METHODS   ***************/

    setAuth(email: string, password: string): Observable<AuthSuccess> {
        return this.httpClient.post<AuthSuccess>(`${this.apiBaseUrl}/v1/auth`, { email, password });
    }

    getAuth(token: string): Observable<AuthSuccess> {
        return this.httpClient.get<AuthSuccess>(`${this.apiBaseUrl}/v1/auth`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    }

    deleteAuth(token: string): Observable<{ deleted: boolean }> {
        return this.httpClient.delete<{ deleted: boolean }>(`${this.apiBaseUrl}/v1/auth`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    }
}
