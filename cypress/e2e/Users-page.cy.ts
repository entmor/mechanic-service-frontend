describe('Users Page', () => {
    beforeEach(() => {
        cy.restart_db();
        cy.login(true);

        cy.visit('/dashboard/users');
        cy.url().should('include', '/dashboard/users');
    });

    it('should add new user', () => {
        /***** OPEN ADD USER MODAL *****/
        cy.get('button[data-cy=addUser]').click();
        cy.contains('.mat-dialog-title', 'Dodaj nowego użytkownika');

        /***** USER FORM  *****/
        cy.get('mat-select[formControlName=role]')
            .click()
            .get('mat-option')
            .contains('Administrator')
            .click();
        cy.get('input[formControlName="firstname"]').type('Andrzej');
        cy.get('input[formControlName="lastname"]').type('Chwarścianek');
        cy.get('input[formControlName="email"]').type('chwarscianek@gmail.com');

        /***** SET WRONG REPEATED PASSWORD AND CHECK IF SHOW ERROR *****/
        cy.get('[data-cy=password_repeat]').get('mat-error').should('not.exist');
        cy.get('input[formControlName="password"]').type('cypressTest');
        cy.get('input[formControlName="password_repeat"]').type('chwarscianek@gmail.com');
        cy.get('input[formControlName="password"]').click();
        cy.get('[data-cy=password_repeat]').get('mat-error').should('exist');
        /***** TYPE RIGHT PASSWORD *****/
        cy.get('input[formControlName="password_repeat"]').clear().type('cypressTest');

        /***** SAVE USER FORM  *****/
        cy.get('button[data-cy=saveUser]').click();

        /***** ADDED?  *****/
        cy.get('table tbody tr').should('have.length', 4);
    });

    it('should show all users and delete last 2 users [table multiselect test]', () => {
        cy.get('table tbody tr').should('have.length', 3);

        /***** SELECT TABLE ELEMENTS *****/
        cy.get('table tbody tr mat-checkbox')
            .filter((index) => index > 0)
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
        cy.get('table tbody tr').should('have.length', 1);
    });

    it('should logout after delete himself', () => {
        cy.get('button[data-cy=action]:visible').eq(0).click({ force: true });
        cy.get('[data-cy=makeAction]').eq(1).click({ force: true });
        cy.get('[data-cy=deleteUserButton').click({ force: true });

        cy.url().should('include', '/login');
    });

    describe('should check action button', () => {
        it('should check delete button', () => {
            /***** DELETE BUTTON *****/
            cy.get('h2.mat-dialog-title').should('not.exist');

            cy.get('button[data-cy=action]:visible').eq(1).click({ force: true });
            cy.get('[data-cy=makeAction]').eq(1).click({ force: true });

            cy.get('h2.mat-dialog-title').should('exist');
            cy.get('[data-cy=deleteUserButton').click({ force: true });

            cy.get('table tbody tr').should('have.length', 2);
        });

        it('should check edit button', () => {
            /***** EDIT BUTTON *****/
            cy.get('h2.mat-dialog-title').should('not.exist');

            cy.get('button[data-cy=action]:visible').eq(0).click({ force: true });
            cy.get('[data-cy=makeAction]').eq(0).click({ force: true });

            cy.get('h2.mat-dialog-title').should('be.visible');
        });
    });

    it.only('should change table sort', () => {
        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/v1/user/all**',
            query: {
                page: '1',
                per_page: '25',
                orderby: 'firstname',
                sort: 'DESC',
            },
        }).as('waitForDarek');
        cy.get('table thead th.cdk-column-firstname').click().click();
        cy.wait('@waitForDarek');
        cy.get('table tbody tr td.mat-column-firstname').first().contains('Darek');
    });
});
