# kuji-pwa

<div align="right">
<img align="right" src="https://github.com/user-attachments/assets/18b32ee4-039c-424a-abaf-2055fc867ebf" width="320" target="_blank">
</div>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

Kuji is an interactive decision‑making app that helps you make choices through a fun, lottery‑style experience. Create multiple decision lists for different aspects of your life, customize probabilities for each option, scratch to reveal your fate, and reflect on outcomes in a built‑in journal. Designed to run as a Progressive Web App and as a native Android APK via Capacitor.

## Core Features

- Multiple decision lists per context (food, workouts, chores, etc.)
- Weighted options with customizable probabilities
- Scratch‑card reveal experience and animations
- Decision history with weekly trends and charts
- Reflection/decision journal to capture thoughts and outcomes
- Theme selection (light/dark/system) with persistence
- Fully responsive PWA with offline support

## 🚀 Tech Stack

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS 4.1 + custom animations
- UI Primitives: Radix UI + custom components
- State: Zustand + Immer
- PWA: @ducanh2912/next-pwa (Workbox under the hood)
- Mobile: Capacitor 7 (Android APK)

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Java JDK 17 (for Android build)
- Android SDK/Platform Tools (for APK/emulator)

### Setup

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

## 📱 Android APK

### One‑shot build (PWA + APK)

```bash
npm run deploy:android
```

This will:

1. Build the Next.js app (static export with PWA)
2. Sync Capacitor
3. Build both release and debug APKs
4. Output artifacts

- kuji-release.apk (project root)
- kuji-debug.apk (project root)

### Step‑by‑step

```bash
# 1) Initial Android setup (adds platform + keystore if needed)
npm run apk:setup

# 2) Build PWA and sync Capacitor
npm run pwa:build

# 3a) Build release APK
npm run android:build && npm run apk:copy

# 3b) Or build debug APK
npm run android:build-debug && npm run apk:copy-debug
```

APK build outputs (from Gradle) also live under:
`android/app/build/outputs/apk/{release,debug}/`

### Available scripts

| Script | Description |
|---|---|
| `dev` | Start Next.js dev server |
| `build` | Next.js build |
| `start` | Start Next.js production server |
| `typecheck` | TypeScript typecheck |
| `pwa:build` | Build PWA (static export) and `cap sync` |
| `android:setup` | Add Android platform to Capacitor |
| `android:sync` | Sync Android project |
| `android:clean` | Clean Android build cache |
| `android:build` | Build release APK via Gradle |
| `android:build-debug` | Build debug APK via Gradle |
| `android:run` | Run app on device/emulator |
| `apk:setup` | Android setup + keystore creation |
| `apk:build` | Build PWA + release APK + copy artifact |
| `apk:build-debug` | Build PWA + debug APK + copy artifact |
| `apk:full-build` | Release + debug builds in sequence |
| `build:compat` | Build flow focused on WebView‑compat testing |
| `webview:check` | Inspect connected device/emulator WebView version |
| `deploy:android` | Full pipeline to produce APKs |

## 📦 PWA Configuration

### Manifest (`public/manifest.json`)

```json
{
  "name": "Kuji - Random Decision Maker",
  "short_name": "Kuji",
  "description": "Interactive decision-making app that helps you make choices through a fun, lottery-style experience. Create multiple decision lists, customize probabilities, and reveal your fate by scratching cards.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait",
  "scope": "/",
  "icons": [
    { "src": "/favicon.ico", "type": "image/x-icon", "sizes": "16x16 32x32" },
    { "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "/icon-512.png", "type": "image/png", "sizes": "512x512" },
    { "src": "/icon-192-maskable.png", "type": "image/png", "sizes": "192x192", "purpose": "maskable" },
    { "src": "/icon-512-maskable.png", "type": "image/png", "sizes": "512x512", "purpose": "maskable" }
  ]
}
```

### Next.js PWA setup (`next.config.mjs`)

