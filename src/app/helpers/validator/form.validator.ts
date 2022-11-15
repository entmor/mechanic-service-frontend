import {
    AbstractControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FormValidator {
    vehice = {
        typePattern: Validators.pattern(new RegExp(/^(CAR|TRUCK|MOTORCYCLE|OTHER)$/iu)),
        platePattern: Validators.pattern(new RegExp(/^[- \p{L}\p{N}]*$/iu)),
        engineTypePattern: Validators.pattern(
            new RegExp(/^(DIESEL|PETROL|PETROL_LPG|PETROL_CNG|HYBRID|HYDROGEN|ELECTRIC|ETANOL)$/iu)
        ),
    };

    mongoId = Validators.pattern(new RegExp(/^[a-fA-F0-9]{24}$/));

    namePattern = Validators.pattern(new RegExp(/^[-.,:=/\\() \p{L}\p{N}]*$/iu));

    numberPattern = Validators.pattern(new RegExp(/^[0-9]*$/iu));

    floatPattern = Validators.pattern(new RegExp(/^[0-9.,]*$/iu));

    vinPattern = Validators.pattern(
        new RegExp(/^[0-9wertyupasdfghjklzxxcvbnmWERTYUPASDFGHJKLZXCVBNM]{17}$/iu)
    );
    addressPattern = Validators.pattern(new RegExp(/^[-., /\\() \p{L}\p{N}]*$/iu));
    zipCodePattern = Validators.pattern(new RegExp(/^[0-9- a-zA-Z]*$/iu));
    clientTypePattern = Validators.pattern(new RegExp(/^(personal|business)$/i));

    phonePattern = Validators.pattern(new RegExp(/^[0-9 ()+\-\p{N}]*$/iu));

    genderPattern = Validators.pattern(new RegExp(/^(male|female|divers)$/i));

    birthdayPattern = Validators.pattern(new RegExp(/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/i));

    jwt = new RegExp(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)/);

    emailValidator = (): ValidatorFn => {
        const nameRe = new RegExp(
            '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
            'i'
        );
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value.length > 0) {
                const forbidden = nameRe.test(control.value);
                return forbidden ? null : { email: true };
            }

            return null;
        };
    };

    passwordsMustMatch() {
        return (control: AbstractControl) => {
            const password = control.get('password');
            const password_repeat = control.get('password_repeat');

            if (password?.value !== password_repeat?.value) {
                password_repeat?.setErrors({ mustMatchPassword: true });
            } else {
                password_repeat?.setErrors(null);
            }

            return null;
        };
    }

    getFormError(
        name: string,
        control:
            | AbstractControl<string>
            | AbstractControl<number>
            | AbstractControl<string | null>
            | AbstractControl<number | null>
            | null
    ): string {
        //PASSWORD REPEAT ERROR
        if (control?.hasError('mustMatchPassword')) return 'Powtórzone hasło musi być takie samo';
        // email ERROR
        if (control?.hasError('email')) return 'Niepoprawny adres E-mail';
        // PLATE ERRORS
        if (control?.hasError('pattern') && name === 'plate') return 'Niedozwolone znaki';

        if (control?.hasError('pattern') && name === 'floatPattern')
            return 'Dozwolone tylko liczby dziesiętne np. 1.6';

        if (control?.hasError('pattern') && name === 'numberPattern')
            return 'Dozwolone tylko liczby całkowite.';

        // CAR YEAR ERRORS
        if (control?.hasError('max') && name === 'year')
            return `Produkcja nie może być nowsza niż ${control.errors?.['max'].max} `;
        if (control?.hasError('min') && name === 'year')
            return `Najstarsze auto pochodzi z roku: ${control.errors?.['min'].min} `;

        // VIN ERRORS
        if (control?.hasError('pattern') && name === 'vin')
            return 'VIN: składa się z 17 znaków, cyfr i liter z wyłączeniem liter I, O oraz Q';

        // DEFAULT ERRORS
        if (control?.hasError('required')) return 'Pole wymagane';

        if (control?.hasError('max'))
            return `Liczba nie może być większa niż ${control.errors?.['max'].max} `;
        if (control?.hasError('min'))
            return `Liczba nie może być mniejsza niż: ${control.errors?.['min'].min} `;

        if (control?.hasError('minlength'))
            return `Musi być co najmniej ${control.errors?.['minlength'].requiredLength} znaków`;

        if (control?.hasError('maxlength'))
            return `Musi być maksymalnie ${control.errors?.['maxlength'].requiredLength} znaków`;

        if (control?.hasError('pattern')) return 'Niedozwolone znaki';

        return 'Błąd';
    }

    // getErrorMessage( control: AbstractControl ): string {
    //   if(control.hasError('required'))
    // }
}
