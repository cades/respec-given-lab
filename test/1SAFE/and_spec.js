const expect = require('expect.js');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const {
  describe, context, it,
  Given, When, Then, And
} = require('respec-given-lab')(lab);

describe("And(fn)", () => {

  Given('info', () => []);

  describe("And is called after Then", () => {
    Then(function() { this.info.push("T"); });
    And(function() { this.info.push("A"); });
    And(function() { expect(["T", "A"]).to.eql(this.info); });
  });

  describe("And is called only once with multiple Thens", () => {
    Then(function() { this.info.push("T"); });
    Then(function() { this.info.push("T2"); });
    And(function() { expect(this.info.toString() === "T" || this.info.toString() === "T2"); });
  });

  describe("Inherited Ands are not run", () => {
    Then(function() { this.info.push("T-OUTER"); });
    And(function() { this.info.push("A-OUTER"); });
    And(function() { expect(this.info).to.eql(["T-OUTER", "A-OUTER"]); });

    context("inner", () => {
      Then(function() { this.info.push("T-INNER"); });
      And(function() { this.info.push("A-INNER"); });
      And(function() { expect(this.info).to.eql(["T-INNER", "A-INNER"]); });
    });
  });

  describe("Ands require a Then", () => {
    let e, message = null;
    try {
      And(function() {});
    } catch (error) {
      e = error;
      message = e.message;
    }

    it("defines a message", () => {
      expect(message).to.match(/and.*without.*then/i);
    });
  });
});
