export default {
  expo: {
    name: "Record Speed",
    slug: "record_speed_mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#4A68DC",
    },
    assetBundlePatterns: ["**/*"],
    plugins: ["expo-apple-authentication", "expo-router"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.recordspeed.app",
      usesAppleSignIn: true,
      entitlements: {
        "com.apple.developer.applesignin": ["Default"],
      },
      infoPlist: {
        NSCameraUsageDescription:
          "Enable Camera Acess so that you can take pictures",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile: "./google-services.json",
      package: "com.ingeniousagency.record_speed_mobile",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "82f173e3-9aff-489c-bb33-a77f7ae4f036",
      },
    },
    owner: "aseeras",
    scheme: "record-speed-mobile",
  },
};
