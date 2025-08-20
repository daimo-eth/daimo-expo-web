const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

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
// Use Metro's default resolver when present
const { resolve } = require("metro-resolver");

config.resolver.resolveRequest = (context, moduleName, platform) => {
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

module.exports = config;
