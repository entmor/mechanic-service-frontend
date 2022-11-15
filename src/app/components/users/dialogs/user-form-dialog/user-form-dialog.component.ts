import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidator } from '../../../../helpers/validator/form.validator';
import { AddUserForm, PasswordUserForm, User } from '../../../../interface/user.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { setSuccessSnackbar, setWarnSnackbar } from '../../../../store/snackbar/snackbar.actions';
import { UsersService } from '../../../../services/users.service';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-user-form-dialog',
    templateUrl: './user-form-dialog.component.html',
    styleUrls: ['./user-form-dialog.component.scss'],
})
export class UserFormDialogComponent implements OnInit {
    /***************  GETTERS / SETTERS / INPUTES / OUTPUTES ETC.  ***************/

    action: string = 'add';
    user!: User;

    form!: FormGroup<AddUserForm>;
    passwordForm!: FormGroup<PasswordUserForm>;

    changePassword = false;

    getFormError = this.formValidator.getFormError;

    isSaving = false;
    isUserExist = false;

    /***************  CONSTRUCTOR  ***************/

    constructor(
        private formBuilder: FormBuilder,
        private formValidator: FormValidator,
        private matDialogRef: MatDialogRef<UserFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        private dialogData: { action: string; user: User },
        private usersService: UsersService,
        private store: Store
    ) {}

    /***************  LIFE-CYCLES COMPONENT   ***************/

    ngOnInit(): void {
        /** DATA FROM PARENT **/
        this.action = this.dialogData?.action;
        this.user = this.dialogData?.user || {};

        this.createForm();
        this.createPasswordForm();

        this.changePassword = this.action === 'edit' ? false : true;
    }

    /***************  METHODS   ***************/

    createForm(): void {
        this.form = this.formBuilder.nonNullable.group({
            firstname: [
                this.user?.firstname || '',
                [Validators.required, this.formValidator.namePattern],
            ],
            lastname: [
                this.user?.lastname || '',
                [Validators.required, this.formValidator.namePattern],
            ],
            email: [
                this.user?.email || '',
                [Validators.required, this.formValidator.emailValidator()],
            ],
            role: [
                this.user?.role || 'mechanic',
                [Validators.required, this.formValidator.namePattern],
            ],
            status: [
                this.user?.status || 'active',
                [Validators.required, this.formValidator.namePattern],
            ],
        });
    }

    createPasswordForm(): void {
        this.passwordForm = this.formBuilder.nonNullable.group(
            {
                password: ['', [Validators.required, Validators.minLength(8)]],
                password_repeat: ['', [Validators.required, Validators.minLength(8)]],
            },
            {
                validators: [this.formValidator.passwordsMustMatch()],
            }
        );
    }

    saveUser(): void {
        const user = this.form.getRawValue() as User;
        const password = this.changePassword ? this.passwordForm.getRawValue() : {};

        this.isSaving = true;
        this.isUserExist = false;

        if (this.action === 'add') {
            this.usersService
                .setUser({
                    ...user,
                    ...password,
                })
                .pipe(finalize(() => (this.isSaving = false)))
                .subscribe({
                    next: (response) => this.onSaveUserSuccess(response),
                    error: (err) => this.onSaveUserError(err),
                });
        }

        if (this.action === 'edit') {
            this.usersService
                .updateUser({ ...user, id: this.user.id, ...password })
                .pipe(finalize(() => (this.isSaving = false)))
                .subscribe({
                    next: () => this.onUpdateUserSuccess(),
                    error: () => this.onUpdateUserError(),
                });
        }
    }

    private onSaveUserSuccess(response: { id: string }): void {
        this.store.dispatch(setSuccessSnackbar({ message: 'Użytkownik został prawidłowo dodany' }));

        this.matDialogRef.close({
            status: 'added',
            client: {
                ...this.form.getRawValue(),
                id: response.id,
            },
        });
    }

    private onSaveUserError(err: any): void {
        if (err.status === 409 && err.error.details === 'USER EXIST') {
            this.isUserExist = true;
        } else {
            this.store.dispatch(
                setWarnSnackbar({
                    message: 'Błąd, klient nie został dodany. Spróbuj ponownie za chwilę.',
                })
            );
        }
    }

    private onUpdateUserSuccess(): void {
        this.store.dispatch(
            setSuccessSnackbar({ message: 'Użytkownik został prawidłowo edytowany' })
        );

        this.matDialogRef.close({
            status: 'edited',
            user: {
                ...this.form.getRawValue(),
                id: this.user.id,
            },
        });
    }

    private onUpdateUserError(): void {
        this.store.dispatch(
            setWarnSnackbar({
                message: 'Błąd, użytkownik nie został zaktualizowany. Spróbuj ponownie za chwilę.',
            })
        );
    }
}
