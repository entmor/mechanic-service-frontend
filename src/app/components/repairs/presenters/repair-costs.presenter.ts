import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { FormValidator } from '../../../helpers/validator/form.validator';
import {
    RepairCostsFormGroup,
    RepairPart,
    RepairPartFormGroup,
} from '../../../interface/repair.interface';

@Injectable()
export class RepairCostsPresenter {
    /***************  GETTERS / SETTERS / INPUTES / OUTPUTES ETC.  ***************/

    form: FormGroup<RepairCostsFormGroup> = this.formBuilder.group({
        parts: this.formBuilder.array([]),
    });

    getFormError = this.formValidators.getFormError;

    get parts() {
        return this.form.controls['parts'] as FormArray;
    }

    /***************  CONSTRUCTOR  ***************/

    constructor(private formBuilder: FormBuilder, private formValidators: FormValidator) {}

    /***************  METHODS   ***************/

    setParts(parts: RepairPart[]) {
        parts.forEach((part) => {
            this.addPart(part);
        });
    }

    setCount(index: number): void {
        this.setPriceBuy(index);
    }

    setPriceBuy(index: number): void {
        const part = this.parts.at(index);
        const { count, tax, priceBuyNetto } = this.getPartRow(index);

        part.get('priceNetto')?.setValue((count * priceBuyNetto).toFixed(2));

        part.get('priceBrutto')?.setValue(this.toBrutto(count * priceBuyNetto, tax));
    }

    changePriceNetto(index: number): void {
        const part = this.parts.at(index);
        const { count, tax, priceNetto } = this.getPartRow(index);

        part.get('priceBrutto')?.setValue(this.toBrutto(priceNetto, tax));
        part.get('priceBuyNetto')?.setValue((priceNetto / count).toFixed(2));
    }

    changePriceBrutto(index: number): void {
        const part = this.parts.at(index);
        const { count, tax, priceBrutto } = this.getPartRow(index);

        part.get('priceNetto')?.setValue(this.toNetto(priceBrutto, tax));
        part.get('priceBuyNetto')?.setValue(this.toNetto(priceBrutto / count, tax));
    }

    private getPartRow(index: number) {
        const part = this.parts.at(index);
        return {
            count: part.get('count')?.value || 0,
            tax: part.get('tax')?.value || 23,
            priceBuyNetto:
                parseFloat(String(part.get('priceBuyNetto')?.value).replace(',', '.')) || 0,
            priceNetto: parseFloat(String(part.get('priceNetto')?.value).replace(',', '.')) || 0,
            priceBrutto: parseFloat(String(part.get('priceBrutto')?.value).replace(',', '.')) || 0,
        };
    }

    private toBrutto(price: number, tax: number) {
        const procent = 1 + tax / 100;

        return (price * procent).toFixed(2);
    }

    private toNetto(price: number, tax: number) {
        const procent = 1 + tax / 100;

        return (price / procent).toFixed(2);
    }

    deletePart(index: number): void {
        if (this.parts.length > 1) this.parts.removeAt(index);
    }

    addPart(addPart: RepairPart | null = null): void {
        const part: FormGroup<RepairPartFormGroup> = this.formBuilder.group({
            name: new FormControl(addPart?.name || '', {
                nonNullable: true,
                validators: [Validators.required, this.formValidators.namePattern],
            }),
            count: new FormControl(addPart?.count || 1, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(1),
                    this.formValidators.numberPattern,
                ],
            }),
            priceBuyNetto: new FormControl(addPart?.priceBuyNetto || 0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                    this.formValidators.floatPattern,
                ],
            }),
            priceNetto: new FormControl(addPart?.priceNetto || 0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                    this.formValidators.floatPattern,
                ],
            }),
            priceBrutto: new FormControl(addPart?.priceBrutto || 0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                    this.formValidators.floatPattern,
                ],
            }),
            tax: new FormControl(addPart?.tax || 23, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                    this.formValidators.floatPattern,
                ],
            }),
        });

        this.parts.push(part);
    }
}
