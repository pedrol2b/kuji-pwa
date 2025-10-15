package com.kuji.app;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.webkit.WebView;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Enable debugging for WebView (remove in production)
    WebView.setWebContentsDebuggingEnabled(true);
  }
}
