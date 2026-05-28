/**
 * Image URL Utilities for Firebase Storage and WhatsApp Integration
 * Handles URL validation, encoding, and transformation
 */

/**
 * Validates if a URL is a valid Firebase Storage URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid Firebase Storage URL
 */
export function isFirebaseStorageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  
  const firebasePatterns = [
    /^https:\/\/firebasestorage\.googleapis\.com/,
    /^https:\/\/storage\.googleapis\.com/,
    /^gs:\/\//
  ];
  
  return firebasePatterns.some(pattern => pattern.test(url));
}

/**
 * Validates if a URL is publicly accessible
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if URL appears valid
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    
    // Check protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Check if it's a data URL (base64)
    if (url.startsWith('data:image/')) {
      return true;
    }
    
    // Check common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => 
      urlObj.pathname.toLowerCase().includes(ext)
    );
    
    // Firebase URLs or URLs with image extensions are valid
    return isFirebaseStorageUrl(url) || hasImageExtension;
  } catch (error) {
    console.error('Invalid URL format:', error.message);
    return false;
  }
}

/**
 * Converts http URLs to https
 * @param {string} url - The URL to convert
 * @returns {string} - HTTPS URL
 */
export function ensureHttps(url) {
  if (!url) return url;
  
  if (url.startsWith('http://')) {
    console.log('Converting HTTP to HTTPS:', url);
    return url.replace('http://', 'https://');
  }
  
  return url;
}

/**
 * Ensures Firebase Storage URL has proper download parameters
 * @param {string} url - Firebase Storage URL
 * @returns {string} - URL with alt=media parameter
 */
export function ensureFirebaseDownloadUrl(url) {
  if (!url || !isFirebaseStorageUrl(url)) return url;
  
  try {
    const urlObj = new URL(url);
    
    // Ensure alt=media is present for direct download
    if (!urlObj.searchParams.has('alt')) {
      urlObj.searchParams.set('alt', 'media');
      console.log('Added alt=media to Firebase URL');
    }
    
    return urlObj.toString();
  } catch (error) {
    console.error('Error processing Firebase URL:', error.message);
    return url;
  }
}

/**
 * Processes and validates an image URL for WhatsApp webhook
 * @param {string} url - The image URL to process
 * @param {string} fallbackUrl - Fallback URL if primary fails
 * @returns {string} - Processed and validated URL
 */
export function processImageUrl(url, fallbackUrl = null) {
  // Handle missing URL
  if (!url) {
    return fallbackUrl || getDefaultFallbackImage();
  }
  
  // Handle data URLs (base64)
  if (url.startsWith('data:image/')) {
    return url;
  }
  
  // Ensure HTTPS
  let processedUrl = ensureHttps(url);
  
  // Process Firebase URLs
  if (isFirebaseStorageUrl(processedUrl)) {
    processedUrl = ensureFirebaseDownloadUrl(processedUrl);
  }
  
  // Validate final URL
  if (!isValidImageUrl(processedUrl)) {
    return fallbackUrl || getDefaultFallbackImage();
  }
  
  return processedUrl;
}

/**
 * Encodes image URL for safe use in query parameters
 * @param {string} url - The URL to encode
 * @returns {string} - Encoded URL safe for query params
 */
export function encodeImageUrlForWebhook(url) {
  if (!url) return '';
  
  try {
    // Process the URL first
    const processedUrl = processImageUrl(url);
    
    // Encode the complete URL
    const encoded = encodeURIComponent(processedUrl);
    
    console.log('Original URL:', url);
    console.log('Processed URL:', processedUrl);
    console.log('Encoded URL:', encoded);
    
    return encoded;
  } catch (error) {
    console.error('Error encoding image URL:', error.message);
    return encodeURIComponent(url);
  }
}

/**
 * Gets a default fallback image URL
 * @returns {string} - Default fallback image URL
 */
export function getDefaultFallbackImage() {
  // Use a reliable placeholder service or your own hosted fallback image
  return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80';
}

/**
 * Extracts the first valid image from product data
 * @param {Object} product - Product object
 * @returns {string} - First valid image URL
 */
export function getProductImageUrl(product) {
  if (!product) {
    console.log('⚠️ getProductImageUrl: No product provided, using fallback');
    return getDefaultFallbackImage();
  }
  
  console.log('🔍 getProductImageUrl: Analyzing product image sources:', {
    productId: product.id,
    productName: product.name,
    hasColorVariants: !!product.colorVariants,
    colorVariantsCount: product.colorVariants?.length || 0,
    colorVariant0Image0: product.colorVariants?.[0]?.images?.[0] || 'NONE',
    hasImages: !!product.images,
    imagesCount: product.images?.length || 0,
    images0: product.images?.[0] || 'NONE',
    hasImage: !!product.image,
    imageValue: product.image || 'NONE',
    hasImg: !!product.img,
    imgValue: product.img || 'NONE',
    hasImageUrl: !!product.imageUrl,
    imageUrlValue: product.imageUrl || 'NONE'
  });
  
  // Priority order for image sources
  const imageSources = [
    // Color variants (first variant, first image)
    { source: 'colorVariants[0].images[0]', url: product.colorVariants?.[0]?.images?.[0] },
    // Images array (first image)
    { source: 'images[0]', url: product.images?.[0] },
    // Single image properties
    { source: 'image', url: product.image },
    { source: 'img', url: product.img },
    { source: 'imageUrl', url: product.imageUrl }
  ];
  
  // Find first valid image
  for (let i = 0; i < imageSources.length; i++) {
    const { source, url } = imageSources[i];
    if (url && isValidImageUrl(url)) {
      const processedUrl = processImageUrl(url);
      console.log(`✅ getProductImageUrl: Using image from "${source}":`, processedUrl);
      return processedUrl;
    } else if (url) {
      console.log(`⚠️ getProductImageUrl: Invalid URL from "${source}":`, url);
    }
  }
  
  console.log('⚠️ getProductImageUrl: No valid image found, using fallback');
  return getDefaultFallbackImage();
}

/**
 * Validates and processes multiple image URLs
 * @param {Array<string>} urls - Array of image URLs
 * @returns {Array<string>} - Array of processed valid URLs
 */
export function processMultipleImageUrls(urls) {
  if (!Array.isArray(urls)) return [];
  
  return urls
    .map(url => processImageUrl(url))
    .filter(url => isValidImageUrl(url));
}
