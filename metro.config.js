const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// somethings-ui packages are consumed as raw TS source via file: links
const coreLibPath = path.dirname(
  require.resolve('@somethings-ui/core/package.json'),
);
const nativeLibPath = path.dirname(
  require.resolve('@somethings-ui/native/package.json'),
);

config.watchFolders = [...(config.watchFolders || []), coreLibPath, nativeLibPath];

// The file:-linked UI packages have no node_modules of their own — resolve
// their bare imports (class-variance-authority, tailwind-merge, …) from ours.
config.resolver.nodeModulesPaths = [
  ...(config.resolver.nodeModulesPaths || []),
  path.resolve(__dirname, 'node_modules'),
];

// Asset URLs must be space-free or EAS Hosting serves them as HTML (see file)
config.transformer.assetPlugins = [
  ...(config.transformer.assetPlugins || []),
  path.resolve(__dirname, 'metro-asset-sanitize.js'),
];

// Native-only modules get web stubs instead of crashing (see CLAUDE.md)
const webStubs = {
  'expo-haptics': path.resolve(__dirname, 'src/web/expo-haptics-stub.ts'),
};

const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && webStubs[moduleName]) {
    return { type: 'sourceFile', filePath: webStubs[moduleName] };
  }
  return (defaultResolveRequest || context.resolveRequest)(context, moduleName, platform);
};

module.exports = withNativeWind(config, {
  input: './global.css',
});
