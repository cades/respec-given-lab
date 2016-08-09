var respecGivenCore = require('respec-given-core')
function noop(){}

module.exports = function(lab) {

  var core = respecGivenCore.createCore({
    rootSuite: null,
    addSuiteCallback: noop,
    addSkippedSuiteCallback: function(_, title) {
      lab.experiment.skip(title)
    },
    addTestCallback: function(_, label, fn) {
      lab.test(label, fn)
    }
  })
  var context = {}

  // traditional describe/it BDD interface

  context.describe = context.context = function(title) {
    const options = arguments.length === 3 ? arguments[1] : {}
    const fn = arguments.length === 3 ? arguments[2] : arguments[1],
          wrappedFn = core.describe.bind(null, title, fn)
    lab.experiment(title, options, wrappedFn)
  }

  context.it = context.specify = function (title) {
    const options = arguments.length === 3 ? arguments[1] : {}
    const fn = arguments.length === 3 ? arguments[2] : arguments[1]
    const unifiedFn = fn.length > 0 ? fn : function(done) { Promise.resolve(fn()).then(function(){ done() }) }
    core.it.call(null, title, unifiedFn)
  }

  context.xdescribe = context.xcontext = context.describe.skip = context.context.skip = core.xdescribe

  // rspec/given interface

  context.Given = core.Given
  context.Let = core.Let
  context.When = core.When
  context.GivenI = core.GivenI
  context.LetI = core.LetI
  context.Then = core.Then
  context.Invariant = core.Invariant
  context.And = core.And
  context.Cleanup = core.Cleanup
  context.Then.skip = context.xit
  context.Failure = core.Failure

  context.ThenError = core.ThenError
  context.ThenFail = core.ThenFail

  return context
}
