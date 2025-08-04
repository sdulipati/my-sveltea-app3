import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs['flat/recommended'],
    prettier,
    ...svelte.configs['flat/prettier'],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            }
        }
    },
    {   
        files: ['**/*.svelte'],
        languageOptions: {
            parserOptions: {
                parse: ts.parser
            }
        }
    },
    {
        ignores: [ 'build/', 'dist/' ]
    }
];