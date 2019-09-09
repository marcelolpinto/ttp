const URL = 'http://localhost:3001/api/v1';

describe('Admin Crud Users', function() {
  it('CRUD Users', function() {
    cy.server();
    cy.visit('http://localhost:3000');
    
    cy.get('input#email').type('marcelo.lpinto90@gmail.com');
    cy.get('input#password').type('marcelo123');
    
    cy.route(`${URL}/users*`).as('get-users');
    cy.get('form').submit();
    
    cy.wait('@get-users');

    cy.url().should('eq', 'http://localhost:3000/users');

    cy.get('button#add-user').click();

    cy.get('input#name').type('DUPLICATE EMAIL');
    cy.get('input#email').type('realtor@toptal.com');
    cy.get('div#select-role').click();
    cy.get('li[data-value=realtor]').click();
    cy.get('input#password').type('realtor123');
    cy.get('input#confirm_password').type('realtor123');

    cy.route('POST', `${URL}/users`).as('create-user')
    cy.get('form').submit();
    
    cy.wait('@create-user').then(xhr => {
      expect(422).to.equal(xhr.status);
    })

    cy.get('input#name').clear().type('NEW REALTOR');
    cy.get('input#email').clear().type('new-realtor@toptal.com');

    cy.get('form').submit();
    
    cy.wait('@create-user').then(xhr => {
      const newUserId = xhr.response.body.data._id;
      expect(201).to.equal(xhr.status);
      
      cy.wait(1000);
      cy.url().should('eq', 'http://localhost:3000/users');

      cy.get(`span#edit-${newUserId}`).click();

      cy.wait(100);
      cy.url().should('eq', `http://localhost:3000/users/${newUserId}/edit`);

      // EDIT USER
      cy.route('PUT', `${URL}/users/*`).as('update-password')

      cy.get('input#password').type('client123');
      cy.get('input#confirm_password').type('client123');
      cy.get('button#change-password').click();

      cy.wait('@update-password').then(xhr => {
        expect(200).to.equal(xhr.status);
      })

      cy.url().should('eq', `http://localhost:3000/users`);      
      
      cy.get(`span#delete-${newUserId}`).click();
      cy.wait(100);

      cy.route('DELETE', `${URL}/users/*`).as('delete-user')

      cy.get('button#confirm').click();

      cy.wait('@delete-user').then(xhr => {
        expect(200).to.equal(xhr.status);
      });
    });

  })
})