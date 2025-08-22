const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);

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

// Handle unstable_enablePackageExports for better ESM support
config.resolver.unstable_enablePackageExports = true;

// Custom resolver to handle .js imports that should resolve to .ts files
// Use Metro's default resolver when present; fall back to metro-resolver
const { resolve } = require("metro-resolver");

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Minimal stub for @metamask/sdk and any deep import
  if (moduleName.startsWith("@metamask/sdk")) {
    return resolve(
      context,
      path.resolve(__dirname, "shims/empty.js"),
      platform,
    );
  }

  // Force CommonJS builds for packages that ship ESM with import.meta
  if (moduleName === "zustand") {
    return resolve(context, "zustand/index.js", platform);
  }
  if (moduleName.startsWith("zustand/")) {
    const rest = moduleName.slice("zustand/".length);
    return resolve(context, `zustand/${rest.replace(/\.mjs$/, "")}.js`, platform);
  }
  if (moduleName === "valtio") {
    return resolve(context, "valtio/index.js", platform);
  }
  if (moduleName.startsWith("valtio/")) {
    const rest = moduleName.slice("valtio/".length);
    return resolve(context, `valtio/${rest.replace(/\.mjs$/, "")}.js`, platform);
  }

  // Try mapping .js -> .ts for packages that ship TS sources
  if (moduleName.endsWith(".js")) {
    const tsModuleName = moduleName.replace(/\.js$/, ".ts");
    try {
      return resolve(context, tsModuleName, platform);
    } catch (_) {
      // Fall through to default resolution below
    }
  }

  return resolve(context, moduleName, platform);
};

module.exports = wrapWithReanimatedMetroConfig(config);
