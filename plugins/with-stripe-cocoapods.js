// Stripe's React Native SDK (0.81, Expo SDK 58) resolves the Stripe iOS SDK through Swift Package Manager, which
// needs dynamic frameworks. This app links native modules statically, so this sets Stripe's own switch to take the
// Stripe iOS SDK from CocoaPods instead. Stripe marks that switch as deprecated: drop this plugin when moving the app
// to dynamic frameworks (expo-build-properties ios.useFrameworks "dynamic").
const { withPodfile } = require("expo/config-plugins");

const LINE = "$StripeDisableSPM = true # added by plugins/with-stripe-cocoapods.js";

module.exports = function withStripeCocoaPods(config) {
  return withPodfile(config, (config) => {
    if (!config.modResults.contents.includes("$StripeDisableSPM")) {
      config.modResults.contents = `${LINE}\n${config.modResults.contents}`;
    }
    return config;
  });
};
