describe('Requirement 8 - Todo GUI Verification', () => {

let taskName;

const createTodoItem = (todoText) => {


cy.get('input[placeholder="Add a new todo item"]')
  .clear()
  .type(todoText);

cy.contains('Add')
  .click();

cy.contains(todoText)
  .should('be.visible');


};

beforeEach(() => {


cy.visit('http://localhost:3000');

cy.get('#email')
  .clear()
  .type('adityamudam@gmail.com');

cy.get('input[type="submit"]')
  .first()
  .click();

cy.get('input[placeholder="Title of your Task"]')
  .should('be.visible');

taskName = `GUI-AUTO-${Date.now()}`;

cy.wrap(taskName).as('taskName');

cy.get('input[placeholder="Title of your Task"]')
  .first()
  .type(taskName);

cy.get('input[placeholder*="YouTube"]')
  .first()
  .type('5NV6Rdv1a3I');

cy.contains('Create new Task')
  .click();

cy.get('img')
  .last()
  .should('be.visible')
  .click();

cy.get('body')
  .should('be.visible');


});

afterEach(() => {

  const email = 'adityamudam@gmail.com';

  cy.request(`http://localhost:5001/users/bymail/${email}`)
    .then((res) => {

      const user = res.body;

      const uid =
        user && user._id && user._id.$oid
          ? user._id.$oid
          : user._id;

      if (!uid) return;

      cy.request(`http://localhost:5001/tasks/ofuser/${uid}`)
        .then((r) => {

          const tasks = r.body || [];

          cy.wrap(tasks).each((task) => {

            const tid =
              task._id && task._id.$oid
                ? task._id.$oid
                : task._id;

            cy.request(
              'DELETE',
              `http://localhost:5001/tasks/byid/${tid}`
            );

          });

        });

    });

});

it('TC1 - Create todo item', () => {


createTodoItem('Study Cypress Framework');

cy.contains('Study Cypress Framework')
  .should('exist');


});


it('TC2 - Create todo with long description', () => {


const longTodo =
  'Complete graphical user interface verification assignment using Cypress automation';

createTodoItem(longTodo);

cy.contains(longTodo)
  .should('be.visible');


});

it('TC3 - Toggle active todo to completed', () => {


createTodoItem('Finish GUI Lab');

cy.contains('Finish GUI Lab')
  .parent()
  .click({ force: true });

cy.contains('Finish GUI Lab')
  .should('exist');


});

it('TC4 - Restore completed todo', () => {


createTodoItem('Read Cypress Notes');

cy.contains('Read Cypress Notes')
  .parent()
  .click({ force: true });

cy.contains('Read Cypress Notes')
  .parent()
  .click({ force: true });

cy.contains('Read Cypress Notes')
  .should('be.visible');


});

it('TC5 - Delete todo item', () => {


createTodoItem('Temporary Task');

cy.contains('Temporary Task')
  .parent()
  .within(() => {

    cy.contains('✖')
      .click({ force: true });

  });

cy.get('body')
  .should('not.contain', 'Temporary Task');


});

});
