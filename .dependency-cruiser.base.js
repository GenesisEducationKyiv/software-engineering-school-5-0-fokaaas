module.exports = {
  options: {
    tsConfig: {
      fileName: './tsconfig.json',
    },
    exclude: {
      path: 'node_modules',
    },
  },
  forbidden: [
    {
      name: 'controllers-no-application',
      comment: 'Controllers should not depend on application',
      severity: 'error',
      from: { path: 'src/modules/.+\\.controller\\.ts$' },
      to: { path: 'src/modules/.+\\.service\\.ts$' },
    },
    {
      name: 'mapper-only-services-or-dto',
      comment: 'Mapper should import services interfaces or DTOs',
      severity: 'error',
      from: { path: 'src/modules/.+\\.mapper\\.ts$' },
      to: {
        pathNot: [
          'src/modules/.+\\.service\\.ts$',
          'src/modules/.+/dto/.+\\.ts$',
        ],
      },
    },
    {
      name: 'module-should-import-only-own-providers',
      comment: `*.module.ts files should only import providers from their own module (and other .module.ts)`,
      severity: 'error',
      from: { path: 'src/modules/([^/]+)/.*\\.module\\.ts$' },
      to: {
        path: 'src/modules/((?!\\1)[^/]+)/.+\\.(service|controller|mapper)\\.ts$',
      },
    },
    {
      name: 'impl-files-isolated',
      comment: `Each implementation file of module should be isolated from others`,
      severity: 'error',
      from: { path: 'src/modules/([^/]+)/(controller|mapper|service)\\.ts$' },
      to: {
        path: 'src/modules/(?!\\1)([^/]+)/(controller|mapper|service)\\.ts$',
      },
    },
  ],
};
