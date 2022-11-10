describe('Vehicles List Page', () => {
    beforeEach(() => {
        cy.restart_db();
        cy.login(true);

        cy.visit('/dashboard/vehicles');
        cy.url().should('include', '/dashboard/vehicles');
    });

    it('should show title and subtitle', () => {
        cy.get('#page-header-left #title').contains('Lista pojazdów');
        cy.get('#page-header-left #subtitle').contains('Łącznie pojazdów w bazie: 5');
    });

    it('should add new vehicle', () => {
        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/v1/client/all**',
            query: {
                per_page: '0',
                page: '1',
                orderby: 'createdAt',
                sort: 'DESC',
                'where[name][$find]': 'Robert',
            },
        }).as('searchRobert');

        /***** OPEN ADD VEHICLE MODAL *****/
        cy.get('button[data-cy=addVehicle]').click();
        cy.get('.mat-dialog-title').should('exist');

        /***** VEHICLE FORM  *****/
        cy.get('mat-select[formControlName=type]')
            .click()
            .get('mat-option')
            .contains('Motocykl')
            .click();
        cy.get('input[formControlName="plate"]').type('P0 4222');
        cy.get('input[formControlName="vin"]').type('VSD42DWWASZC73DSW');
        cy.get('input[formControlName="mark"]').type('VW');
        cy.get('input[formControlName="model"]').type('Passat');
        cy.get('input[formControlName="year"]').clear().type('2015');
        cy.get('mat-select[formControlName=engineType]')
            .click()
            .get('mat-option')
            .contains('Benzyna')
            .click();
        cy.get('input[formControlName="engineSize"]').type('2.0');
        cy.get('input[formControlName="enginePower"]').type('133');

        /***** SEARCH CLIENT FORM  *****/
        cy.get('input[data-cy=searchClientInput]').type('Robert');
        cy.wait('@searchRobert');
        cy.get('mat-option[data-cy=searchClientMatAutocomplete]')
            .contains('Robert Lewandowski')
            .click();

        /***** SAVE VEHICLE FORM  *****/
        cy.get('button[data-cy=saveVehicleDialog]').click();

        /***** ADDED?  *****/
        cy.get('table tbody tr').should('have.length', 6);
        cy.get('#page-header-left #subtitle').contains('Łącznie pojazdów w bazie: 6');
    });

    it('should show all vehicles and delete last 2 vehicles [table multiselect test]', () => {
        cy.get('table tbody tr').should('have.length', 5);

        /***** SELECT TABLE ELEMENTS *****/
        cy.get('table tbody tr mat-checkbox')
            .filter((index) => index > 2)
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
        cy.get('table tbody tr').should('have.length', 3);
    });

    describe('should check action button', () => {
        it('should check delete button', () => {
            /***** DELETE BUTTON *****/
            cy.get('h2.mat-dialog-title').should('not.exist');

            cy.get('button[data-cy=action]:visible').eq(0).click({ force: true });
            cy.get('[data-cy=makeAction]').eq(1).click({ force: true });

            cy.get('h2.mat-dialog-title').should('exist');
            cy.contains('.mat-dialog-content', 'PO 99421');
            cy.get('[data-cy=deleteVehicleButton').click({ force: true });

            cy.get('table tbody tr').should('have.length', 4);
        });

        it('should check edit button', () => {
            /***** EDIT BUTTON *****/

            cy.get('button[data-cy=action]:visible').eq(0).click({ force: true });
            cy.get('[data-cy=makeAction]').eq(0).click({ force: true });

            cy.url().should('include', '/dashboard/vehicles/info');
            cy.contains('PO 99421');
        });
    });

    it('should change table sort', () => {
        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/v1/vehicle/all**',
            query: {
                per_page: '25',
                page: '1',
                orderby: 'plate',
                sort: 'ASC',
            },
        }).as('firstClick');

        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/v1/vehicle/**',
            query: {
                per_page: '25',
                page: '1',
                orderby: 'plate',
                sort: 'DESC',
            },
        }).as('secondClick');

        /***** CHECK BEFORE CLICK  *****/
        cy.get('table tbody tr td.mat-column-plate').first().find('a').contains('PO 99421');

        /***** FIRST CLICK  *****/
        cy.get('table thead th.cdk-column-plate').click();
        cy.wait('@firstClick');
        cy.get('table tbody tr td.mat-column-plate').first().find('a').contains('ANIA-01');

        /***** SECOND CLICK  *****/
        cy.get('table thead th.cdk-column-plate').click();
        cy.wait('@secondClick');
        cy.get('table tbody tr td.mat-column-plate').first().find('a').contains('WW04212');
    });
});
