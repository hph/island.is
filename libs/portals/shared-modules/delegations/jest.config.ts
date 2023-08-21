/* eslint-disable */
export default {
  displayName: 'portals-shared-modules-delegations',
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '<rootDir>/coverage/libs/portals/shared-modules/delegations',
}