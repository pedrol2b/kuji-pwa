/**
 * WebView Detection and Compatibility Utilities
 * Detects Android WebView version and applies compatibility fixes
 */

export interface WebViewInfo {
  isWebView: boolean
  version: string | null
  majorVersion: number | null
  isOldWebView: boolean
  supportsModernCSS: boolean
  supportsBackdropFilter: boolean
  supportsOklch: boolean
}

/**
 * Detect if running in Android WebView and get version info
 */
export function detectWebView(): WebViewInfo {
  const userAgent = navigator.userAgent
  const isWebView = /wv\)|Android.*Version\/[\d.]+.*Chrome\/[\d.]+.*Mobile/.test(userAgent)

  let version: string | null = null
  let majorVersion: number | null = null

  if (isWebView) {
    const chromeMatch = userAgent.match(/Chrome\/([\d.]+)/)
    if (chromeMatch) {
      version = chromeMatch[1]
      majorVersion = parseInt(version.split('.')[0], 10)
    }
  }

  const isOldWebView = majorVersion !== null && majorVersion < 120
  const supportsModernCSS = majorVersion !== null && majorVersion >= 120
  const supportsBackdropFilter = majorVersion !== null && majorVersion >= 76
  const supportsOklch = majorVersion !== null && majorVersion >= 111

  return {
    isWebView,
    version,
    majorVersion,
    isOldWebView,
    supportsModernCSS,
    supportsBackdropFilter,
    supportsOklch,
  }
}

/**
 * Apply compatibility classes based on WebView capabilities
 */
export function applyWebViewCompatibility(): void {
  const webViewInfo = detectWebView()
  const body = document.body

  // Add WebView detection classes to body
  if (webViewInfo.isWebView) {
    body.classList.add('webview')

    if (webViewInfo.isOldWebView) {
      body.classList.add('webview-old')
    }

    if (!webViewInfo.supportsModernCSS) {
      body.classList.add('webview-no-modern-css')
    }

    if (!webViewInfo.supportsBackdropFilter) {
      body.classList.add('webview-no-backdrop-filter')
    }

    if (!webViewInfo.supportsOklch) {
      body.classList.add('webview-no-oklch')
    }

    if (webViewInfo.majorVersion) {
      body.classList.add(`webview-chrome-${webViewInfo.majorVersion}`)
    }
  }

  // Log WebView info for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('WebView Detection:', webViewInfo)
  }
}

/**
 * Force fallback styles for critical elements on old WebView
 */
export function applyWebViewFallbacks(): void {
  const webViewInfo = detectWebView()

  if (!webViewInfo.isOldWebView) return

  // Apply inline styles for critical elements that might not render correctly
  const glassElements = document.querySelectorAll('.glass')
  glassElements.forEach((element) => {
    const el = element as HTMLElement
    el.style.background = 'rgba(19, 19, 26, 0.95)'
    el.style.backdropFilter = 'none'
    el.style.setProperty('-webkit-backdrop-filter', 'none')
    el.style.border = '1px solid rgba(255, 255, 255, 0.1)'
  })

  const neonElements = document.querySelectorAll('.neon-glow')
  neonElements.forEach((element) => {
    const el = element as HTMLElement
    el.style.boxShadow = '0 0 20px #6366f1, 0 0 40px #6366f1'
    el.style.border = '1px solid #6366f1'
  })

  const gradientElements = document.querySelectorAll('[class*="bg-gradient"]')
  gradientElements.forEach((element) => {
    const el = element as HTMLElement
    el.style.background = '#6366f1'
  })
}

/**
 * Initialize WebView compatibility on page load
 */
export function initWebViewCompatibility(): void {
  // Apply compatibility classes immediately
  applyWebViewCompatibility()

  // Apply fallbacks after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyWebViewFallbacks)
  } else {
    applyWebViewFallbacks()
  }

  // Reapply fallbacks when content changes (for dynamic content)
  const observer = new MutationObserver((mutations) => {
    let shouldReapply = false
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldReapply = true
      }
    })

    if (shouldReapply) {
      // Debounce to avoid excessive calls
      setTimeout(applyWebViewFallbacks, 100)
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

/**
 * Get WebView compatibility recommendations
 */
export function getWebViewRecommendations(): string[] {
  const webViewInfo = detectWebView()
  const recommendations: string[] = []

  if (!webViewInfo.isWebView) {
    return ['Running in regular browser - no WebView-specific recommendations needed']
  }

  if (webViewInfo.isOldWebView) {
    recommendations.push(
      `WebView version ${webViewInfo.version} is outdated. Consider updating Android System WebView.`,
    )
  }

  if (!webViewInfo.supportsModernCSS) {
    recommendations.push('Modern CSS features may not render correctly. Using fallback styles.')
  }

  if (!webViewInfo.supportsBackdropFilter) {
    recommendations.push('Backdrop filters not supported. Using alternative background styles.')
  }

  if (!webViewInfo.supportsOklch) {
    recommendations.push('OKLCH colors not supported. Using hex/rgba fallbacks.')
  }

  if (recommendations.length === 0) {
    recommendations.push('WebView is modern and supports all app features!')
  }

  return recommendations
}

const webViewCompat = {
  detectWebView,
  applyWebViewCompatibility,
  applyWebViewFallbacks,
  initWebViewCompatibility,
  getWebViewRecommendations,
}

export default webViewCompat
