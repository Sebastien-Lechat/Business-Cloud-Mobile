package fr.business.cloud.mobile;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(com.getcapacitor.community.stripe.StripePlugin.class);
    registerPlugin(com.getcapacitor.community.facebooklogin.FacebookLogin.class);
    registerPlugin(com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth.class);
  }
}
