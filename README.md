# OpenQA Playwright-BDD 项目

用 Gherkin 描述步骤，由 OpenCode 驱动浏览器执行。当前用例是 [Sauce Demo](https://www.saucedemo.com) 登录成功。

## 环境

- Node.js 22 及以上
- 依赖装在 `.openqa/` 里：`npm install`
- 浏览器：`npx playwright install chromium`

Google 模型需要 API key，变量名是 `GOOGLE_GENERATIVE_AI_API_KEY`。

## 运行

```bash
cd .openqa
npm run test:headed   # 有界面，浏览器窗口最大化
npm test               # 无界面
npm run test:report    # 打开上次的 HTML 报告
```

用例在 `features/`。打开页面和登录写在同一步里，只调用一次 `google/gemini-3.8-flash`。站点、用户名和密码来自 `BASE_URL`、`APP_USERNAME`、`APP_PASSWORD`。最后一步 `the inventory page is displayed` 由 Playwright 断言 URL 和页面标题，不经过模型。

## 编写用例

```gherkin
Feature: Sauce Demo login

  Scenario: Log in successfully
    * I open the application and log in with the configured username and password
    * the inventory page is displayed
```

账号写在 `.env`，不要写进 feature。Sauce Demo 的公开演示账号是 `standard_user` / `secret_sauce`。

## 遇到过的问题

**`bddgen` 报 `registerESMLoader` 无法解构。**  
`npx openqa init` 装的是 `playwright-bdd@8.5.1`。Playwright 1.64 已经去掉这个内部导出，加载步骤时会直接崩。已升到 `playwright-bdd@9.2.1`（9.1.0 起会跳过这次调用）。`openqa@0.0.10` 的可选 peer 仍声明 `playwright-bdd@^8`，所以 `.npmrc` 里开了 `legacy-peer-deps=true`，否则 `npm install` 会因 peer 冲突失败。

**`spawn opencode ENOENT`。**  
`openqa init` 选 OpenCode 时只安装 `@opencode-ai/sdk`。这个包只是 HTTP 客户端，真正调模型的是本机的 `opencode` 命令，init 不会装它。已把 `opencode-ai@1.18.35` 加进依赖，和 SDK 同版本；`npm run` 会把 `node_modules/.bin` 放进 `PATH`。如果装完没有 `bin/opencode.exe`，在 `.openqa` 里执行 `node node_modules/opencode-ai/postinstall.mjs`。

**`Model not found: google/gemini-2.0-flash`。**  
init 写死的模型已不在当前 Google 目录里。已改成目录中最新的通用 Flash：`google/gemini-3.8-flash`。

**`Google Generative AI API key is missing`。**  
OpenCode 的 Google 提供方只读 `GOOGLE_GENERATIVE_AI_API_KEY`。项目里不再使用 `GOOGLE_API_KEY`。

**`database is locked`。**  
每个用例都会启动一个 `opencode serve`，它们共用同一个 SQLite。并行时会锁库。`playwright.config.ts` 里把 `workers` 设成了 `1`。

**`Cannot find name 'process'`。**  
项目原来没有 `tsconfig.json`，也没装 `@types/node`。已安装 `@types/node@^24`，并加上 `tsconfig.json`，`types` 包含 `node`。

## 参考

- [OpenQA](https://openqa.io/)
- [Playwright-BDD](https://vitalets.github.io/playwright-bdd/)
