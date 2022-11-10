import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../../../../interface/vehicle.interface';
import { PipesModule } from '../../../../../pipes/pipes.module';
import { MatButtonModule } from '../../../../../modules/angular-material/angular-material.module';
import { MatDialog } from '@angular/material/dialog';
import { VehicleFormDialogComponent } from '../../../dialogs/vehicle-form-dialog/vehicle-form-dialog.component';
import { VehiclesService } from '../../../../../services/vehicles.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-vehicle-info',
    standalone: true,
    imports: [CommonModule, PipesModule, MatButtonModule, RouterModule],
    templateUrl: './vehicle-info.standalone-component.html',
})
export class VehicleInfoStandaloneComponent {
    /***************  GETTERS / SETTERS / INPUTES / OUTPUTES ETC.  ***************/

    @Input() vehicle!: Vehicle;

    /***************  CONSTRUCTOR  ***************/

    constructor(private dialogService: MatDialog, private vehiclesService: VehiclesService) {}

    /***************  METHODS   ***************/

    editVehicle(): void {
        this.dialogService
            .open(VehicleFormDialogComponent, {
                data: {
                    action: 'edit',
                    vehicle: this.vehicle,
                },
            })
            .afterClosed()
            .subscribe({
                next: (result) => {
                    if (result?.status === 'edited') {
                        this.vehiclesService
                            .getVehicle(this.vehicle.id || '')
                            .subscribe((vehicle: Vehicle) => (this.vehicle = vehicle));
                    }
                },
            });
    }
}
