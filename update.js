const fs = require('fs')
const template = '# authorizedkeys-github\n((.|[\r\n])*)# end authorizedkeys-github'
const templateRegExp = new RegExp(template)

module.exports = update
module.exports.read = read

function update (path, users, cb) {
  if (!users.length) return cb()
  read(path, users, function (err, content) {
    if (err) return cb(err)
    fs.writeFile(path, content, {mode: '600'}, cb)
  })
}

function read (path, users, cb) {
  fs.readFile(path, 'utf8', function (err, str) {
    if (err && err.code !== 'ENOENT') return cb(err)

    if (/authorizedkeys-github/.test(str)) str = str.replace(templateRegExp, template)
    else str = str ? str + '\n' + template : template

    const keys = users.reduce((a, u) => a.concat(`# github user: ${u.login}`, u.keys, ''), []).join('\n')
    str = str.replace(templateRegExp, template.replace('((.|[\r\n])*)', keys)).replace(/\n?$/, '\n')
    cb(null, str)
  })
}
