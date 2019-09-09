const URL = 'http://localhost:3001/api/v1';

describe('Admin Invite User', function() {
  it('Invites User', function() {
    cy.server();
    cy.visit('http://localhost:3000');
    
    cy.get('input#email').type('marcelo.lpinto90@gmail.com');
    cy.get('input#password').type('marcelo123');
    
    cy.route(`${URL}/users*`).as('get-users')
    cy.get('form').submit();
    
    cy.wait('@get-users');

    cy.url().should('eq', 'http://localhost:3000/users');

    cy.get('button#menu').click();
    cy.wait(100);
    cy.get('li#invite').click();
    
    cy.url().should('eq', 'http://localhost:3000/invite');

    cy.route('POST', `${URL}/invite-user*`).as('invite-user')
    cy.get('input#email').clear().type('new-client@toptal.com');
    cy.get('button#invite-user').click();

    cy.wait('@invite-user').then(xhr => {
      const newUserId = xhr.response.body.data._id;
      expect(201).to.equal(xhr.status);
      
      cy.get('button#back').click();
      cy.wait(100);
      cy.url().should('eq', 'http://localhost:3000/users');

      cy.get(`span#delete-${newUserId}`).click();
      cy.wait(100);

      cy.route('DELETE', `${URL}/users/*`).as('delete-user')

      cy.get('button#confirm').click();

      cy.wait('@delete-user').then(xhr => {
        expect(200).to.equal(xhr.status);
      });
    })

  })
})