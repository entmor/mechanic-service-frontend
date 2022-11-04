// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --

Cypress.Commands.add('login', (submit = false) => {
    cy.visit('/login');
    cy.url().should('include', '/login');

    cy.get('input[formControlName="email"]').type('bartosz@chwarscianek.pl');
    cy.get('input[formControlName="password"]').type('cypressowy123!');

    if (submit) {
        cy.get('button[data-cy="login"]')
            .click()
            .should(() => {
                expect(localStorage.getItem('auth_token')).to.be.exist;
            });

        cy.url().should('include', '/dashboard');
    }
});

Cypress.Commands.add('restart_db', () => {
    cy.request('http://localhost:3001/cypress/restart-db');
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        login(submit?: boolean): void;
        restart_db(): void;
    }
}
