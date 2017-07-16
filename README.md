# [authorizedkeys-github](https://github.com/marcbachmann/authorizedkeys-github) [![](https://img.shields.io/docker/automated/marcbachmann/authorizedkeys-github.svg)](https://hub.docker.com/r/marcbachmann/authorizedkeys-github)

A server that fetches public keys of all members of a github team and writes them into an `.ssh/authorized_keys` file.

You can see a list of all users and their keys on `http://localhost:3000/`

### Usage

```bash
docker run -it -v /root/.ssh:/user/.ssh -p 3000:3000 \
-e 'GITHUB_TOKEN=your-github-token' \
-e 'GITHUB_ORG=upfrontIO' \
-e 'GITHUB_TEAM=Livingdocs' \
-e 'AUTHORIZED_KEYS_PATH=/Users/marcbachmann/.ssh/authorized_keys' \
marcbachmann/authorizedkeys-github

# or

docker run -it -v /root/.ssh:/user/.ssh -p 3000:3000 \
-e 'GITHUB_TOKEN=your-github-token' \
-e 'GITHUB_TEAM_ID=352089' \
-e 'AUTHORIZED_KEYS_PATH=/user/.ssh/authorized_keys' \
marcbachmann/authorizedkeys-github
```
