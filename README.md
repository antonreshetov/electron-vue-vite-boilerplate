<p align="center">
  <img src="./logo.png" width="200" alt="Electron Vue Boilerplate logo" >
</p>

<h1 align="center">Electron Vue Boilerplate</h1>

You can use this boilerplate to start your next project with Electron and Vue.

## Stack

### Core
  - Electron 44
  - Vue 3
  - Vite 8
  - SQLite

### Style
  - Tailwind CSS 4

### Code Style
  - Eslint
  - Prettier
  - Commitlint

## Usage

Requires Node.js 24.14+ and pnpm 10.29.2. TypeScript stays on 6.0 until typescript-eslint supports 7.

### Development
```bash
pnpm install
pnpm dev
```

### Build
```bash
pnpm build
```

Development compiles the main process before starting Vite, nodemon, and Electron.
Electron waits for Vite at `http://127.0.0.1:5173`; `strictPort` prevents silently
switching to another port. Renderer changes use HMR, while main/preload changes
are compiled by nodemon and restart Electron through electronmon.

### macOS signing and notarization

Release builds use electron-builder's built-in notarization and Hardened Runtime,
following the same setup as massCode. Before distributing an app, replace the
example `appId` and `productName` in `electron-builder.json`.

Configure these GitHub Actions secrets (or environment variables for a local signed build):

| Secret | Value |
| --- | --- |
| `CSC_LINK` | Base64-encoded Developer ID Application `.p12` certificate (a file path also works locally) |
| `CSC_KEY_PASSWORD` | Password for the exported certificate |
| `APPLE_ID` | Apple Developer account email |
| `APPLE_APP_SPECIFIC_PASSWORD` | App-specific password for that account |
| `APPLE_TEAM_ID` | Apple Developer team ID |

Run `pnpm build:mac` on macOS with Xcode command line tools installed to build
both x64 and arm64 DMGs. The release workflow requires signing; configure all
five secrets before running it. electron-builder submits the signed application
to Apple and staples the notarization ticket automatically.

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

See [electron-builder macOS configuration](https://www.electron.build/v26/docs/mac/)
and [Tailwind CSS v4 migration](https://tailwindcss.com/docs/upgrade-guide).

### Checks

```bash
pnpm lint
pnpm typecheck
pnpm vite build
pnpm build:main
```

### Application updates

Packaged apps check GitHub Releases at startup and every three hours, download
stable updates in the background, and offer **Restart and install** or **Later**.
Choosing Later installs the update on normal app quit. Closing the window only
hides this app, so use Quit to install. **About → Check for updates** runs a manual
check and can also install an already downloaded update. Development runs do not
contact the update service.

Set `publish.owner` and `publish.repo` in `electron-builder.json` to your public
GitHub repository before distributing your own app. No GitHub token is embedded
in the application. macOS updates require a signed app and the ZIP target; Windows
updates use the NSIS installer, and Linux updates use AppImage. Portable Windows
and Snap packages should be updated separately.

The release workflow builds both macOS architectures together so `latest-mac.yml`
contains both. It uploads installers, ZIPs, `latest*.yml`, and blockmaps into one
**draft** release. Publish the draft after all assets are present to make the
update discoverable. The tag must match `package.json` (for example, `v2.3.8` for
version `2.3.8`) and be newer than the installed version. Manual workflow runs
check out the requested tag.

Run `pnpm test` for updater lifecycle checks. To verify end to end, install a
signed release, publish a newer release with its update assets, then check for
updates in the installed app and restart to confirm the new version.

Reference: [electron-builder auto-update documentation](https://www.electron.build/v26/docs/features/auto-update/).
