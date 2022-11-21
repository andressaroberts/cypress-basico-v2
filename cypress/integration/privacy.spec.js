Cypress._.times(3, () => {
  it("independently test the privacy policy page", () => {
    cy.visit("./src/privacy.html");
  });
});
