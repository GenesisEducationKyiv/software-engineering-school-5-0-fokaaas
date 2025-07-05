const base = require('./../../.dependency-cruiser.base.js');

module.exports = {
  ...base,
  forbidden: [
    ...base.forbidden,
    {
      name: 'controllers-&-services-no-infrastructure',
      comment: 'Controllers should not depend on infrastructure',
      severity: 'error',
      from: { path: 'src/modules/.+\\.(controller|service)\\.ts$' },
      to: { path: 'src/modules/.+\\.repository\\.ts$' },
    },
    {
      name: 'repositories-no-presentation-directly',
      comment: 'Repositories should not depend on presentation',
      severity: 'error',
      from: { path: 'src/modules/.+\\.repository\\.ts$' },
      to: { path: 'src/modules/.+\\.controller\\.ts$' },
    },
  ],
};
