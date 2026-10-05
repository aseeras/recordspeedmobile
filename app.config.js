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
      bundleIdentifier: "com.ingeniousagency.record-speed-mobile",
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
    // extra.eas.projectId: add the ID printed by `eas init` (the old one belonged to the ingenious-agency account).
    owner: "aseeras",
    scheme: "record-speed-mobile",
  },
};
