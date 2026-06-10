/**
 * Content safety utilities.
 * MVP uses mock moderation. Replace with real API (e.g., AWS Rekognition,
 * Google Cloud Vision SafeSearch, or OpenAI moderation) before production.
 */

export type ModerationResult =
  | { safe: true }
  | { safe: false; reason: string };

/**
 * PLACEHOLDER: Real implementation calls an image moderation API.
 * In MVP, always returns safe unless URI contains certain test strings.
 *
 * Production hookup: POST imageUri to moderation endpoint, check for:
 * - faces (privacy)
 * - NSFW content
 * - documents / IDs
 * - medical imagery
 */
export async function moderateImage(imageUri: string): Promise<ModerationResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));

  // TEST MODE: trigger failures with specific URI patterns for dev testing
  if (imageUri.includes('__test_face__')) {
    return { safe: false, reason: 'face_detected' };
  }
  if (imageUri.includes('__test_nsfw__')) {
    return { safe: false, reason: 'inappropriate_content' };
  }
  if (imageUri.includes('__test_doc__')) {
    return { safe: false, reason: 'document_detected' };
  }

  // All real images pass in MVP
  return { safe: true };
}

export function getModerationErrorMessage(reason: string): string {
  switch (reason) {
    case 'face_detected':
      return "We can't scan faces to protect your privacy. Try scanning an object instead!";
    case 'inappropriate_content':
      return "That image isn't suitable for Object Arena. Please try a different object.";
    case 'document_detected':
      return "Looks like a document or ID. We can't process those. Try a household object!";
    case 'object_not_detected':
      return "We couldn't find a clear object in that image. Try a clearer photo with good lighting.";
    case 'image_not_clear':
      return "The image is too blurry or dark. Take a clearer photo and try again!";
    case 'network_error':
      return "Can't connect right now. Check your internet and try again.";
    default:
      return "Something went wrong with that image. Please try another one.";
  }
}

/**
 * PLACEHOLDER: Real implementation would call AI vision API (e.g., GPT-4 Vision,
 * Google Cloud Vision, or AWS Rekognition) to identify the object in the image.
 * Returns detected object category for fighter generation.
 */
export async function detectObjectCategory(imageUri: string): Promise<string | null> {
  // Simulate AI processing time
  await new Promise((r) => setTimeout(r, 1200));

  // MVP: randomly pick an object type
  // PRODUCTION: POST image to AI vision API → get object labels → map to game categories
  const categories = ['shoe', 'cup', 'keyboard', 'bottle', 'book', 'toy', 'chair', 'snack', 'phone', 'mystery'];
  return categories[Math.floor(Math.random() * categories.length)];
}
