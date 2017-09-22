const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      gwt = require('respec-given-lab')(lab),
      describe = gwt.describe,
      context = gwt.describe,
      Then = gwt.Then

describe("requirement for JS testing", () => {

  context('with ES5 function', () => {
    Then(function(){
      return 1 === 1
    })
  })

  context('with ES6 arrow function', () => {

    context('explicitly return', () => {
      Then(() => {
        return 1 === 1
      })
    })

    context('implicitly return', () => {
      Then(() => 1 === 1)
    })

  })

})
