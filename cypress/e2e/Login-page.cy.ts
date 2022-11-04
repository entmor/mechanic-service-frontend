describe('Login page', () => {
    before(() => {
        cy.restart_db();
    });

    it('should redirect to login', () => {
        cy.visit('/dashboard');

        cy.url().should('include', '/login');
    });

    it('should not login and show error message', () => {
        cy.visit('/login');

        cy.get('input[formControlName="email"]').type('badLogin@chwarscianek.pl');
        cy.get('input[formControlName="password"]').type('badpassword');
        cy.get('button[data-cy="login"]').click();

        cy.contains('Dane są niepoprawne.');
    });

    it('should login and go to Dashboard', () => {
        cy.login();
        cy.get('button[data-cy="login"]')
            .click()
            .should(() => {
                expect(localStorage.getItem('auth_token')).to.be.exist;
            });

        cy.url().should('include', '/dashboard');
        cy.contains('#page-header-left h1#title', 'Dashboard');
    });
});
