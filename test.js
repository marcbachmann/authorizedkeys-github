const assert = require('assert')

// Query by teamId
setupGithubServer(function (err, server) {
  const keys = require('./keys')({
    token: 'mock',
    host: `localhost`,
    protocol: 'http',
    port: server.port
  })
  keys.get({teamId: 123})
  .then((users) => {
    assert.ok(Array.isArray(users), 'Expect response to be an array of users')
    assert.deepEqual(users, [{
      id: 12345,
      login: 'foo',
      avatar_url: 'http://github.com/some/avatar/url',
      keys: ['ssh-rsa firstfookey']
    }, {
      id: 23456,
      login: 'bar',
      avatar_url: 'http://github.com/some/avatar/url',
      keys: ['ssh-rsa firstbarkey', 'ssh-rsa secondbarkey']
    }])
  })
  .catch(function (err) {
    console.error(err)
    server.destroy()
    process.exit(1)
  })
  .then(server.destroy)
})


// Query by orgName & teamName
setupGithubServer(function (err, server) {
  const keys = require('./keys')({
    token: 'mock',
    host: `localhost`,
    protocol: 'http',
    port: server.port
  })
  keys.get({org: 'some-org', teamName: 'Some team'})
  .then((users) => {
    assert.ok(Array.isArray(users), 'Expect response to be an array of users')
    assert.deepEqual(users, [{
      id: 12345,
      login: 'foo',
      avatar_url: 'http://github.com/some/avatar/url',
      keys: ['ssh-rsa firstfookey']
    }, {
      id: 23456,
      login: 'bar',
      avatar_url: 'http://github.com/some/avatar/url',
      keys: ['ssh-rsa firstbarkey', 'ssh-rsa secondbarkey']
    }])
  })
  .catch(function (err) {
    console.error(err)
    server.destroy()
    process.exit(1)
  })
  .then(server.destroy)
})

function setupGithubServer (cb) {
  const fastify = require('fastify')()

  fastify.get('/orgs/some-org/teams', (req, rep) => {
    rep.send([{
      id: 123,
      name: 'Some team'
    }])
  })

  fastify.get('/teams/123/members', (req, rep) => {
    rep.send([{
      id: 12345,
      login: 'foo',
      avatar_url: 'http://github.com/some/avatar/url',
      type: 'User'
    }, {
      id: 23456,
      login: 'bar',
      avatar_url: 'http://github.com/some/avatar/url',
      type: 'User'
    }])
  })

  fastify.get('/users/foo/keys', (req, rep) => {
    rep.send([{
      id: 12346,
      key: 'ssh-rsa firstfookey'
    }])
  })

  fastify.get('/users/bar/keys', (req, rep) => {
    rep.send([{
      id: 23457,
      key: 'ssh-rsa firstbarkey'
    }, {
      id: 23458,
      key: 'ssh-rsa secondbarkey'
    }])
  })

  fastify.listen(0, function (err) {
    if (err) return cb(err)

    const server = fastify.server
    cb(null, {port: server.address().port, destroy: server.close.bind(server)})
  })
}
