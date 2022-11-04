import { Component } from '@angular/core';
import { Repair } from '../../../../interface/repair.interface';
import { RepairsService } from '../../../../services/repairs.service';
import { Router } from '@angular/router';
import { DashboardHeaderNavi } from '../../../../interface/dashboard-header-navi.interface';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-repair',
    templateUrl: 'repair-add.container.html',
})
export class RepairAddContainerComponent {
    /***************  GETTERS / SETTERS / INPUTES / OUTPUTES ETC.  ***************/

    isSaving = false;

    headerNavi: DashboardHeaderNavi[] = [
        {
            title: 'Lista napraw',
            url: '/dashboard/repairs',
        },
        {
            title: 'Dodaj naprawę',
            url: '/dashboard/repairs/add',
        },
    ];

    buttonText = 'Dodaj naprawę';

    /***************  CONSTRUCTOR  ***************/

    constructor(private repairsService: RepairsService, private router: Router) {}

    /***************  METHODS   ***************/

    saveNewRepair(repair: Repair) {
        this.isSaving = true;

        this.repairsService
            .setRepair(repair)
            .pipe(finalize(() => (this.isSaving = false)))
            .subscribe((res) =>
                this.router.navigate([`/dashboard/repairs/info/${res.id}`], {
                    queryParams: { added: true },
                })
            );
    }
}
