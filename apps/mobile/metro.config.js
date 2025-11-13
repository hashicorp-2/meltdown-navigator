// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add monorepo support - allow resolving from project root
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Allow resolving from common directory
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), 'ts', 'tsx', 'js', 'jsx'];

// Ensure Metro resolves from project root, not monorepo root
config.projectRoot = projectRoot;

module.exports = config;

