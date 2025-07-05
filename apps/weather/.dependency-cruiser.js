const base = require('./../../.dependency-cruiser.base.js');

module.exports = {
  ...base,
  forbidden: [
    ...base.forbidden,
    {
      name: 'controllers-&-services-no-infrastructure',
      comment: 'Controllers and services should not depend on infrastructure',
      severity: 'error',
      from: { path: 'src/modules/.+\\.(controller|service)\\.ts$' },
      to: { path: 'src/modules/.+\\.provider\\.ts$' },
    },
    {
      name: 'providers-no-presentation-directly',
      comment: 'Providers should not depend on presentation',
      severity: 'error',
      from: { path: 'src/modules/.+\\.provider\\.ts$' },
      to: { path: 'src/modules/.+\\.controller\\.ts$' },
    },
  ],
};
