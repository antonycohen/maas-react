/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'es5',
    semi: true,
    printWidth: 120,
    plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
