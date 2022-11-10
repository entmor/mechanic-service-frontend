describe('Vehicles Info Page', () => {
    beforeEach(() => {
        cy.restart_db();
        cy.login(true);

        cy.visit('/dashboard/vehicles/info/63639e99e4de78d9c88d1d36');
        cy.url().should('include', '/dashboard/vehicles/info');
    });

    it('should show title', () => {
        cy.get('#page-header-left #title').contains('Informaje o pojeździe:');
    });

    it('should delete vehicle', () => {
        cy.get('[data-cy=deleteVehicle]').click();
        cy.get('h2.mat-dialog-title').should('exist');
        cy.contains('.mat-dialog-content', 'PO 99421');
        cy.get('[data-cy=deleteVehicleButton').click({ force: true });

        cy.get('table tbody tr').should('have.length', 4);
    });

    it('should change Tab', () => {
        cy.contains('.mat-tab-label-content', 'NAPRAWY').click();

        cy.get('table tbody tr').should('have.length', 1);
        cy.get('table tbody tr td.mat-column-id')
            .first()
            .find('a')
            .contains('63639f27e5-d767c9c8-4f14e9');
    });

    it('should edit vehicle', () => {
        cy.get('[data-cy=editVehicle]').click();

        /***** EDIT FORM  *****/
        cy.get('input[formControlName="vin"]').clear().type('ZW41249FFDSFSD42S');
        cy.get('mat-select[formControlName=engineType]')
            .click()
            .get('mat-option')
            .contains('Benzyna + LPG')
            .click();

        /***** SAVE FORM  *****/
        cy.get('button[data-cy=editVehicleDialog]').click({ force: true });

        /***** EDITED?  *****/
        cy.contains('ZW41249FFDSFSD42S');
        cy.contains('Benzyna + LPG');
    });
});
