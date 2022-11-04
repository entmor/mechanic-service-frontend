describe('Users Page', () => {
    before(() => {
        cy.restart_db();
    });

    beforeEach(() => {
        cy.login(true);
    });

    xit('should show all users', () => {
        cy.visit('/dashboard/users');
        cy.url().should('include', '/dashboard/users');

        cy.get('table tbody tr').should('have.length', 1);
    });

    it('should add new user', () => {
        cy.visit('/dashboard/users');

        cy.url().should('include', '/dashboard/users');

        cy.get('button[data-cy=addUser]').click();
        cy.contains('.mat-dialog-title', 'Dodaj nowego użytkownika');

        cy.get('mat-select[formControlName=role]')
            .click()
            .get('mat-option')
            .contains('Administrator')
            .click();

        cy.get('input[formControlName="firstname"]').type('Andrzej');
        cy.get('input[formControlName="lastname"]').type('Chwarścianek');
        cy.get('input[formControlName="email"]').type('chwarscianek@gmail.com');

        cy.get('input[formControlName="password"]').type('cypressTest');
        cy.get('input[formControlName="password_repeat"]').type('chwarscianek@gmail.com');

        cy.get('button[data-cy=saveUser]').should('be.disabled');
        cy.get('input[formControlName="password_repeat"]').clear().type('cypressTest');
        cy.get('button[data-cy=saveUser]').should('be.not.disabled');

        cy.get('button[data-cy=saveUser]').click();
        cy.get('table tbody tr').should('have.length', 2);

        cy.get('table tbody tr mat-checkbox').eq(0).click({ multiple: true });
    });

    // afterEach(() => {
    //     cy.get('button').contains('Wyloguj się').click();
    // });
});
