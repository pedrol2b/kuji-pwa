#!/bin/bash

echo "🔧 Building Kuji PWA with Enhanced WebView Compatibility..."
echo "=================================================="

# Build PWA first
echo "📦 Building PWA..."
npm run pwa:build

if [ $? -ne 0 ]; then
    echo "❌ PWA build failed!"
    exit 1
fi

echo "✅ PWA build completed!"

# Build APK
echo "📱 Building APK..."
npm run apk:build-debug

if [ $? -ne 0 ]; then
    echo "❌ APK build failed!"
    exit 1
fi

echo "✅ APK build completed!"

# Show build information
echo ""
echo "🎉 Build completed successfully!"
echo "📂 APK location: android/app/build/outputs/apk/debug/"
echo "🔍 WebView compatibility features:"
echo "   - CSS fallbacks for WebView 44+ (Android 5.0+)"
echo "   - OKLCH to hex color fallbacks"
echo "   - Backdrop filter alternatives"
echo "   - Gradient fallbacks"
echo "   - Gap property fallbacks"
echo "   - Dynamic WebView detection"
echo ""
echo "🧪 To test on emulator:"
echo "   adb install android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "🔧 To check WebView version:"
echo "   npm run webview:check"
