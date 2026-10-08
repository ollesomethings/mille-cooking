import * as ImagePicker from 'expo-image-picker';

/**
 * Open the photo library (a file dialog on web) and return picked URIs.
 * Returns [] on cancel or failure — callers decide their fallback.
 */
export async function pickPhotos(max: number): Promise<string[]> {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: max > 1,
      selectionLimit: max,
      quality: 0.8,
    });
    if (result.canceled) return [];
    return result.assets.slice(0, max).map(a => a.uri);
  } catch {
    return [];
  }
}
