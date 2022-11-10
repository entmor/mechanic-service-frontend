describe('Clients List Page', () => {
    beforeEach(() => {
        cy.restart_db();
        cy.login(true);

        cy.visit('/dashboard/clients');
        cy.url().should('include', '/dashboard/clients');
    });

    it('should show title and subtitle', () => {
        cy.get('#page-header-left #title').contains('Lista klientów');
        cy.get('#page-header-left #subtitle').contains('Łącznie liczba klientów: 4');
    });

    it('should add new client', () => {
        cy.get('table tbody tr').should('have.length', 4);

        /***** OPEN ADD CLIENT MODAL *****/
        cy.get('button[data-cy=addClient]').click();
        cy.get('.mat-dialog-title').should('exist');

        /***** CLIENT FORM  *****/
        cy.get('input[formControlName="name"]').type('Wojciech Raczkowski');
        cy.get('input[formControlName="phone"]').type('723504867');
        cy.get('input[formControlName="email"]').type('w.raczkowski@entmor.pl');
        cy.get('input[formControlName="street"]').type('Poznańska 442');
        cy.get('input[formControlName="city"]').type('Warszawa');
        cy.get('input[formControlName="zipCode"]').type('22-222');
        cy.get('mat-radio-group[formControlName=gender]')
            .click()
            .get('mat-radio-button[value=female]')
            .click();

        /***** SAVE CLIENT FORM  *****/
        cy.get('button[data-cy=saveClientDialog]').click();

        /***** ADDED?  *****/
        cy.get('table tbody tr').should('have.length', 5);
        cy.get('#page-header-left #subtitle').contains('Łącznie liczba klientów: 5');
    });

    it('should show all clients and delete last 2 clients [table multiselect test]', () => {
        cy.get('table tbody tr').should('have.length', 4);

        /***** SELECT TABLE ELEMENTS *****/
        cy.get('table tbody tr mat-checkbox')
            .filter((index) => index > 1)
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
        cy.get('table tbody tr').should('have.length', 2);
    });

    describe('should check action button', () => {
        it('should check delete button', () => {
            /***** DELETE BUTTON *****/
            cy.get('h2.mat-dialog-title').should('not.exist');

            cy.get('button[data-cy=action]:visible').eq(0).click({ force: true });
            cy.get('[data-cy=makeAction]').eq(3).click({ force: true });

            cy.get('h2.mat-dialog-title').should('exist');
            cy.contains('.mat-dialog-content', 'Entmor.studio');
            cy.get('[data-cy=deleteClientButton').click({ force: true });

            cy.get('table tbody tr').should('have.length', 3);
        });

        it('should check edit button', () => {
            /***** EDIT BUTTON *****/

            cy.get('button[data-cy=action]:visible').eq(0).click({ force: true });
            cy.get('[data-cy=makeAction]').eq(0).click({ force: true });

            cy.url().should('include', '/dashboard/clients/info');
            cy.contains('Entmor.studio');
        });

        it('should check vehicle button', () => {
            /***** VEHICLES BUTTON *****/

            cy.get('button[data-cy=action]:visible').eq(0).click({ force: true });
            cy.get('[data-cy=makeAction]').eq(1).click({ force: true });

            cy.url()
                .should('include', '/dashboard/clients/info')
                .should('include', '?tab=vehicles');

            cy.get('.mat-tab-label-active .mat-tab-label-content').should('have.text', 'POJAZDY');
        });

        it('should check repair button', () => {
            /***** VEHICLES BUTTON *****/

            cy.get('button[data-cy=action]:visible').eq(0).click({ force: true });
            cy.get('[data-cy=makeAction]').eq(2).click({ force: true });

            cy.url().should('include', '/dashboard/clients/info').should('include', '?tab=repairs');

            cy.get('.mat-tab-label-active .mat-tab-label-content').should('have.text', 'NAPRAWY');
        });
    });

    it('should change table sort', () => {
        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/v1/client/all**',
            query: {
                per_page: '25',
                page: '1',
                orderby: 'name',
                sort: 'ASC',
            },
        }).as('firstClick');

        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/v1/client/**',
            query: {
                per_page: '25',
                page: '1',
                orderby: 'name',
                sort: 'DESC',
            },
        }).as('secondClick');

        /***** CHECK BEFORE CLICK  *****/
        cy.get('table tbody tr td.mat-column-name').first().find('a').contains('Entmor.studio');

        /***** FIRST CLICK  *****/
        cy.get('table thead th.cdk-column-name').click();
        cy.wait('@firstClick');
        cy.get('table tbody tr td.mat-column-name').first().find('a').contains('Ariel Dekor');

        /***** SECOND CLICK  *****/
        cy.get('table thead th.cdk-column-name').click();
        cy.wait('@secondClick');
        cy.get('table tbody tr td.mat-column-name').first().find('a').contains('Tadeusz Mróz');
    });
});
