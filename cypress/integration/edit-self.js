const URL = 'http://localhost:3001/api/v1';

describe('Edit Self', function() {
  it('Edit Self', function() {
    cy.server();
    cy.visit('http://localhost:3000');
    
    cy.get('input#email').type('client@toptal.com');
    cy.get('input#password').type('client123');
    
    cy.route(`${URL}/properties*`).as('get-properties');
    cy.get('form').submit();
    
    cy.wait('@get-properties');

    cy.url().should('eq', 'http://localhost:3000/properties');

    cy.get('button#menu').click();
    cy.wait(100);
    cy.get('li#settings').click();
    
    cy.url().should('eq', 'http://localhost:3000/settings');


    cy.route('PUT', `${URL}/users/*`).as('edit-self')
    cy.get('input#name').clear().type(`CLIENT ${Math.ceil(Math.random() * 20)}`);
    cy.get('button#save-settings').click();

    cy.wait('@edit-self').then(xhr => {
      expect(200).to.equal(xhr.status);
    });


    cy.route('POST', `${URL}/users/*/change-password`).as('update-password')
    cy.get('input#old_password').type('clientX');
    cy.get('input#password').type('client123');
    cy.get('input#confirm_password').type('client123');
    cy.get('button#change-password').click();

    cy.wait('@update-password').then(xhr => {
      expect(422).to.equal(xhr.status);
    })

    cy.get('input#old_password').clear().type('client123');
    cy.get('button#change-password').click();

    cy.wait('@update-password').then(xhr => {
      expect(200).to.equal(xhr.status);
    })
  })
})