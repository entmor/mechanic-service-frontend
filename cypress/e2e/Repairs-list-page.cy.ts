describe('Repairs List Page', () => {
    beforeEach(() => {
        cy.restart_db();
        cy.login(true);

        cy.visit('/dashboard/repairs');
        cy.url().should('include', '/dashboard/repairs');
    });

    it('should show title and subtitle', () => {
        cy.get('#page-header-left #title').contains('Lista napraw');
        cy.get('#page-header-left #subtitle').contains('Łącznie napraw w bazie: 7');
    });

    it('should show all repairs and delete last 2 repais [table multiselect test]', () => {
        cy.get('table tbody tr').should('have.length', 7);

        /***** SELECT TABLE ELEMENTS *****/
        cy.get('table tbody tr mat-checkbox')
            .filter((index) => index > 4)
            .click({ multiple: true });

        /***** SELECT TABLE ACTIONS *****/
        cy.get('mat-select[data-cy=selectedTableAction]')
            .click()
            .get('mat-option[ng-reflect-value=delete]')
            .click();

        /***** MAKE TABLE ELEMENTS *****/
        cy.get('h2.mat-dialog-title').should('not.exist');
        cy.get('button[data-cy=tableAction]').click({ force: true });
        cy.get('h2.mat-dialog-title').should('exist');

        /***** CONFIRM ACTIONs *****/
        cy.get('button[data-cy=makeMultiAction]').click();

        /***** DELETED? *****/
        cy.get('table tbody tr').should('have.length', 5);
    });

    describe('should check action button', () => {
        it('should check delete button', () => {
            /***** DELETE BUTTON *****/
            cy.get('h2.mat-dialog-title').should('not.exist');

            cy.get('button[data-cy=action]:visible').eq(0).click('center', { force: true });
            cy.get('[data-cy=makeAction]').eq(3).click('center', { force: true });

            cy.get('h2.mat-dialog-title').should('exist');
            cy.get('[data-cy=deleteRepairtButton').click({ force: true });

            cy.get('table tbody tr').should('have.length', 6);
        });

        it('should check edit button', () => {
            /***** EDIT BUTTON *****/

            cy.get('button[data-cy=action]:visible').eq(2).trigger('click', { force: true });
            cy.get('[data-cy=makeAction]').should('be.visible').eq(0).click({ force: true });

            cy.url().should('include', '/dashboard/repairs/info');
            cy.contains('INFORMACJE O NAPRAWIE', { matchCase: false });
        });

        it('should check vehicle button', () => {
            /***** VEHICLES BUTTON *****/

            cy.get('button[data-cy=action]:visible').eq(0).click({ force: true });
            cy.get('[data-cy=makeAction]').eq(1).click({ force: true });

            cy.url().should('include', '/dashboard/vehicles/info');

            cy.get('.mat-tab-label-active .mat-tab-label-content').should('have.text', 'DANE');

            cy.contains('VDSADASD234SDAF33');
        });

        it('should check client button', () => {
            /***** Client BUTTON *****/

            cy.get('button[data-cy=action]:visible').eq(0).click({ force: true });
            cy.get('[data-cy=makeAction]').eq(2).click({ force: true });

            cy.url().should('include', '/dashboard/clients/info');

            cy.get('.mat-tab-label-active .mat-tab-label-content').should('have.text', 'DANE');

            cy.contains('Tadeusz Mróz');
        });
    });

    it('should change table sort', () => {
        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/v1/repair/all**',
            query: {
                per_page: '25',
                page: '1',
                orderby: 'status',
                sort: 'ASC',
            },
        }).as('firstClick');

        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/v1/repair/**',
            query: {
                per_page: '25',
                page: '1',
                orderby: 'status',
                sort: 'DESC',
            },
        }).as('secondClick');

        /***** CHECK BEFORE CLICK  *****/
        cy.get('table tbody tr td.mat-column-status').first().contains('Zrealizowany');

        /***** FIRST CLICK  *****/
        cy.get('table thead th.cdk-column-status').click();
        cy.wait('@firstClick');
        cy.get('table tbody tr td.mat-column-status').first().contains('Zrealizowany');

        /***** SECOND CLICK  *****/
        cy.get('table thead th.cdk-column-status').click();
        cy.wait('@secondClick');
        cy.get('table tbody tr td.mat-column-status').first().contains('Wstrzymany');
    });
});
