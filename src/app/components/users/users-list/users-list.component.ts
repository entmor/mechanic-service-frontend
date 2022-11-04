import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DashboardHeaderNavi } from '../../../interface/dashboard-header-navi.interface';
import { UsersTableStandaloneComponent } from '../users-table/users-table.standalone-component';
import { User } from '../../../interface/user.interface';
import { catchError, map, of, Subject, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
    MAT_PAGINATOR_DEFAULT_OPTIONS,
    MatPaginatorDefaultOptions,
} from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { setWarnSnackbar } from '../../../store/snackbar/snackbar.actions';
import { UsersService } from '../../../services/users.service';
import { Subscriptions } from '../../../extends/subscriptions';
import { UserFormDialogComponent } from '../dialogs/user-form-dialog/user-form-dialog.component';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
})
export class UsersListComponent extends Subscriptions implements OnInit {
    /***************  GETTERS / SETTERS / INPUTES / OUTPUTES ETC.  ***************/

    @ViewChild(UsersTableStandaloneComponent) table!: UsersTableStandaloneComponent;

    data!: User[];
    tableResultsLength = 0;

    isLoadingResults = true;

    headerNavi: DashboardHeaderNavi[] = [{ title: 'Lista użytkowników', url: '/dashboard/users' }];

    protected refreshTable$ = new Subject<{ status: string }>();

    /***************  CONSTRUCTOR  ***************/

    constructor(
        private dialogService: MatDialog,
        @Inject(MAT_PAGINATOR_DEFAULT_OPTIONS)
        matPaginatorDefaultOptions: MatPaginatorDefaultOptions,
        private store: Store<{ snackbar: any }>,
        private activatedRoute: ActivatedRoute,
        private usersService: UsersService
    ) {
        super();
    }

    /***************  LIFE-CYCLES COMPONENT   ***************/

    ngOnInit(): void {
        /** RESOLVER **/
        this.data = this.activatedRoute.snapshot.data['users']['data'] || [];
        this.tableResultsLength = this.activatedRoute.snapshot.data['users']['count'] || 0;
    }

    ngAfterViewInit(): void {
        this.addSubscription = this.refreshTable$
            .pipe(
                switchMap(() => {
                    return this.usersService
                        .getAllUsers(
                            this.table.tablePageIndex,
                            this.table.tablePageSize,
                            this.table.sort.direction,
                            this.table.sort.active
                        )
                        .pipe(
                            catchError(() => {
                                this.store.dispatch(
                                    setWarnSnackbar({
                                        message:
                                            'Pobieranie pojazdów nie powiodło się - SERVER ERROR',
                                    })
                                );
                                return of(null);
                            })
                        );
                }),
                map((response) => {
                    if (response === null) return [];

                    this.tableResultsLength = response.count;
                    return response.data;
                })
            )
            .subscribe((data) => (this.data = data));
    }

    /***************  METHODS   ***************/

    loadData(): void {
        this.refreshTable$.next({
            status: 'tableChange',
        });
    }

    addUser(): void {
        this.addSubscription = this.dialogService
            .open(UserFormDialogComponent, {
                data: { action: 'add' },
            })
            .afterClosed()
            .subscribe({
                next: (response) => {
                    if (response?.status === 'added') {
                        this.refreshTable$.next({
                            status: 'added',
                        });
                    }
                },
            });
    }
}
