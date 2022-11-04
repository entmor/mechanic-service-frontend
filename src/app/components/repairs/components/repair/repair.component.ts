import { Component, EventEmitter, Input, OnInit, Output, Self } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RepairPresenter } from '../../presenters/repair.presenter';
import { Repair, RepairCostsFormGroup } from '../../../../interface/repair.interface';
import { DashboardHeaderNavi } from '../../../../interface/dashboard-header-navi.interface';
import { Subscriptions } from '../../../../extends/subscriptions';

@Component({
    selector: 'app-repair-ui',
    templateUrl: './repair.component.html',
    styleUrls: ['./repair.component.scss'],
    viewProviders: [RepairPresenter],
})
export class RepairComponent extends Subscriptions implements OnInit {
    /***************  GETTERS / SETTERS / INPUTES / OUTPUTES ETC.  ***************/

    @Input() isSaving = false;
    @Input() set isUpdated(isUpdated: boolean) {
        if (isUpdated) this.presenter.onEditRepair();
    }
    @Input() set isAdded(isAdded: boolean) {
        if (isAdded) this.presenter.onAddRepair();
        window.scrollTo(0, 0);
    }
    @Input() set repair(repair: Repair) {
        this.presenter.repair = repair;
    }
    @Input() buttonText!: string;
    @Input() headerNavi!: DashboardHeaderNavi[];
    @Output() saveRepair = new EventEmitter<Repair>();

    get partsList() {
        return this.presenter.partsList;
    }

    get vehicle() {
        return this.presenter.vehicle;
    }

    get information() {
        return this.presenter.information;
    }

    get formCosts(): FormGroup<RepairCostsFormGroup> {
        return this.presenter.formCosts;
    }
    set formCosts(form: FormGroup<RepairCostsFormGroup>) {
        this.presenter.formCosts = form;
    }

    set formInformation(form: FormGroup) {
        this.presenter.formInformation = form;
    }

    set formVehicle(control: FormControl<string | null>) {
        this.presenter.formSelectedVehicle = control;
    }

    /***************  CONSTRUCTOR  ***************/

    constructor(@Self() private presenter: RepairPresenter) {
        super();
    }

    /***************  LIFE-CYCLES COMPONENT   ***************/

    ngOnInit(): void {
        this.addSubscription = this.presenter.saveRepair$.subscribe((next) => {
            this.saveRepair.emit(next);
        });
    }

    /***************  METHODS   ***************/

    onSaveRepair(): void {
        this.presenter.onSaveRepair();
    }
}
