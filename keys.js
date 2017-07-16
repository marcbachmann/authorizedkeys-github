const GitHubApi = require('github')
const headers = {'user-agent': 'authorizedkeys-github-server'}
const timeout = 5000

module.exports = function (opts) {
  const token = opts.token
  opts = Object.assign({timeout, headers}, opts)
  opts.token = undefined

  const client = new GitHubApi(opts)
  client.authenticate({type: 'token', token})

  return {
    get: function (query) {
      return getMembers(client, query).then(getKeysOfUsers.bind(null, client))
    }
  }
}

function getMembers (client, {teamId, org, teamName}) {
  let q
  if (teamId) return getTeamMembers(client, teamId)

  if (!org) throw new Error('The option `org` is required.')
  if (!teamName) throw new Error('The option `teamName` is required.')
  return client.orgs.getTeams({org}).then(getMembersByTeamArray(client, teamName))
}

function getMembersByTeamArray (client, teamName) {
  return function (res) {
    const team = res.data.find((t) => t.name === teamName)
    if (!team) throw new Error(`No team found with the name '${teamName}'`)
    return getTeamMembers(client, team.id)
  }
}

function getTeamMembers (client, id) {
  return client.orgs.getTeamMembers({id}).then((res) => res.data.filter((m) => m.type === 'User'))
}

function getKeysOfUsers (client, users) {
  const getKey = getKeyOfUser.bind(null, client)
  return Promise.all(users.map(getKey)).then(function (keyz) {
    return users.map(function (user, i) {
      return {
        id: user.id,
        login: user.login,
        avatar_url: user.avatar_url,
        keys: keyz[i]
      }
    })
  })
}

function getKeyOfUser (client, user) {
  return client.users.getKeysForUser({username: user.login}).then((res) => res.data.map((k) => k.key))
}
