import { Component, Inject, OnInit } from '@angular/core';
import { UsersService } from '../../../../services/users.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../../interface/user.interface';
import { Store } from '@ngrx/store';
import { setSuccessSnackbar } from '../../../../store/snackbar/snackbar.actions';
import { AuthState } from '../../../../store/auth/auth.reducers';
import { selectAuthUser } from '../../../../store/auth/auth.selectors';
import { first } from 'rxjs';
import { authLogout } from '../../../../store/auth/auth.actions';

@Component({
    selector: 'app-user-delete-dialog',
    templateUrl: './user-delete-dialog.component.html',
    styleUrls: ['./user-delete-dialog.component.scss'],
})
export class UserDeleteDialogComponent implements OnInit {
    /***************  GETTERS / SETTERS / INPUTES / OUTPUTES ETC.  ***************/

    user!: any;

    get selfDelete(): boolean {
        return this.dialogData.id === this.user.id;
    }

    /***************  CONSTRUCTOR  ***************/

    constructor(
        private usersService: UsersService,
        @Inject(MAT_DIALOG_DATA) public dialogData: User,
        private store: Store<{ auth: AuthState }>,
        private dialogRef: MatDialogRef<UserDeleteDialogComponent>
    ) {}

    /***************  LIFE-CYCLES COMPONENT   ***************/

    ngOnInit(): void {
        this.store
            .select(selectAuthUser)
            .pipe(first())
            .subscribe((user) => (this.user = user));
    }

    /***************  METHODS   ***************/

    deleteUser(): void {
        if (this.dialogData.id) {
            this.usersService.deleteUser(this.dialogData.id).subscribe({
                next: () => {
                    this.store.dispatch(
                        setSuccessSnackbar({
                            message: 'Użytkownik został usunięty prawidłowo.',
                        })
                    );
                    this.dialogRef.close({
                        status: 'deleted',
                    });

                    if (this.selfDelete) {
                        this.store
                            .select((store) => store.auth.token)
                            .pipe(first())
                            .subscribe((token) => {
                                this.store.dispatch(authLogout({ token: token || '' }));
                            });
                    }
                },
            });
        }
    }
}
