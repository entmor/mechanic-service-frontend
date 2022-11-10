describe('Repair Add Page', () => {
    beforeEach(() => {
        cy.restart_db();
        cy.login(true);

        cy.visit('/dashboard/repairs/add');
        cy.url().should('include', '/dashboard/repairs/add');
    });

    it('should show title', () => {
        cy.get('#page-header-left #title').contains('Dodaj naprawę', { matchCase: false });
    });

    it('should add repair', () => {
        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/v1/repair/**',
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
        cy.get('[data-cy=searchVehicle]').type('ANIA');
        cy.wait('@searchPlate');
        cy.get('mat-option[data-cy=searchVehicleMatAutocomplete]').contains('ANIA-01').click();

        /***** ALIAS  *****/
        cy.get('.costs-row').last().as('lastPart');
        cy.get('@lastPart').find('[formControlName=name]').as('name');
        cy.get('@lastPart').find('[formControlName=priceBuyNetto]').as('priceBuyNetto');

        cy.get('@name').clear().type('Wymiana oleju');
        cy.get('@priceBuyNetto').clear().type('125.15');

        /***** SAVE FORM  *****/
        cy.get('button[data-cy=saveRepair]').click({ force: true });
        cy.wait('@save');

        /***** SAVED ?  *****/
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
        cy.get('#summary-costs .summary-cost-total-value').should('have.text', ' 153.93 PLN ');
    });
});