```js
import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable:
    process.env.DISABLE_PWA === 'true' ||
    process.env.NODE_ENV === 'development' ||
    process.env.CAPACITOR_BUILD === 'true',
  workboxOptions: {
    disableDevLogs: true
  }
})

export default withPWA({
  images: { unoptimized: true },
  output: 'export',
  trailingSlash: true,
  distDir: 'out'
})
```

### Capacitor config (`capacitor.config.ts`)

```ts
import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.kuji.app',
  appName: 'Kuji',
  webDir: 'out',
  server: {
  androidScheme: 'https',
    cleartext: true,
    allowNavigation: ['*']
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    includePlugins: [],
    backgroundColor: '#1A1A1E',
    overrideUserAgent:
      'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    appendUserAgent: 'KujiApp/1.0.0'
  }
}

export default config
```

## 🧪 WebView Compatibility (Android)

Running web content inside Android System WebView can behave differently from Chrome on device. Kuji includes utilities and styles to improve rendering on older WebViews.

### What we implemented

- Runtime detection and body flags via `src/lib/webview-compat.ts`:
  - Adds classes like: `webview`, `webview-old`, `webview-no-modern-css`, `webview-no-backdrop-filter`, `webview-no-oklch`, `webview-chrome-<major>`
  - Fallbacks for glass/blur, neon glows, gradients when features are missing
  - MutationObserver to re-apply fallbacks on dynamic content

- Dedicated styles for degraded environments:
  - `src/styles/webview-compat-enhanced.css`

- Build/test helpers:
  - `npm run build:compat` — builds PWA and a debug APK to test WebView fallbacks
  - `npm run webview:check` — prints the connected device/emulator WebView version and tips

### Issues we’ve faced so far

- Older WebView versions (< Chrome 120) not fully supporting modern CSS
- `backdrop-filter` (and `-webkit-backdrop-filter`) rendering inconsistencies
- OKLCH color values not supported — need hex/rgba fallbacks
- Occasional gradient banding and lack of `gap` support in flex/grid on very old engines
- Emulators without Google Play images ship with outdated WebView providers

### Recommendations

- Prefer emulators with Google Play system images and keep Android System WebView up to date (120+)
- If layouts look off, run `npm run webview:check` and consider switching the WebView provider to Chrome
- Use the provided fallback classes in custom components as needed

For a deeper dive, see: [WebView Compatibility Guide](WEBVIEW_COMPATIBILITY.md)

## 📲 Install & Test

### PWA (Web)

1. Visit the deployed site in a modern browser
2. Use “Add to Home Screen” to install as a standalone PWA

### Android APK

1. Build using the steps above
2. Install the resulting `kuji-release.apk` or `kuji-debug.apk` on your device

## 🏗️ Why PWA + Capacitor?

- One codebase across web and mobile
- Offline‑first experience for quick, repeat use
- Fast iteration with web tooling; native feel via Capacitor shell

---

[contributors-shield]: https://img.shields.io/github/contributors/pedrol2b/kuji-pwa.svg?style=for-the-badge
[contributors-url]: https://github.com/pedrol2b/kuji-pwa/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/pedrol2b/kuji-pwa.svg?style=for-the-badge
[forks-url]: https://github.com/pedrol2b/kuji-pwa/network/members
[stars-shield]: https://img.shields.io/github/stars/pedrol2b/kuji-pwa.svg?style=for-the-badge
[stars-url]: https://github.com/pedrol2b/kuji-pwa/stargazers
[issues-shield]: https://img.shields.io/github/issues/pedrol2b/kuji-pwa.svg?style=for-the-badge
[issues-url]: https://github.com/pedrol2b/kuji-pwa/issues
[license-shield]: https://img.shields.io/github/license/pedrol2b/kuji-pwa.svg?style=for-the-badge
[license-url]: https://github.com/pedrol2b/kuji-pwa/blob/main/LICENSE
