const nextJest = require('next/jest')
const { compilerOptions } = require('./tsconfig.json')
const moduleNameMapper = Object.fromEntries(
  Object.entries(compilerOptions.paths).map(([alias, [target]]) => [
    '^' + alias.replace('*', '(.*)') + '$',
    '<rootDir>/' + target.replace('*', '$1'),
  ]),
)
module.exports = nextJest({ dir: './' })({
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper,
})
