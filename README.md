<p align="center">
  <img src="./logo.png" width="200" alt="Electron Vue Boilerplate logo" >
</p>

<h1 align="center">Electron Vue Boilerplate</h1>

An Electron starter with Vue, Vite, Tailwind CSS, and SQLite.

## Stack

### Core

- Electron 44
- Vue 3
- Vite 8
- SQLite

### Style

- Tailwind CSS 4

### Code Style

- ESLint
- Prettier
- Commitlint

## Usage

Requires Node.js 24.14+ and pnpm 10.29.2.

### Development

```bash
pnpm install
pnpm dev
```

The dev server uses `http://127.0.0.1:5173` and fails if the port is occupied.
Renderer changes use HMR; main and preload changes recompile and restart Electron.

### Build

```bash
pnpm build
```

Before distributing your app, set `appId` and `productName` in
`electron-builder.json`. Set `publish.owner` and `publish.repo` to your public
GitHub repository for application updates.

### macOS signing and notarization

Configure these GitHub Actions secrets (or environment variables for a local signed build):

| Secret | Value |
| --- | --- |
| `CSC_LINK` | Base64-encoded Developer ID Application `.p12` certificate (a file path also works locally) |
| `CSC_KEY_PASSWORD` | Password for the exported certificate |
| `APPLE_ID` | Apple Developer account email |
| `APPLE_APP_SPECIFIC_PASSWORD` | App-specific password for that account |
| `APPLE_TEAM_ID` | Apple Developer team ID |

Run `pnpm build:mac` on macOS with Xcode command line tools installed to build
DMG and ZIP files for x64 and arm64. Configure all five secrets before running
the release workflow. electron-builder signs the app with Hardened Runtime,
submits it to Apple, and attaches the notarization ticket.

For local testing without signing credentials or notarization:

```bash
pnpm build:mac:local
```

Validate a signed release (adjust the app path for the architecture):

```bash
codesign --verify --deep --strict --verbose=2 "dist/mac-arm64/Electron App.app"
xcrun stapler validate "dist/mac-arm64/Electron App.app"
spctl --assess --verbose --type exec "dist/mac-arm64/Electron App.app"
```

See [electron-builder macOS configuration](https://www.electron.build/v26/docs/mac/).

### Application updates

Packaged apps check GitHub Releases at startup and every three hours, download
stable updates in the background, and offer **Restart and install** or **Later**.
Choosing Later installs the update on normal app quit. Closing the window only
hides this app, so use Quit to install. **About → Check for updates** runs a manual
check and can also install an already downloaded update. Development runs do not
contact the update service.

Auto-updates use signed macOS apps with ZIP artifacts, Windows NSIS installers,
and Linux AppImages.

Known limitations:

- Windows portable builds currently download the NSIS installer. Installing an
  update creates a regular installation and leaves the portable executable unchanged.
- Snap builds cannot use the in-app updater. Manual checks incorrectly report
  that the app is up to date; update through Snap instead.

See [electron-builder auto-update documentation](https://www.electron.build/v26/docs/features/auto-update/).

### Releases

The release workflow builds both macOS architectures together so `latest-mac.yml`
contains both. It uploads installers, ZIPs, `latest*.yml`, and blockmaps into one
**draft** release. Publish the draft after all assets are present to make the
update discoverable. The tag must match `package.json` (for example, `v2.3.8` for
version `2.3.8`) and be newer than the installed version. Manual workflow runs
check out the requested tag.

### Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm vite build
```

`pnpm test` compiles the main process and runs the updater tests. To test an
actual update, install a signed release, publish a newer one, then check for
updates in the app and restart to confirm the version changed.

TypeScript is pinned to 6.0 because the current typescript-eslint version does
not support TypeScript 7.
