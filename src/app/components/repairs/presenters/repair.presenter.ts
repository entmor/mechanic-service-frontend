import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Repair, RepairCostsFormGroup, RepairPart } from '../../../interface/repair.interface';
import { Store } from '@ngrx/store';
import { setSuccessSnackbar, setWarnSnackbar } from '../../../store/snackbar/snackbar.actions';
import { Vehicle } from '../../../interface/vehicle.interface';

@Injectable()
export class RepairPresenter {
    /***************  GETTERS / SETTERS / INPUTES / OUTPUTES ETC.  ***************/

    private saveRepair = new Subject<any>();
    saveRepair$ = this.saveRepair.asObservable();

    formCosts!: FormGroup<RepairCostsFormGroup>;
    formInformation!: FormGroup;
    formSelectedVehicle!: FormControl<string | null>;

    information!: any;
    vehicle!: Vehicle | undefined;
    partsList!: RepairPart[];

    set repair(repair: Repair) {
        this.information = {
            status: repair.status,
            type: repair.type,
            mileage: repair.mileage,
        };

        this.vehicle = repair.vehicle;

        this.partsList = repair.partsList;
    }

    get areFormsValid() {
        return this.formInformation?.valid &&
            this.formSelectedVehicle?.valid &&
            this.formCosts?.valid
            ? true
            : false;
    }

    get areFormsInValid() {
        return this.formInformation?.invalid ||
            this.formSelectedVehicle?.invalid ||
            this.formCosts?.invalid
            ? true
            : false;
    }

    /***************  CONSTRUCTOR  ***************/

    constructor(private store: Store) {}

    /***************  METHODS   ***************/

    onAddRepair() {
        this.store.dispatch(setSuccessSnackbar({ message: 'Naprawa została dodana' }));
    }

    onEditRepair() {
        this.store.dispatch(
            setSuccessSnackbar({
                message: 'Naprawa została zaktualizowana',
            })
        );
    }

    onSaveRepair() {
        if (this.areFormsValid) {
            const information = this.formInformation.getRawValue();
            const vehicleId = this.formSelectedVehicle.value;
            const partsList = this.formCosts.getRawValue().parts;

            const repair: Repair = {
                ...information,
                vehicleId,
                partsList,
            };

            this.saveRepair.next(repair);
        } else {
            this.store.dispatch(setWarnSnackbar({ message: 'Uzupełnij wszystkie wymagane pola!' }));
            this.formCosts.markAllAsTouched();
            this.formInformation.markAllAsTouched();
        }
    }
}
