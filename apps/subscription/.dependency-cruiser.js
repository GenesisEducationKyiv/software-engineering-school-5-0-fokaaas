const base = require('./../../.dependency-cruiser.base.js');

module.exports = {
  ...base,
  forbidden: [
    ...base.forbidden,
    {
      name: 'repositories-no-application-&-presentation',
      comment: 'Repositories should not depend on application & presentation',
      severity: 'error',
      from: { path: 'src/modules/.+\\.repository\\.ts$' },
      to: { path: 'src/modules/.+\\.(controller|service)\\.ts$' },
    },
    {
      name: 'controllers-no-infrastructure-directly',
      comment: 'Controllers should not depend on infrastructure directly',
      severity: 'error',
      from: { path: 'src/modules/.+\\.controller\\.ts$' },
      to: { path: 'src/modules/.+\\.repository\\.ts$' },
    },
  ],
};
