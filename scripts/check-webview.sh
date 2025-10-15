#!/bin/bash

# WebView Version Checker and Updater for Capacitor Android Development
# Run this script to check and help update your emulator's WebView version

echo "🔍 Checking Android WebView Version..."
echo "=================================="

# Check if adb is available
if ! command -v adb &> /dev/null; then
    echo "❌ ADB not found. Please install Android SDK Platform Tools."
    exit 1
fi

# Check if any devices are connected
if ! adb devices | grep -q "device$"; then
    echo "❌ No Android devices/emulators detected."
    echo "   Please start your emulator or connect a device."
    exit 1
fi

echo "📱 Connected devices:"
adb devices

echo ""
echo "🌐 Current WebView information:"
adb shell dumpsys webviewupdate | grep -E "(Current WebView|Preferred WebView|WebView packages:)" -A 10

# Extract current WebView version
CURRENT_WEBVIEW=$(adb shell dumpsys webviewupdate | grep "Current WebView package" | sed 's/.*(\(.*\))/\1/')
echo ""
echo "📋 Current WebView: $CURRENT_WEBVIEW"

# Check WebView version number
VERSION_CODE=$(echo "$CURRENT_WEBVIEW" | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+' | head -1)
if [ ! -z "$VERSION_CODE" ]; then
    MAJOR_VERSION=$(echo "$VERSION_CODE" | cut -d. -f1)
    echo "🔢 Major version: $MAJOR_VERSION"

    if [ "$MAJOR_VERSION" -lt 120 ]; then
        echo ""
        echo "⚠️  WARNING: Your WebView version ($MAJOR_VERSION) is outdated!"
        echo "   This may cause CSS rendering issues in your Capacitor app."
        echo ""
        echo "🔧 Recommended fixes:"
        echo "   1. Update Android System WebView from Play Store"
        echo "   2. Use Chrome as WebView provider (see below)"
        echo "   3. Use Google Play system image in emulator"
        echo ""

        # Check if Chrome is available as WebView provider
        if adb shell dumpsys webviewupdate | grep -q "com.android.chrome"; then
            echo "💡 Chrome is available as WebView provider."
            echo "   Run this command to switch to Chrome:"
            echo "   adb shell settings put global webview_provider com.android.chrome"
        fi
    else
        echo "✅ WebView version is modern enough for Capacitor development!"
    fi
else
    echo "❓ Could not determine WebView version"
fi

echo ""
echo "🎯 For optimal Capacitor development:"
echo "   • WebView version should be 120+ for full CSS support"
echo "   • Use Google Play system images in emulator"
echo "   • Keep Android System WebView updated"
echo ""
echo "🔗 Useful commands:"
echo "   Check WebView: adb shell dumpsys webviewupdate"
echo "   Switch to Chrome: adb shell settings put global webview_provider com.android.chrome"
echo "   Reset to default: adb shell settings delete global webview_provider"
