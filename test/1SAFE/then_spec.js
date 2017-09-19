const Lab = require('lab');
const lab = exports.lab = Lab.script();
const {
  describe, context,
  Then
} = require('respec-given-lab')(lab);
const expect = require('expect.js');

describe("Then(fn)", () => {

  context('with natural assertion', () => {
    Then(() => 1 === 1);
  });

  context('with assertion library', () => {
    Then(() => expect(1).to.be(1));
  });

  context('support promise', () => {
    Then(() => Promise.resolve(1));
  });
});
