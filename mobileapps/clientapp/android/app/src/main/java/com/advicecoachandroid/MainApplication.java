package com.advicecoachandroid;

import android.app.Application;

import com.facebook.react.BuildConfig;
import com.facebook.react.ReactApplication;
import com.brentvatne.react.ReactVideoPackage;
import org.reactnative.camera.RNCameraPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.auth0.react.A0Auth0Package;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.calendarevents.CalendarEventsPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactlibrary.RNReactNativeDocViewerPackage;
import com.rnfs.RNFSPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactVideoPackage(),
            new RNCameraPackage(),
            new ReactNativePushNotificationPackage(),
            new LinearGradientPackage(),
            new ReactNativeOneSignalPackage(),
            new ReactNativeYouTube(),
          new A0Auth0Package(),
          new RNFetchBlobPackage(),
          new CalendarEventsPackage(),
          new ImagePickerPackage(),
          new RNReactNativeDocViewerPackage(),
          new RNFSPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
