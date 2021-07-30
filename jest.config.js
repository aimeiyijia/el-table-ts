module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  testMatch: [
    '**/__tests__/**/*.(js|ts|tsx)',
    '**/?(*.)+(spec|test).(js|ts|tsx)',
  ],
  transform: {
    '^.+\\.(js|jsx)?$': '<rootDir>/node_modules/babel-jest', // 如何解析一个js文件
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest',
    '^.+\\.(ts|tsx)?$': '<rootDir>/node_modules/ts-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub'
  },
  // moduleNameMapper为了解决webpack alias
  moduleNameMapper: {
    '^(mixins|utils|locale|directives|locale)/(.*)$':
      '<rootDir>/bui/src-latest/$1/$2',
    '^conf$': '<rootDir>/conf',
    '^locale$': '<rootDir>/bui/src-latest/locale',
    '^(src-common|src|conf|tests|bui)/(.*)$': '<rootDir>/$1/$2',
    '.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '.(css|less|scss)$': 'identity-obj-proxy',
  },
  // Coverage相关： 测试覆盖率报告
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{js,vue}', '!**/node_modules/**', '!**/bui/**'],
  coverageReporters: ['html', 'text-summary'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'testconfig.js',
    'tsconfig.js',
    'package.json',
    'package-lock.json'
  ],
  rootDir: '.',
  testEnvironment: 'jest-environment-jsdom-global',
  testPathIgnorePatterns: ['/node_modules/', '/conf/test.js', '/bui/'], // 忽略文件
  modulePathIgnorePatterns: ['<rootDir>/coverage/'],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'], // 测试快照
}
