# 前端实验室

> 一个采用原生 HTML、CSS、ES Module 构建的前端案例站，包含可搜索目录、离线元数据缓存和数据校验流程。

[英文文档](./README.md)

## 环境要求

- Node.js 20 或更高版本
- pnpm 11

如果 PowerShell 禁止运行 `pnpm.ps1`，请使用 `pnpm.cmd` 执行命令。

## 本地开发

```sh
pnpm install
pnpm dev
```

打开 `http://localhost:4001` 即可预览。

运行时不依赖前端框架。工具链只负责数据校验、资源生成和自动化测试。

## 新增案例

1. 大型项目放入 `projects/`，小型案例放入 `cases/`。
2. 将封面原图放入 `assets/img/cover/`。
3. 执行 `pnpm case:add`。
4. 执行 `pnpm covers:build`。
5. 提交生成后的 `assets/mock/list.min.json` 和 WebP 缩略图。

`assets/mock/list.json` 是唯一需要手工编辑的目录数据源。单条案例格式如下：

```json
{
  "cid": 4001,
  "name": "示例案例",
  "description": "案例说明",
  "href": "cases/example/",
  "picUrl": "./assets/img/cover/example.jpg",
  "type": "js",
  "tags": ["javascript", "demo"],
  "create_time": "2026-10-18",
  "update_time": "2026-10-18"
}
```

## 常用命令

| 命令                 | 作用                                      |
| -------------------- | ----------------------------------------- |
| `pnpm dev`           | 在 4001 端口启动静态开发服务器            |
| `pnpm case:add`      | 交互式追加案例并更新生成目录              |
| `pnpm catalog:build` | 校验数据并生成 `list.min.json`            |
| `pnpm catalog:check` | 检查生成目录是否过期                      |
| `pnpm covers:build`  | 生成最长边 480x300 的 WebP 列表缩略图     |
| `pnpm covers:check`  | 检查所有案例封面缩略图                    |
| `pnpm typecheck`     | 通过 JSDoc 对新 JavaScript 做严格类型检查 |
| `pnpm lint`          | 检查应用模块、脚本和测试                  |
| `pnpm test`          | 运行 Vitest 单元测试                      |
| `pnpm test:e2e`      | 运行 Playwright 桌面与移动端冒烟测试      |
| `pnpm verify`        | 执行完整本地质量门槛                      |

## 目录运行时

首页请求 `assets/mock/list.min.json`，并在浏览器内再次校验数据结构。校验后的数据写入 IndexedDB 数据库 `felab`、对象仓库 `catalog`、记录键 `catalog`。

每次访问先渲染缓存，再在后台检查网络版本。`revision` 变化时更新页面；网络失败时继续保留可搜索的本地目录。项目不会回退到 `localStorage`，也不注册 Service Worker。

站外案例统一进入 `/link/check/?cid=<cid>`。确认页也支持通过 `/link/check/?outlink=<编码后的地址>` 直接打开外部链接。两种入口都会校验目标、展示目标域名和完整地址，并由用户主动确认后离开本站。

## 贡献

[@gitguanqi](https://github.com/gitguanqi)

## 协议

本项目遵循 [GPL3.0](https://www.gnu.org/licenses/gpl-3.0.html) 协议，Copyright by gitguanqi。
