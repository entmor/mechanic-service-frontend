describe('Repair Info Page', () => {
    beforeEach(() => {
        cy.restart_db();
        cy.login(true);

        cy.visit('/dashboard/repairs/info/63639f27e5d767c9c84f14e9');
        cy.url().should('include', '/dashboard/repairs/info');
    });

    it('should show title', () => {
        cy.get('#page-header-left #title').contains('Informacje o naprawie', { matchCase: false });
    });

    it.skip('should delete client', () => {
        cy.get('[data-cy=deleteClient]').click();
        cy.get('h2.mat-dialog-title').should('exist');
        cy.contains('.mat-dialog-content', 'Tadeusz Mróz');
        cy.get('[data-cy=deleteClientButton').click({ force: true });

        cy.get('table tbody tr').should('have.length', 3);
    });

    it.only('should edit repair', () => {
        cy.intercept({
            method: 'PUT',
            url: 'http://localhost:3000/v1/repair/',
        }).as('save');

        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/v1/vehicle/all**',
            query: {
                per_page: '0',
                page: '1',
                orderby: 'createdAt',
                sort: 'DESC',
                'where[plate][$find]': 'ANIA',
            },
        }).as('searchPlate');

        /***** EDIT FORM  *****/
        /***** INFO FORM  *****/

        cy.get('mat-select[formControlName=type]')
            .click()
            .get('mat-option')
            .contains('Serwis')
            .click();
        cy.get('mat-select[formControlName=status]')
            .click()
            .get('mat-option')
            .contains('Wstrzymany')
            .click();

        cy.get('input[formControlName="mileage"]').clear().type('25225');

        /***** VEHICLE FORM  *****/
        cy.get('[data-cy=removeSelectedVehicle]').click({ force: true });
        cy.get('[data-cy=searchVehicle]').type('ANIA');
        cy.wait('@searchPlate');
        cy.get('mat-option[data-cy=searchVehicleMatAutocomplete]').contains('ANIA-01').click();

        cy.get('[data-cy=deletePart]').last().click();
        cy.get('[data-cy=addNewPart]').click();

        /***** ALIAS  *****/
        cy.get('.costs-row').last().as('lastPart');
        cy.get('@lastPart').find('[formControlName=name]').as('name');
        cy.get('@lastPart').find('[formControlName=count]').as('count');
        cy.get('@lastPart').find('[formControlName=tax]').as('tax');
        cy.get('@lastPart').find('[formControlName=priceBuyNetto]').as('priceBuyNetto');
        cy.get('@lastPart').find('[formControlName=priceNetto]').as('priceNetto');
        cy.get('@lastPart').find('[formControlName=priceBrutto]').as('priceBrutto');
        cy.get('#summary-costs .summary-cost-total-value').as('total');

        cy.get('@name').clear().type('Wymiana oleju');
        cy.get('@priceBuyNetto').clear().type('125.15');

        /***** SAVE FORM  *****/
        cy.get('button[data-cy=saveRepair]').click({ force: true });

        cy.wait('@save');
        cy.reload();

        /***** EDITED?  *****/
        cy.get('mat-select[formControlName=type] .mat-select-min-line').should(
            'have.text',
            'Serwis'
        );
        cy.get('mat-select[formControlName=status] .mat-select-min-line').should(
            'have.text',
            'Wstrzymany'
        );
        cy.get('input[formControlName="mileage"]').should('have.value', '25225');

        cy.contains('Rejestracja: ANIA-01');
        cy.get('@name').should('have.value', 'Wymiana oleju');
        cy.get('@priceBuyNetto').should('have.value', '125.15');
        cy.get('@total').should('have.text', ' 1382.70 PLN ');
    });

    it('should remove vehicle and select new one', () => {
        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/v1/vehicle/all**',
            query: {
                per_page: '0',
                page: '1',
                orderby: 'createdAt',
                sort: 'DESC',
                'where[plate][$find]': 'ANIA',
            },
        }).as('searchPlate');

        cy.get('[data-cy=removeSelectedVehicle]').click({ force: true });
        cy.get('[data-cy=searchVehicle]').type('ANIA');
        cy.wait('@searchPlate');
        cy.get('mat-option[data-cy=searchVehicleMatAutocomplete]').contains('ANIA-01').click();
        cy.contains('Rejestracja: ANIA-01');
    });

    describe('Cost check', () => {
        it('should add 2 new costs', () => {
            cy.get('.costs-row').should('have.been', 2);
            cy.get('[data-cy=addNewPart]').click().click();
            cy.get('.costs-row').should('have.been', 4);
        });

        it('should remove last cost', () => {
            cy.get('.costs-row').should('have.been', 2);
            cy.get('[data-cy=deletePart]').last().click();
            cy.get('.costs-row').should('have.been', 1);
        });

        it('should always 1 cost stay', () => {
            cy.get('.costs-row').should('have.been', 2);
            cy.get('[data-cy=deletePart]').click({ multiple: true });

            cy.get('.costs-row').should('have.been', 1);
            cy.get('[data-cy=deletePart]').click();
            cy.get('[data-cy=deletePart]').click();
            cy.get('[data-cy=deletePart]').click();
            cy.get('[data-cy=deletePart]').click();

            cy.get('.costs-row').should('have.been', 1);
        });

        it('should generate prices', () => {
            /***** ADD PART  *****/
            cy.get('[data-cy=addNewPart]').click();

            /***** ALIAS  *****/
            cy.get('.costs-row').last().as('lastPart');
            cy.get('@lastPart').find('[formControlName=count]').as('count');
            cy.get('@lastPart').find('[formControlName=tax]').as('tax');
            cy.get('@lastPart').find('[formControlName=priceBuyNetto]').as('priceBuyNetto');
            cy.get('@lastPart').find('[formControlName=priceNetto]').as('priceNetto');
            cy.get('@lastPart').find('[formControlName=priceBrutto]').as('priceBrutto');

            /***** priceBuyNetto  *****/
            cy.get('@priceBuyNetto').clear().type('100');
            cy.get('@priceNetto').should('have.value', '100.00');
            cy.get('@priceBrutto').should('have.value', '123.00');

            /***** priceNetto  *****/
            cy.get('@priceNetto').clear().type('200');
            cy.get('@priceBuyNetto').should('have.value', '200.00');
            cy.get('@priceBrutto').should('have.value', '246.00');

            /***** priceBrutto  *****/
            cy.get('@priceBrutto').clear().type('369');
            cy.get('@priceBuyNetto').should('have.value', '300.00');
            cy.get('@priceNetto').should('have.value', '300.00');

            /***** count  *****/
            cy.get('@priceBuyNetto').clear().type('100');
            cy.get('@count').clear().type('10');
            cy.get('@priceNetto').should('have.value', '1000.00');
            cy.get('@priceBrutto').should('have.value', '1230.00');

            /***** tax  *****/
            cy.get('@priceBuyNetto').clear().type('100');
            cy.get('@tax').clear().type('10');
            cy.get('@priceNetto').should('have.value', '1000.00');
            cy.get('@priceBrutto').should('have.value', '1100.00');
        });
    });

    describe('Summary Costs', () => {
        beforeEach(() => {
            /***** ALIAS  *****/
            cy.get('.costs-row').last().as('lastPart');
            cy.get('@lastPart').find('[formControlName=count]').as('countPart');
            cy.get('@lastPart').find('[formControlName=tax]').as('tax');
            cy.get('@lastPart').find('[formControlName=priceBuyNetto]').as('priceBuyNetto');
            cy.get('@lastPart').find('[formControlName=priceNetto]').as('priceNetto');
            cy.get('@lastPart').find('[formControlName=priceBrutto]').as('priceBrutto');

            cy.get('#summary-costs .summary-cost-row .col-info-right').as('infoSummaryRow');
            cy.get('@infoSummaryRow').eq(0).as('count');
            cy.get('@infoSummaryRow').eq(1).as('nettoAll');
            cy.get('@infoSummaryRow').eq(2).as('taxAll');
            cy.get('@infoSummaryRow').eq(3).as('bruttoAll');
            cy.get('#summary-costs .summary-cost-total-value').as('total');
        });

        it('should show costs info', () => {
            cy.get('@count').should('have.text', '2 szt.');
            cy.get('@nettoAll').should('have.text', '2499.00 PLN');
            cy.get('@taxAll').should('have.text', '574.77 PLN');
            cy.get('@bruttoAll').should('have.text', '3073.77 PLN');
            cy.get('@total').should('have.text', ' 3073.77 PLN ');
        });

        it('should show right costs after changes', () => {
            cy.get('@priceBuyNetto').clear().type('235.50');
            cy.get('@countPart').clear().type('5');

            cy.get('@count').should('have.text', '6 szt.');
            cy.get('@nettoAll').should('have.text', '2176.50 PLN');
            cy.get('@taxAll').should('have.text', '500.60 PLN');
            cy.get('@bruttoAll').should('have.text', '2677.10 PLN');
            cy.get('@total').should('have.text', ' 2677.10 PLN ');
        });
    });
});
