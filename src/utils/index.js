/**
 * Utilities Index
 * Central export point for all utility functions
 */

// Image utilities
export {
  isFirebaseStorageUrl,
  isValidImageUrl,
  ensureHttps,
  ensureFirebaseDownloadUrl,
  processImageUrl,
  encodeImageUrlForWebhook,
  getDefaultFallbackImage,
  getProductImageUrl,
  processMultipleImageUrls
} from './imageUtils';

// WhatsApp webhook utilities
export {
  buildWhatsAppWebhookUrl,
  sendWhatsAppMessage,
  sendOrderConfirmation,
  sendProductInquiry,
  sendCartReminder,
  updateWebhookConfig,
  getWebhookConfig
} from './whatsappWebhook';
