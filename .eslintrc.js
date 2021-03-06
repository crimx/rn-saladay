module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  globals: {
    __DEV__: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: ["standard", "standard-jsx"],
  // plugins: ['react'],
  // add your custom rules here
  'rules': {
    'prefer-promise-reject-errors': 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow comma dangle
    'comma-dangle': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
