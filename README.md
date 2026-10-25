# FE laboratory

> A static front-end case laboratory with a searchable catalog, offline metadata cache, and automated data validation.

[Chinese document](./zh-CN.md)

## Requirements

- Node.js 20 or newer
- pnpm 11

If PowerShell blocks `pnpm.ps1`, use `pnpm.cmd` in the commands below.

## Development

```sh
pnpm install
pnpm dev
```

Open `http://localhost:4001`.

The runtime is still plain HTML, CSS, and ES Modules. The toolchain only validates data, generates assets, and runs tests.

## Adding A Case

1. Add large projects under `projects/` or small cases under `cases/`.
2. Add the cover image under `assets/img/cover/`.
3. Run `pnpm case:add`.
4. Run `pnpm covers:build`.
5. Commit both generated `assets/mock/list.min.json` and the WebP thumbnails.

`assets/mock/list.json` is the only editable catalog source. Its case entries use this shape:

```json
{
  "cid": 4001,
  "name": "Example case",
  "description": "Short description",
  "href": "cases/example/",
  "picUrl": "./assets/img/cover/example.jpg",
  "type": "js",
  "tags": ["javascript", "demo"],
  "create_time": "2026-10-18",
  "update_time": "2026-10-18"
}
```

## Commands

| Command              | Purpose                                                   |
| -------------------- | --------------------------------------------------------- |
| `pnpm dev`           | Start the static development server on port 4001          |
| `pnpm case:add`      | Interactively append a case to the canonical catalog      |
| `pnpm catalog:build` | Validate the catalog and generate `list.min.json`         |
| `pnpm catalog:check` | Fail when generated catalog files are stale               |
| `pnpm covers:build`  | Generate 480x300 WebP list thumbnails                     |
| `pnpm covers:check`  | Verify every catalog cover has a valid thumbnail          |
| `pnpm typecheck`     | Strict TypeScript checking for new JavaScript via JSDoc   |
| `pnpm lint`          | ESLint checks for application modules, scripts, and tests |
| `pnpm test`          | Vitest unit tests                                         |
| `pnpm test:e2e`      | Playwright desktop and mobile smoke tests                 |
| `pnpm verify`        | Run the full local quality gate                           |

## Catalog Runtime

The home page reads `assets/mock/list.min.json` and validates its schema at runtime. The verified payload is stored in IndexedDB database `felab`, object store `catalog`, record key `catalog`.

On every visit the cached catalog is rendered first, then the network copy is checked in the background. A changed `revision` replaces the rendered catalog. If the network fails, cached cases remain searchable. The application does not fall back to `localStorage` and does not install a Service Worker.

External case links open `/link/check/?cid=<cid>`. The same confirmation page also accepts
`/link/check/?outlink=<encoded-url>` for direct external links. Both entry points validate the
destination, display its host and full URL, and require an explicit click before leaving the site.

## Dark Mode

The home page, shared case viewer shell, and external-link confirmation page use `assets/js/theme.js`. The first visit follows `prefers-color-scheme`; a manual choice is stored as `felab-theme` in `localStorage`. Embedded case content is not restyled.

## Contribution

[@gitguanqi](https://github.com/gitguanqi)

## License

This project follows the [GPL3.0](https://www.gnu.org/licenses/gpl-3.0.html) license. Copyright by gitguanqi.
