// RecordSpeed CRM: the staff app (sales CRM + projects) for the RecordSpeed team. Separate from the patient app in
// the folder above: its own bundle ID, App Store listing and EAS project.
module.exports = {
  expo: {
    name: "RecordSpeed CRM",
    slug: "recordspeed-crm",
    scheme: "recordspeedcrm",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: { image: "./assets/splash.png", resizeMode: "contain", backgroundColor: "#ffffff" },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.recordspeed.crm",
      infoPlist: { ITSAppUsesNonExemptEncryption: false },
    },
    web: { bundler: "metro", favicon: "./assets/favicon.png" },
    plugins: ["expo-router"],
    experiments: { typedRoutes: false },
    owner: "aseeras",
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.recordspeed.com",
      eas: { projectId: "7c0f3554-85e7-46f1-bced-01b47c4d05e0" },
    },
  },
};
