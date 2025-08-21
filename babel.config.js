module.exports = function (api) {
  // Configure cache before any other API calls
  api.cache(true);

  return {
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
    plugins: [
      // Always apply import.meta transformation
      ["babel-plugin-transform-import-meta", { module: "ES6" }]
    ],
    // Don't ignore node_modules - let them be transformed
    ignore: [],
  };
};
