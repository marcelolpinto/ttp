const URL = 'http://localhost:3001/api/v1';

const addresses = [
  'rua estado de israel 847',
  'rua borges lagoa 400',
  'rua doutor paschoal imperatriz 114',
  'avenida corifeu de azevedo 5680',
  'rua joao scatama 200',
  'avenida paulista 1000',
];

describe('Realtor CRUD Properties', function() {
  it('CRUDs Properties', function(done) {
    cy.server();
    cy.visit('http://localhost:3000');
    
    cy.get('input#email').type('realtor@toptal.com');
    cy.get('input#password').type('realtor123');
    
    cy.route(`${URL}/properties*`).as('get-properties')
    cy.get('form').submit();
    
    cy.wait('@get-properties');

    cy.url().should('eq', 'http://localhost:3000/properties');
    cy.wait(200);
    cy.get('button#create').click();
    
    cy.url().should('eq', 'http://localhost:3000/properties/new');

    cy.route('POST', `${URL}/properties*`).as('create-property')

    cy.get('input#name').type(`Test house ${Math.floor(Math.random()*1000)}`);
    cy.get('textarea#description').type('This is a beautiful house with two floors.');
    cy.get('input.location-search-input').type('Avenida corifeu de azevedo');
    cy.get('input.location-search-input').type('{enter}{downarrow}{enter}', { delay: 250 });
    cy.get('input#bedrooms').type(Math.ceil(Math.random() * 5));
    cy.get('input#area').type(Math.floor(Math.random() * 120) + 30);
    cy.get('input#price').type(Math.floor(Math.random() * 2E5) + 15000);

    cy.get('button#submit').click()

    cy.wait('@create-property').then(xhr => {
      expect(201).to.equal(xhr.status);
      const newPropertyId = xhr.response.body.data._id;
      
      cy.wait(100);
      cy.url().should('eq', 'http://localhost:3000/properties');
      
      cy.get(`span#edit-${newPropertyId}`).click();
      
      cy.wait(100);
      cy.url().should('eq', `http://localhost:3000/properties/${newPropertyId}/edit`);
      
      cy.route('PUT', `${URL}/properties/*`).as('edit-property')
      cy.get('input[type=checkbox]').click();
      cy.get('button#submit').click();
      
      cy.wait('@edit-property').then(xhr => {
        expect(200).to.equal(xhr.status);
      })

      cy.url().should('eq', 'http://localhost:3000/properties');
      cy.get(`span#delete-${newPropertyId}`).click();

      cy.wait(100);
      cy.route('DELETE', `${URL}/properties/*`).as('delete-property')
      cy.get('button#confirm').click();

      cy.wait('@delete-property').then(xhr => {
        expect(200).to.equal(xhr.status);
      })

      done();
    })

  })
})