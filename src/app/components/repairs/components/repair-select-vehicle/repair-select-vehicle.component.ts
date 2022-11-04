import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    Self,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Vehicle } from '../../../../interface/vehicle.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { RepairSelectVehiclePresenter } from '../../presenters/repair-select-vehicle.presenter';
import { Subscriptions } from '../../../../extends/subscriptions';

@Component({
    selector: 'app-repair-select-vehicle-ui',
    templateUrl: './repair-select-vehicle.component.html',
    providers: [RepairSelectVehiclePresenter],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepairSelectVehicleComponent extends Subscriptions implements OnInit {
    /***************  GETTERS / SETTERS / INPUTES / OUTPUTES ETC.  ***************/

    @Input() set vehicle(vehicle: Vehicle | undefined) {
        if (vehicle) this.presenter.selectedVehicle = vehicle;
    }
    @Output() vehicleChange = new EventEmitter<FormControl<string | null>>();
    @Output() getVehicles = new EventEmitter<string>();
    @Input() set vehicles(vehicles: Vehicle[]) {
        this.presenter.listVehicles = vehicles;
    }

    get searchVehicle() {
        return this.presenter.searchVehicle;
    }

    get vehicleFormControl() {
        return this.presenter.vehicleFormControl;
    }

    get selectedVehicle() {
        return this.presenter.selectedVehicle;
    }

    get listVehicles() {
        return this.presenter.listVehicles;
    }

    /***************  CONSTRUCTOR  ***************/

    constructor(@Self() private presenter: RepairSelectVehiclePresenter) {
        super();
    }

    /***************  LIFE-CYCLES COMPONENT   ***************/

    ngOnInit(): void {
        this.vehicleChange.emit(this.vehicleFormControl);

        this.addSubscription = this.presenter.getVehicles$.subscribe((value) =>
            this.getVehicles.emit(value)
        );

        this.addSubscription = this.presenter.vehicleForm$.subscribe((value) =>
            this.vehicleChange.emit(value)
        );
    }

    /***************  METHODS   ***************/

    vehicleSelected(event: MatAutocompleteSelectedEvent): void {
        this.presenter.vehicleSelected(event);
    }

    removeSelectedVehicle(): void {
        this.presenter.removeSelectedVehicle();
    }

    displayAutocomplete(vehicle: Vehicle): string {
        return vehicle.plate;
    }
}
