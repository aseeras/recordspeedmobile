const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
// crm/ is a separate app (RecordSpeed CRM, the staff app) with its own dependencies; keep it out of this bundle.
config.resolver.blockList = [...[].concat(config.resolver.blockList || []), /[\/\\]crm[\/\\].*/];

module.exports = withNativeWind(config, { input: "./global.css" });
