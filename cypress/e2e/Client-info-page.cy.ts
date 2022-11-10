describe('Client Info Page', () => {
    beforeEach(() => {
        cy.restart_db();
        cy.login(true);

        cy.visit('/dashboard/clients/info/636300b8f9b02907ef9bbfec');
        cy.url().should('include', '/dashboard/clients/info');
    });

    it('should show title', () => {
        cy.get('#page-header-left #title').contains('Informacje o kliencie');
    });

    it('should delete client', () => {
        cy.get('[data-cy=deleteClient]').click();
        cy.get('h2.mat-dialog-title').should('exist');
        cy.contains('.mat-dialog-content', 'Tadeusz Mróz');
        cy.get('[data-cy=deleteClientButton').click({ force: true });

        cy.get('table tbody tr').should('have.length', 3);
    });

    it('should change Tab', () => {
        /***** REPAIR TAB  *****/
        cy.contains('.mat-tab-label-content', 'NAPRAWY').click();

        cy.get('table tbody tr').should('have.length', 1);
        cy.get('table tbody tr td.mat-column-id')
            .first()
            .find('a')
            .contains('63639f27e5-d767c9c8-4f14e9');

        /***** VEHICLES TAB  *****/
        cy.contains('.mat-tab-label-content', 'POJAZDY').click();

        cy.get('table tbody tr').should('have.length', 1);
        cy.get('table tbody tr td.mat-column-plate').first().find('a').contains('PO 99421');
    });

    it('should edit client', () => {
        cy.get('[data-cy=editClient]').click();

        /***** EDIT FORM  *****/
        cy.get('input[formControlName="street"]').clear().type('Dworcowa 2a');
        cy.get('input[formControlName="city"]').clear().type('Wieleń');
        cy.get('input[formControlName="zipCode"]').clear().type('64-730');

        /***** SAVE FORM  *****/
        cy.get('button[data-cy=saveClientDialog]').click({ force: true });

        /***** EDITED?  *****/
        cy.contains('Dworcowa 2a');
        cy.contains('Wieleń');
        cy.contains('64-730');
    });
});
