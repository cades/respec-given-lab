var transform = require('./transform')

module.exports = [
  { ext: '.js', transform: (content, filename) => {
    if (filename.indexOf('node_modules') !== -1)
      return content

    return transform(content, filename)
  } }
]
