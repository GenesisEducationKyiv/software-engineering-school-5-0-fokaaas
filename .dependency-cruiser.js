const base = require('./.dependency-cruiser.base.js');

module.exports = {
  ...base,
  forbidden: [
    {
      name: 'gateway-no-apps',
      comment: 'Gateway app should not depends on other apps',
      severity: 'error',
      from: { path: 'apps/gateway/' },
      to: { path: 'apps/', pathNot: 'apps/gateway/' },
    },
    {
      name: 'subscription-no-apps',
      comment: 'Subscription app should not depends on other apps',
      severity: 'error',
      from: { path: 'apps/subscription/' },
      to: { path: 'apps/', pathNot: 'apps/subscription/' },
    },
    {
      name: 'weather-no-apps',
      comment: 'Weather app should not depends on other apps',
      severity: 'error',
      from: { path: 'apps/weather/' },
      to: { path: 'apps/', pathNot: 'apps/weather/' },
    },
    {
      name: 'email-no-apps',
      comment: 'Email app should not depends on other apps',
      severity: 'error',
      from: { path: 'apps/email/' },
      to: { path: 'apps/', pathNot: 'apps/email/' },
    },
    {
      name: 'libs-no-apps',
      comment: 'Libs must not depend on apps',
      severity: 'error',
      from: { path: '^libs/' },
      to: { path: '^apps/' },
    },
    {
      name: 'no-circular',
      comment: 'No circular dependencies',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
  ],
};
