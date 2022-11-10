import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'engineType',
})
export class EngineTypePipe implements PipeTransform {
    private engineTypes = {
        PETROL: 'Benzyna',
        DIESEL: 'Diesel',
        PETROL_LPG: 'Benzyna + LPG',
        PETROL_CNG: 'Benzyna + CNG',
        HYBRID: 'Hybryda',
        HYDROGEN: 'Wodór',
        ELECTRIC: 'Elekryczny',
        ETANOL: 'Etanol',
    };

    transform(value: string | undefined): string {
        // @ts-ignore
        return value ? this.engineTypes[value] : 'none';
    }
}
