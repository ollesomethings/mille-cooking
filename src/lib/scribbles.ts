import {
  Moodies as RawMoodies,
  Scribbles as RawScribbles,
} from '@somethings-ui/core/assets';
import { Asset } from 'expo-asset';

/**
 * Central place the UI package's image assets get resolved to `{ uri }`
 * sources. (The disappearing-scribbles bug on the deployed site was NOT
 * expo-image — EAS Hosting served HTML for asset paths containing a space;
 * see metro-asset-sanitize.js for the actual fix. This module stays as the
 * one import point for these assets.)
 *
 * Import Scribbles/Moodies from here, never from '@somethings-ui/core/assets'.
 */
export const assetUri = (mod: number | { uri: string }) =>
  typeof mod === 'number' ? { uri: Asset.fromModule(mod).uri } : mod;

const resolveAll = <T extends Record<string, unknown>>(assets: T) =>
  Object.fromEntries(
    Object.entries(assets).map(([name, mod]) => [name, assetUri(mod as number)])
  ) as Record<keyof T, { uri: string }>;

export const Scribbles = resolveAll(RawScribbles);
export const Moodies = resolveAll(RawMoodies);
