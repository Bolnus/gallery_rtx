module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint", "react", "jsx-a11y", "import", "prettier", "eslint-plugin-react"],
  extends: [
    // "eslint:recommended",
    // "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "airbnb",
    "prettier"
  ],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  reportUnusedDisableDirectives: true,
  ignorePatterns: [".eslintrc.js"],
  rules: {
    indent: ["warn", 2],
    "linebreak-style": "off",
    quotes: ["warn", "double"],
    semi: ["warn", "always"],
    curly: ["warn", "all"],
    "max-len": ["warn", { code: 120, ignorePattern: "^\\s*(// eslint-disable-)|(describe)|(test).+" }],
    "jsx-a11y/anchor-is-valid": ["warn", { aspects: ["invalidHref"] }],
    "jsx-a11y/label-has-for": "off",
    "jsx-a11y/alt-text": "warn",
    "jsx-a11y/control-has-associated-label": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "import/no-extraneous-dependencies": "off",
    "import/extensions": "off",
    "import/no-unresolved": "warn",
    "import/no-useless-path-segments": "warn",
    "import/prefer-default-export": "off",
    "import/no-cycle": "warn",
    "react/jsx-filename-extension": "off",
    "react/prefer-stateless-function": "off",
    "react/prop-types": ["warn", { ignore: ["children", "history", "match", "location"] }],
    "react/require-default-props": "off",
    "function-paren-newline": "off",
    "space-before-function-paren": "off",
    "object-curly-newline": ["warn", { consistent: true }],
    "prettier/prettier": [
      "off",
      {
        endOfLine: "auto"
      }
    ],
    "arrow-body-style": "off",
    "no-use-before-define": "off",
    "no-bitwise": "off",
    "no-unused-vars": "warn",
    "no-else-return": "warn",
    "import/order": "warn",
    "object-shorthand": ["warn", "methods"],
    "no-unneeded-ternary": "warn",
    "spaced-comment": "warn",
    "consistent-return": "warn",
    "no-useless-constructor": "warn",
    "prefer-destructuring": "warn",
    "prefer-const": "warn",
    "prefer-object-spread": "off",
    "no-return-assign": "warn",
    "default-case": "off",
    "no-restricted-syntax": "off",
    "no-plusplus": "off",
    "no-case-declarations": "warn",
    "array-callback-return": "off",
    "no-shadow": ["warn", { builtinGlobals: true, hoist: "functions", ignoreOnInitialization: false }],
    "no-prototype-builtins": "off",
    "react/jsx-indent": ["warn", 2],
    "react/jsx-indent-props": ["warn", 2],
    "default-param-last": "off",
    "react/destructuring-assignment": "off",
    "react/static-property-placement": "off",
    "react/state-in-constructor": "off",
    "react/jsx-props-no-spreading": "off",
    "react/self-closing-comp": [
      "warn",
      {
        component: true,
        html: true
      }
    ],
    "react/no-unused-prop-types": "warn",
    "react/sort-comp": "warn",
    "react/no-unused-state": "warn",
    "react/forbid-prop-types": "warn",
    "react/jsx-boolean-value": "warn",
    "react/jsx-fragments": "warn",
    "react/no-did-update-set-state": "warn",
    "react/no-access-state-in-setstate": "warn",
    "react/button-has-type": "off",
    "react/jsx-curly-brace-presence": "warn",
    "lines-between-class-members": "off",
    camelcase: "off",
    "no-underscore-dangle": "off",
    "brace-style": ["warn", "allman"],
    "prefer-arrow-callback": "off",
    "func-names": "off",
    "prefer-template": "off",
    "no-undef": "off",
    "react/jsx-no-bind": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "no-lonely-if": "warn",
    "no-fallthrough": "off",
    "react/jsx-no-useless-fragment": "warn",
    "comma-dangle": "off",
    "no-param-reassign": "off",
    "operator-assignment": "off",
    "no-debugger": "warn",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: ["variable", "property"],
        format: ["camelCase", "PascalCase", "snake_case", "UPPER_CASE"],
        leadingUnderscore: "allow",
        trailingUnderscore: "forbid"
      }
    ]
  },
  overrides: [
    {
      env: {
        node: true
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script"
      }
    },
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint", "eslint-plugin-react"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
      ],
      parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: "."
      },
      rules: {
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/member-delimiter-style": "warn",
        "@typescript-eslint/member-ordering": "warn",
        "@typescript-eslint/type-annotation-spacing": "warn",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-floating-promises": "warn",
        "@typescript-eslint/brace-style": ["warn", "allman"],
        "@typescript-eslint/ban-types": "warn",
        // "@typescript-eslint/indent": ["warn", 4],
        "@typescript-eslint/restrict-plus-operands": "warn",
        "@typescript-eslint/no-unsafe-assignment": "warn",
        "@typescript-eslint/no-inferrable-types": "warn",
        "@typescript-eslint/no-unsafe-call": "warn",
        "@typescript-eslint/no-unsafe-member-access": "warn",
        "@typescript-eslint/no-unsafe-argument": "warn",
        "@typescript-eslint/restrict-template-expressions": "warn",
        "@typescript-eslint/no-empty-function": "warn",
        "@typescript-eslint/require-await": "warn",
        "@typescript-eslint/no-misused-promises": "warn",
        "@typescript-eslint/no-unsafe-return": "warn",
        // "indent": "off",
        // "@typescript-eslint/indent": "error",
        "prefer-const": "warn",
        "comma-dangle": "off"
      }
    }
  ]
};
