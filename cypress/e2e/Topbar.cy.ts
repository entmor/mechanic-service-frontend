describe('Topbar', () => {
    beforeEach(() => {
        cy.restart_db();
        cy.login(true);

        cy.visit('/dashboard');
        cy.url().should('include', '/dashboard');
    });

    it('should show name', () => {
        cy.get('#topbar-name').should('have.text', 'Witaj,Bartosz!');
    });

    it('should logout [button]', () => {
        cy.get('[data-cy=logout]').click();
        cy.url().should('include', '/login');
    });

    it('should toggle menu', async () => {
        cy.get('[data-cy=dashboardSidebar]').as('sidebar');
        cy.get('[data-cy=toggleMenu]').as('menuButton');

        cy.get('@sidebar')
            .invoke('position')
            .then((el) => {
                expect(el.left).to.deep.eq(0);
            });
        cy.get('@menuButton').click();

        cy.wait(300);

        cy.get('@sidebar')
            .invoke('position')
            .then((el) => {
                expect(el.left).to.deep.eq(-275);
            });

        cy.get('@menuButton').click();

        cy.wait(300);

        cy.get('@sidebar')
            .invoke('position')
            .then((el) => {
                expect(el.left).to.deep.eq(0);
            });
    });
});
