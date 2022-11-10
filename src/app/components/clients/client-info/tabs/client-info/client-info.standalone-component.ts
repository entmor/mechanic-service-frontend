import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientFormDialogComponent } from '../../../dialogs/client-form-dialog/client-form-dialog.component';
import { Client } from '../../../../../interface/client.interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClientsService } from '../../../../../services/clients.service';
import { PipesModule } from '../../../../../pipes/pipes.module';
import { MatButtonModule } from '../../../../../modules/angular-material/angular-material.module';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-client-info',
    standalone: true,
    imports: [CommonModule, PipesModule, MatButtonModule],
    templateUrl: './client-info.standalone-component.html',
})
export class ClientInfoStandaloneComponent {
    /***************  GETTERS / SETTERS / INPUTES / OUTPUTES ETC.  ***************/
    private dialog!: MatDialogRef<ClientFormDialogComponent>;
    @Input() public client!: Client;

    /***************  CONSTRUCTOR  ***************/
    constructor(private dialogService: MatDialog, private clientsService: ClientsService) {}

    /***************  METHODS   ***************/
    editClient(): void {
        this.dialog = this.dialogService.open(ClientFormDialogComponent, {
            data: {
                action: 'edit',
                client: this.client,
            },
        });

        this.dialog.afterClosed().subscribe({
            next: (result) => {
                if (result?.status === 'edited') {
                    this.clientsService.getClient(this.client.id || '').subscribe({
                        next: (client) => (this.client = client),
                        error: (err) => console.log(err),
                    });
                }
            },
        });
    }
}
