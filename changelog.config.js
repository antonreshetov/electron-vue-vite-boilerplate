module.exports = {
  preset: {
    name: 'angular',
  },
  writerOpts: {
    transform: (commit) => {
      if (
        commit.type === 'build'
        && commit.subject
        && commit.subject.includes('release')
      ) {
        return null
      }
      if (
        commit.type === 'chore'
        && commit.subject
        && commit.subject.includes('update CHANGELOG')
      ) {
        return null
      }
      return commit
    },
  },
}
