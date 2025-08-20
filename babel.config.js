module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [],
    // Ensure node_modules that use `import.meta` are also transformed
    overrides: [
      {
        test: /node_modules\/(lit|@daimo|viem|ox)\//,
        plugins: [["babel-plugin-transform-import-meta", { module: "ES6" }]],
      },
      {
        // Fallback for app code too
        plugins: [["babel-plugin-transform-import-meta", { module: "ES6" }]],
      },
    ],
  };
};
