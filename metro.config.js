const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");
/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);
/** custom config needed for thirdweb */
const isWeb = process.env.EXPO_PUBLIC_PLATFORM === "web";
config.resolver.unstable_enablePackageExports = true;
// Handle import.meta syntax for web compatibility
config.resolver.platforms = ["ios", "android", "native", "web"];
// Configure for better web compatibility
config.resolver.alias = {
  ...config.resolver.alias,
  "react-native$": "react-native-web",
};
// Fix module resolution issues with .js extensions pointing to .ts files
config.resolver.resolverMainFields = ["react-native", "browser", "main"];
config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs", "cjs"];
module.exports = wrapWithReanimatedMetroConfig(config);
