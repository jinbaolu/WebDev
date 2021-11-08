# 代码格式化

## 插件

### eslint

**质量检查**
ESLint 可以通过 .`eslintrc`或 package.json 中的 `eslintConfig` 字段来配置。

<a href="https://eslint.bootcss.com/">eslint 官网</a>

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: { node: true },

  extends: [
    "plugin:vue/strongly-recommended", // 使用严谨模式
    "eslint:recommended",
    "@vue/prettier", // 结合 .prettierrc.js
  ],

  rules: {
    "no-console": "warn",
    "no-debugger": "warn",
    "no-unused-vars": [
      "warn",
      { ignoreRestSiblings: true /* 解构剩余变量时不检查 */ },
    ],
    "no-var": "warn",
    "prefer-const": ["warn", { destructuring: "all" }],
    "no-empty": "warn",
  },

  parserOptions: {
    parser: "babel-eslint",
  },

  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: { jest: true },
    },
  ],
}
```

```
.eslintignore 忽视文件
/dist
/public/libs
/src/libs
/docs/\*.html
```

### prettier

**风格检查**
vscode 配置代码格式化，需要安装插件

```javascript
/* 官网：https://prettier.io/docs/en/options.html */
module.exports = {
  semi: false, // 尽可能不要分号
  singleQuote: true, // 尽可能使用单引号
  trailingComma: "all", // 尽可能使用尾随逗号，参考：http://es6.ruanyifeng.com/#docs/style#对象
  printWidth: 100,
}
```

```
.prettierignore 忽视文件
/dist
/public/libs
/src/libs
/docs/*.html

```

### vetur

vue 单模块组件代码风格检查，内置包括上面两个，当我们单独配置规则文件，则以规则文件为主。  
<a href="https://www.cnblogs.com/mspeer/p/12055962.html">引用链接</a>
