import { TestBed } from '@angular/core/testing';

import { ClientsService } from './clients.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CLIENTS, VEHICLES } from '../../mocks/users-data';
import { API_URL } from '../../environments/environment';
import { Client } from '../interface/client.interface';
import { getAllByCreatedAt } from '../../mocks/helpers';

describe('ClientsService', () => {
    let service: ClientsService;
    let httpTestingController: HttpTestingController;

    const apiBaseUrl = API_URL;

    const client = CLIENTS[0];
    const id = String(client.id);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ClientsService],
        });
        service = TestBed.inject(ClientsService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should find a client by id', () => {
        service.getClient(id).subscribe((response) => {
            expect(response).toEqual(client);
            expect(response.id).toBe(id);
        });

        const req = httpTestingController.expectOne(`${apiBaseUrl}/v1/client/${id}`);
        expect(req.request.method).toEqual('GET');

        req.flush(client);
    });

    it('should insert new client data', () => {
        const _id = '623982a816b554bda9b9a32a';

        const newClient: Client = {
            name: 'Melania Stolz',
            type: 'personal',
            phone: '723444111',
            email: 'melania@stolz.pl',
            gender: 'female',
            street: 'Ul. Dworcowa 2a',
            city: 'Wieleń',
            zipCode: '64-730',
        };

        service.addClient(newClient).subscribe((response) => {
            expect(response.id).toEqual(_id);
        });

        const req = httpTestingController.expectOne(`${apiBaseUrl}/v1/client/`);
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(newClient);

        req.flush({
            id: _id,
        });
    });

    it('should update client data', () => {
        const updated_data = {
            id,
            name: 'Milena Piekarczyk',
            email: 'm.piekarczyk@gmail.com',
            gender: 'female',
        };
        service.updateClient(updated_data).subscribe((response) => {
            expect(response).toBeTruthy();
            expect(response.updated).toBeTruthy();
        });

        const req = httpTestingController.expectOne(`${apiBaseUrl}/v1/client/`);
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body).toEqual(updated_data);

        req.flush({ updated: true });
    });

    it('should delete client data', () => {
        service.deleteClient(id).subscribe((response) => {
            expect(response).toBeTruthy();
            expect(response.deleted).toBeTruthy();
        });

        const req = httpTestingController.expectOne(`${apiBaseUrl}/v1/client/${id}`);
        expect(req.request.method).toEqual('DELETE');

        req.flush({ deleted: true });
    });

    it('should find all clients', () => {
        service.getAllClients().subscribe((response) => {
            expect(response).toBeTruthy();

            expect(response.data.length).toBe(CLIENTS.length);
            expect(response.count).toBe(CLIENTS.length);
        });

        const req = httpTestingController.expectOne(
            (req) => req.url == `${apiBaseUrl}/v1/client/all`
        );

        expect(req.request.method).toEqual('GET');
        expect(req.request.params.get('page')).toEqual('1');
        expect(req.request.params.get('per_page')).toEqual('25');
        expect(req.request.params.get('sort')).toEqual('ASC');
        expect(req.request.params.get('orderby')).toEqual('');
        expect(req.request.params.get('where')).toBeFalsy();

        req.flush({
            count: VEHICLES.length,
            page: 1,
            per_page: 25,
            sort: 'ASC',
            isNextPage: false,
            data: CLIENTS,
        });
    });

    it('should find clients with params', () => {
        const data = getAllByCreatedAt<Client>(CLIENTS, 42424424).slice(1, 1);

        service
            .getAllClients(2, 1, 'desc', 'createdAt', {
                createdAt: {
                    $gte: 42424424,
                },
            })
            .subscribe((response) => {
                expect(response).toBeTruthy();

                expect(response.count).toBe(data.length);
                expect(response.page).toBe(2);
                expect(response.per_page).toBe(1);
                expect(response.sort).toBe('DESC');
                expect(response.isNextPage).toBeTrue();
                expect(response.data.length).toBe(data.length);
                expect(response.data).toEqual(data);
            });

        const req = httpTestingController.expectOne(
            (req) => req.url == `${apiBaseUrl}/v1/client/all`
        );

        expect(req.request.method).toEqual('GET');
        expect(req.request.params.get('page')).toEqual('2');
        expect(req.request.params.get('per_page')).toEqual('1');
        expect(req.request.params.get('sort')).toEqual('DESC');
        expect(req.request.params.get('orderby')).toEqual('createdAt');
        expect(req.request.params.get('where[createdAt][$gte]')).toEqual('42424424');

        req.flush({
            count: data.length,
            page: 2,
            per_page: 1,
            sort: 'DESC',
            isNextPage: true,
            data: data,
        });
    });

    afterEach(() => {
        httpTestingController.verify();
    });
});
