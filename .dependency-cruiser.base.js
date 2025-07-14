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
      name: 'services-no-presentation',
      comment: 'Services should not depend on presentation layer',
      severity: 'error',
      from: { path: 'src/modules/.+\\.service\\.ts$' },
      to: { path: 'src/modules/.+\\.controller\\.ts$' },
    },
    {
      name: 'mapper-only-interfaces-&-dto-&-data',
      comment: 'Mapper should import only interfaces, DTOs and data',
      severity: 'error',
      from: { path: 'src/modules/.+\\.mapper\\.ts$' },
      to: {
        pathNot: [
          'src/modules/.+\\.interface\\.ts$',
          'src/modules/.+/dto/.+\\.ts$',
          'src/modules/.+/data/.+\\.ts$',
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
