const path = require('path');

module.exports = {
    env: {
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
    ],
    plugins: [
        'import',
    ],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018
    },
    settings: {
        'import/resolver': {
            alias: [
                ['@root', __dirname],
                ['@app', path.resolve(__dirname, '_app')],
                ['@constants', path.resolve(__dirname, '_app/constants.js')],
                ['@content', path.resolve(__dirname, '_content')],
                ['@mixins', path.resolve(__dirname, '_mixins')],
                ['@util', path.resolve(__dirname, '_app/util')]
            ],
        }
    },
    rules: {
        indent: [
            'error',
            2,
            { SwitchCase: 1 }
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'brace-style': [
            'error',
            'stroustrup',
        ],
        semi: [
            'error',
            'always'
        ],
        'no-unused-vars': [
            'error',
            { args: 'none' }
        ],
        'no-use-before-define': [
            'error',
            {
                functions: false,
                classes: false,
                variables: true
            }
        ],
        'import/no-unresolved': [
            'error',
            {
                commonjs: true,
                caseSensitive: true
            }
        ],
        'require-atomic-updates': 'off',
    },
    globals: {
        req: false,
        jest: false,
        expect: false,
        jasmine: false,
        cleanDatabase: false,
        __: false,
        _: false,
        CONTENT_FILES_PATH: false,
        DB_POOL: false
    }
};