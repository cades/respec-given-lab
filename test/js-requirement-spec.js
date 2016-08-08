const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      gwt = require('respec-given-lab')(lab),
      describe = gwt.describe,
      context = gwt.describe,
      Then = gwt.Then

describe("requirement for JS testing", function() {

  context('with ES5 function', function() {
    Then(function(){
      return 1 === 1
    })
  })

  context('with ES6 arrow function', function() {

    context('explicitly return', function(){
      Then(() => {
        return 1 === 1
      })
    })

    context('implicitly return', function() {
      Then(() => 1 === 1)
    })

  })

})
