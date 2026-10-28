# Build Instructions for Mozilla Add-ons (AMO) Review

These instructions provide step-by-step guidance for reviewing and reproducing the production build of **Aure Homepage** for Mozilla Firefox.

---

## 1. Environment & Prerequisites

The build has been verified in the following environments:
- **Node.js**: >= 20.x (tested on v22.x)
- **Bun**: >= 1.2.x (or **npm** >= 10.x)
- **Operating System**: macOS, Linux, or Windows (WSL / PowerShell)

All required environment variables are already defined in the included [`.env`](file:///.env) file.

---

## 2. Installation

From the root directory of this extracted source archive, install the dependencies using **Bun** (recommended) or **npm**:

```bash
bun install
```

*(Alternatively with npm: `npm install`)*

---

## 3. Build for Mozilla Firefox

Run the Firefox production build command:

```bash
bun run build:firefox
```

*(Alternatively with npm: `npm run build:firefox`)*

This command executes `TARGET_BROWSER=firefox vite build`, which:
1. Generates the Firefox-specific `manifest.json` configured with:
   - Gecko ID: `"aure-homepage@auredev.ir"`
   - Background script: `"background.js"`
   - Firefox-specific permissions and host permissions
2. Bundles and minifies TypeScript and React components with Vite.
3. Places the complete build output into the [`dist/firefox`](file:///dist/firefox) directory.

---

## 4. Output Verification

The output will be located in:
```text
dist/firefox/
├── manifest.json
├── index.html
├── background.js
└── assets/
    ├── newtab.js
    ├── newtab.css
    ├── browser-polyfill.js
    └── ...
```

To load and test the unpacked extension in Firefox:
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select `dist/firefox/manifest.json`.
4. Open a new tab to see the extension running.
