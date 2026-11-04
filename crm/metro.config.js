// The CRM app's own bundler settings, so the patient app's (in the folder above, with NativeWind) isn't used.
const { getDefaultConfig } = require("expo/metro-config");

module.exports = getDefaultConfig(__dirname);
