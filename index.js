module.exports = function (fastify, opts, cb) {
  const log = fastify.logger.logger
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const GITHUB_ORG = process.env.GITHUB_ORG
  const GITHUB_TEAM = process.env.GITHUB_TEAM
  const GITHUB_TEAM_ID = process.env.GITHUB_TEAM_ID
  const AUTHORIZED_KEYS_PATH = process.env.AUTHORIZED_KEYS_PATH
  const SYNC_INTERVAL = process.env.SYNC_INTERVAL

  if (!GITHUB_TOKEN) throw new Error('The env variable GITHUB_TOKEN is required')
  if (!AUTHORIZED_KEYS_PATH) throw new Error('The env variable AUTHORIZED_KEYS_PATH is required')
  if (!GITHUB_TEAM_ID && !(GITHUB_ORG && GITHUB_TEAM)) throw new Error('The env variable GITHUB_TEAM_ID or the combination of GITHUB_ORG and GITHUB_TEAM are required.')

  const keys = require('./keys')({token: GITHUB_TOKEN})
  const getParams = {org: GITHUB_ORG, teamName: GITHUB_TEAM, teamId: GITHUB_TEAM_ID}

  setInterval(sync, SYNC_INTERVAL || 5*60 * 1000)
  sync()

  function sync () {
    keys.get(getParams).then(function (users) {
      require('./update')(AUTHORIZED_KEYS_PATH, users, function (err) {
        if (err) {
          log.fatal(err)
          process.exit(1)
        }
      })
    }).catch(function (err) {
      log.fatal(err)
      process.exit(1)
    })
  }

  fastify.get('/', (req, rep) => keys.get(getParams))
  fastify.get('/status', (req, rep) => rep.code(204).send())

  cb()
}
