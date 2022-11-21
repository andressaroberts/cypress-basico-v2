Cypress.Commands.add("fillMandatoryFieldsAndSubmit", () => {
  cy.get("#firstName").type("Andressa");
  cy.get("#lastName").type("Roberts");
  cy.get("#email").type("teste@teste.com");
  cy.get("#open-text-area").type("Houston, we have a problem");
  cy.contains("button", "Enviar").click();
});
