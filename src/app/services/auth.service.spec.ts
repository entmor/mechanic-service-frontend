import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API_URL } from '../../environments/environment';
import { USERS } from '../../mocks/users-data';

describe('AuthService', () => {
    let service: AuthService;
    let httpTestingController: HttpTestingController;

    const apiBaseUrl = API_URL;

    const user = USERS[0];
    const email = user.email;
    const password = 'przykladoweHaslo!';

    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    const response = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        user,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService],
        });
        service = TestBed.inject(AuthService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should response token and user [setAuth]', () => {
        service.setAuth(email, password).subscribe((res) => {
            expect(res).toEqual(response);
        });

        const req = httpTestingController.expectOne(`${apiBaseUrl}/v1/auth`);
        expect(req.request.method).toEqual('POST');
        // BODY CHECK
        expect(req.request.body.email).toEqual(email);
        expect(req.request.body.password).toEqual(password);

        req.flush(response);
    });

    it('should response token and user [getAuth]', () => {
        service.getAuth(token).subscribe((res) => {
            expect(res).toEqual(response);
        });

        const req = httpTestingController.expectOne(`${apiBaseUrl}/v1/auth`);

        expect(req.request.method).toEqual('GET');
        expect(req.request.headers.get('authorization')).toEqual(`Bearer ${token}`);

        req.flush(response);
    });

    it('should delete token [deleteAuth]', () => {
        service.deleteAuth(token).subscribe((res) => {
            expect(res).toEqual({
                deleted: true,
            });
        });

        const req = httpTestingController.expectOne(`${apiBaseUrl}/v1/auth`);

        expect(req.request.method).toEqual('DELETE');
        expect(req.request.headers.get('authorization')).toEqual(`Bearer ${token}`);

        req.flush({
            deleted: true,
        });
    });

    it('should give an error if set Auth fails', () => {
        service.setAuth(email, password).subscribe({
            error: (err) => {
                expect(err.status).toBe(401);
            },
        });

        const req = httpTestingController.expectOne(`${apiBaseUrl}/v1/auth`);

        expect(req.request.method).toEqual('POST');
        // BODY CHECK
        expect(req.request.body.email).toEqual(email);
        expect(req.request.body.password).toEqual(password);
        req.flush(
            {
                message: 'UNAUTH',
            },
            {
                status: 401,
                statusText: 'UNAUTH',
            }
        );
    });

    afterEach(() => {
        httpTestingController.verify();
    });
});
