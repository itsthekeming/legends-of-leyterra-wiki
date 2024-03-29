/** @type {import('prettier').Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  plugins: [
    'prettier-plugin-jsdoc',
    'prettier-plugin-organize-imports',
    'prettier-plugin-tailwindcss', // must come last
  ],
}
