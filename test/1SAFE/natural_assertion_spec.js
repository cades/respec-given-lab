const Lab = require('lab');
const lab = exports.lab = Lab.script();
const {
  describe, context,
  When, Invariant, Then, And, ThenFail
} = require('respec-given-lab')(lab);

describe("Natural Assertion", () => {

  context("success comparison", () => {

    context('with number', () => {
      Then(() => 1 === 1);
      And(() => 1 === 1);
    });

    context('with string', () => {
      Then(() => "xx" === "xx");
    });

    context('with lexical variable', () => {
      var a = 1;
      Then(() => a === 1);
    });

    context('with chain', () => {
      const a = { b: 1 },
            c = 1;
      Then(() => a.b === c);
    });
  });

  context("expression return false", () => {

    context('in Then', () => {
      ThenFail(() => 1 === 2);
    });

    context('in Invariant', () => {
      Invariant(() => false);
      ThenFail(() => 1);
    });

    context('in And', () => {
      ThenFail(() => 1);
      And(() => false);
    });
  });
});
