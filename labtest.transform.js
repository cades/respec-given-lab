var coffee = require('coffee-script')
var transform = require('./transform')

module.exports = [
  { ext: '.js', transform: (content, filename) => {
    if (filename.indexOf('node_modules') !== -1)
      return content

    return transform(content, filename)
  } },
  { ext: '.coffee', transform: (content, filename) => {
    if (filename.indexOf('node_modules') !== -1)
      return content

    const result = coffee.compile(content, {
      sourceMap: true,
      inline: true,
      sourceRoot: '/',
      sourceFiles: [filename]
    })

    return transform(result.js, filename)
  } }
]
