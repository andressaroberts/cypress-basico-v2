/// <reference types="Cypress" />

describe("Central de Atendimento ao Cliente TAT", () => {
  const THREE_SECONDS_IN_MS = 3000;

  beforeEach(() => {
    cy.visit("./src/index.html");
  });

  it("check application title", () => {
    cy.title().should("eq", "Central de Atendimento ao Cliente TAT");
  });

  it("fill in the required fields and send the form", () => {
    const longText =
      "In Cypress, unlike other test automation tools, most commands are chainable. That is, instead of storing the return of a cy.get() in a variable for later use, you chain commands to it, such as a .should(), .type() or .click().";

    cy.clock();

    cy.get("#firstName").type("Andressa");
    cy.get("#lastName").type("Roberts");
    cy.get("#email").type("teste@teste.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();

    cy.get(".success").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".success").should("not.be.visible");
  });

  Cypress._.times(2, () => {
    it("phone field remains empty when typing a non-numeric value", () => {
      cy.get("#phone").type("testing").should("have.value", "");
    });
  });
  it("displays error message when submitting the form with an email with invalid formatting", () => {
    cy.clock();

    cy.get("#firstName").type("Andressa");
    cy.get("#lastName").type("Roberts");
    cy.get("#email").type("teste@");
    cy.get("#open-text-area").type("Houston, we have a problem");
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  it("displays error message when phone becomes mandatory but not filled in before form submission", () => {
    cy.clock();

    cy.get("#firstName").type("Andressa");
    cy.get("#lastName").type("Roberts");
    cy.get("#email").type("teste@teste.com");
    cy.get("#open-text-area").type("Houston, we have a problem");
    cy.get("#phone-checkbox").check();
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  it("fill in and clear the first name, last name, email and phone fields", () => {
    cy.get("#firstName")
      .type("Andressa")
      .should("have.value", "Andressa")
      .clear()
      .should("have.value", "");
    cy.get("#lastName")
      .type("Roberts")
      .should("have.value", "Roberts")
      .clear()
      .should("have.value", "");
    cy.get("#email")
      .type("teste@teste.com")
      .should("have.value", "teste@teste.com")
      .clear()
      .should("have.value", "");
    cy.get("#open-text-area")
      .type("Houston, we have a problem")
      .should("have.value", "Houston, we have a problem")
      .clear()
      .should("have.value", "");
  });

  it("displays error message when submitting the form without filling in the required fields", () => {
    cy.clock();

    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  it("successfully submit the form using a custom command", () => {
    cy.clock();

    cy.fillMandatoryFieldsAndSubmit();

    cy.get(".success").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".success").should("not.be.visible");
  });

  it("selects a product (YouTube) by its text", () => {
    cy.get("#product").select("YouTube").should("have.value", "youtube");
  });

  it("selects a product (Mentorship) by its value (value)", () => {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });

  it("selects a product (Blog) by its index", () => {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it("mark the type of service 'Feedback'", () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("have.value", "feedback");
  });

  it("mark each type of service", () => {
    cy.get('input[type="radio"]')
      .should("have.length", 3)
      .each(($radio) => {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });

  it("check both checkboxes, then uncheck the last one", () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("not.be.checked");
  });

  it("selects a file from the fixture folder", () => {
    cy.get("#file-upload")
      .should("not.have.value")
      .selectFile("cypress/fixtures/example.json")
      .should(($input) => {
        expect($input[0].files[0].name).to.eq("example.json");
      });
  });

  it("selects a file simulating a drag-and-drop", () => {
    // objeto action
    cy.get("#file-upload")
      .selectFile("cypress/fixtures/example.json", { action: "drag-drop" })
      .should(($input) => {
        expect($input[0].files[0].name).to.eq("example.json");
      });
  });

  it("selects a file using a fixture that has been given an alias", () => {
    cy.fixture("example.json").as("sampleFile");
    cy.get("#file-upload")
      .selectFile("@sampleFile")
      .should(($input) => {
        expect($input[0].files[0].name).to.eq("example.json");
      });
  });

  it("verifies that the privacy policy opens in another tab without the need for a click", () => {
    cy.get("#privacy a").should("have.attr", "target", "_blank");
  });

  it("access the privacy policy page by removing the target and then clicking on the link", () => {
    cy.get("#privacy a").invoke("removeAttr", "target").click();
    cy.contains("Talking About Testing").should("be.visible");
  });

  it("display and hide success and error messages using .invoke", () => {
    cy.get(".success")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Mensagem enviada com sucesso.")
      .invoke("hide")
      .should("not.be.visible");
    cy.get(".error")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Valide os campos obrigatórios!")
      .invoke("hide")
      .should("not.be.visible");
  });

  it("fills the text area using the invoke command", () => {
    const longText = Cypress._.repeat("Testing text-area ", 10);

    cy.get("#open-text-area")
      .invoke("val", longText)
      .should("have.value", longText);
  });

  it("make an http request", () => {
    cy.request(
      "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html"
    ).should(function (response) {
      const { status, statusText, body } = response;
      expect(status).to.equal(200);
      expect(statusText).to.equal("OK");
      expect(body).to.include("CAC TAT");
    });
  });

  it("find the hidden cat", () => {
    cy.get("#cat").invoke("show").should("be.visible");
    cy.get("#title").invoke("text", "CAT TAT");
    cy.get("#subtitle").invoke("text", "We ❤️ cats");
  });
});
