import { Component, OnInit, ViewChild } from '@angular/core';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';
import { setWarnSnackbar } from '../../../../store/snackbar/snackbar.actions';
import { RepairsService } from '../../../../services/repairs.service';
import { RepairsTableStandaloneComponent } from '../repairs-table/repairs-table.standalone-component';
import { Store } from '@ngrx/store';
import { Repair } from '../../../../interface/repair.interface';
import { ActivatedRoute } from '@angular/router';
import { DashboardHeaderNavi } from '../../../../interface/dashboard-header-navi.interface';
import { Subscriptions } from '../../../../extends/subscriptions';

@Component({
    selector: 'app-repairs-list',
    templateUrl: './repairs-list.component.html',
})
export class RepairsListComponent extends Subscriptions implements OnInit {
    /***************  GETTERS / SETTERS / INPUTES / OUTPUTES ETC.  ***************/

    @ViewChild(RepairsTableStandaloneComponent) table!: RepairsTableStandaloneComponent;

    data!: Repair[];
    tableResultsLength = 0;

    protected refreshTable$ = new Subject<{ status: string }>();

    isLoadingResults = true;

    headerNavi: DashboardHeaderNavi[] = [
        {
            title: 'Lista napraw',
            url: '/dashboard/repairs',
        },
    ];

    /***************  CONSTRUCTOR  ***************/

    constructor(
        private repairsService: RepairsService,
        private store: Store,
        private activatedRoute: ActivatedRoute
    ) {
        super();
    }

    /***************  LIFE-CYCLES COMPONENT   ***************/

    ngOnInit(): void {
        /** RESOLVER **/
        this.data = this.activatedRoute.snapshot.data['repairs']['data'] || [];
        this.tableResultsLength = this.activatedRoute.snapshot.data['repairs']['count'] || 0;
    }

    ngAfterViewInit(): void {
        this.addSubscription = this.refreshTable$
            .pipe(
                startWith({}),
                switchMap(() => {
                    return this.repairsService
                        .getAllRepairs(
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
}
