'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  initWebViewCompatibility,
  detectWebView,
  getWebViewRecommendations,
  type WebViewInfo,
} from '@/lib/webview-compat'

interface WebViewStatusProps {
  showDetails?: boolean
  className?: string
}

export default function WebViewStatus({ showDetails = false, className = '' }: WebViewStatusProps) {
  const [webViewInfo, setWebViewInfo] = useState<WebViewInfo | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])

  useEffect(() => {
    // Initialize WebView compatibility
    initWebViewCompatibility()

    // Detect WebView info
    const info = detectWebView()
    setWebViewInfo(info)
    setRecommendations(getWebViewRecommendations())
  }, [])

  if (!webViewInfo) {
    return null
  }

  if (!showDetails && !webViewInfo.isOldWebView) {
    return null
  }

  const getStatusBadge = () => {
    if (!webViewInfo.isWebView) {
      return <Badge variant="secondary">Browser</Badge>
    }

    if (webViewInfo.supportsModernCSS) {
      return (
        <Badge variant="default" className="bg-green-500 text-white">
          Modern WebView
        </Badge>
      )
    }

    if (webViewInfo.isOldWebView) {
      return <Badge variant="destructive">Legacy WebView</Badge>
    }

    return (
      <Badge variant="default" className="bg-yellow-500 text-white">
        Compatible
      </Badge>
    )
  }

  const getStatusColor = () => {
    if (!webViewInfo.isWebView) return 'bg-gray-500'
    if (webViewInfo.supportsModernCSS) return 'bg-green-500'
    if (webViewInfo.isOldWebView) return 'bg-red-500'
    return 'bg-yellow-500'
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Compact Status Bar */}
      {!showDetails && webViewInfo.isOldWebView && (
        <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
          <AlertDescription className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
            <span className="text-sm">WebView {webViewInfo.version} detected. Enhanced compatibility mode active.</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Status */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>WebView Status</span>
              {getStatusBadge()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* WebView Information */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Environment:</span>
                <span className="ml-2">{webViewInfo.isWebView ? 'Android WebView' : 'Web Browser'}</span>
              </div>

              {webViewInfo.version && (
                <div>
                  <span className="font-medium">Version:</span>
                  <span className="ml-2">{webViewInfo.version}</span>
                </div>
              )}

              {webViewInfo.majorVersion && (
                <div>
                  <span className="font-medium">Major Version:</span>
                  <span className="ml-2">{webViewInfo.majorVersion}</span>
                </div>
              )}
            </div>

            {/* Feature Support */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Feature Support:</h4>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Modern CSS:</span>
                  <Badge
                    variant={webViewInfo.supportsModernCSS ? 'default' : 'destructive'}
                    className={webViewInfo.supportsModernCSS ? 'bg-green-500 text-white' : ''}
                  >
                    {webViewInfo.supportsModernCSS ? 'Supported' : 'Limited'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span>Backdrop Filter:</span>
                  <Badge
                    variant={webViewInfo.supportsBackdropFilter ? 'default' : 'destructive'}
                    className={webViewInfo.supportsBackdropFilter ? 'bg-green-500 text-white' : ''}
                  >
                    {webViewInfo.supportsBackdropFilter ? 'Supported' : 'Fallback'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span>OKLCH Colors:</span>
                  <Badge
                    variant={webViewInfo.supportsOklch ? 'default' : 'destructive'}
                    className={webViewInfo.supportsOklch ? 'bg-green-500 text-white' : ''}
                  >
                    {webViewInfo.supportsOklch ? 'Supported' : 'Fallback'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recommendations:</h4>
                <div className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <Alert key={index} className="text-sm">
                      <AlertDescription>{rec}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export { WebViewStatus }
