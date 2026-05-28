# Firebase Image URL & WhatsApp Webhook Utilities

Comprehensive utilities for handling Firebase Storage image URLs and WhatsApp webhook integration in your ecommerce application.

## 📁 Files

- **`imageUtils.js`** - Image URL validation, processing, and encoding
- **`whatsappWebhook.js`** - WhatsApp API integration with retry logic
- **`checkoutIntegration.js`** - Example integrations for checkout flow
- **`index.js`** - Central export point

## 🚀 Quick Start

### 1. Environment Setup

Add to your `.env` file:

```env
VITE_WHATSAPP_WEBHOOK_ID=your_webhook_id_here
```

### 2. Basic Usage

```javascript
import { 
  sendOrderConfirmation, 
  getProductImageUrl 
} from './utils';

// Send order confirmation with product image
const result = await sendOrderConfirmation({
  order: orderData,
  customerPhone: '919876543210'
});
```

## 📚 API Reference

### Image Utilities

#### `getProductImageUrl(product)`
Extracts and validates the first available image from a product object.

```javascript
import { getProductImageUrl } from './utils/imageUtils';

const imageUrl = getProductImageUrl(product);
// Returns: Processed, validated image URL
```

**Priority Order:**
1. Color variants (first variant, first image)
2. Images array (first image)
3. Single image properties (image, img, imageUrl)
4. Fallback image

#### `processImageUrl(url, fallbackUrl)`
Processes and validates an image URL.

```javascript
const processedUrl = processImageUrl(
  'http://example.com/image.jpg',
  'https://fallback.com/image.jpg'
);
// Returns: https://example.com/image.jpg (converted to HTTPS)
```

**Features:**
- Converts HTTP to HTTPS
- Adds `alt=media` to Firebase URLs
- Validates URL format
- Returns fallback if invalid

#### `encodeImageUrlForWebhook(url)`
Encodes image URL for safe use in query parameters.

```javascript
const encoded = encodeImageUrlForWebhook(
  'https://firebasestorage.googleapis.com/v0/b/project.appspot.com/o/image.jpg?alt=media&token=abc123'
);
// Returns: Fully encoded URL safe for query params
```

#### `isFirebaseStorageUrl(url)`
Checks if URL is a Firebase Storage URL.

```javascript
const isFirebase = isFirebaseStorageUrl(url);
// Returns: true/false
```

#### `isValidImageUrl(url)`
Validates if URL is a valid image URL.

```javascript
const isValid = isValidImageUrl(url);
// Returns: true/false
```

### WhatsApp Webhook Utilities

#### `sendWhatsAppMessage(params)`
Sends a WhatsApp message with optional media.

```javascript
import { sendWhatsAppMessage } from './utils/whatsappWebhook';

const result = await sendWhatsAppMessage({
  phone: '919876543210',
  message: 'Hello from Samartha!',
  mediaUrl: 'https://example.com/image.jpg'
});

if (result.success) {
  console.log('Message sent!');
} else {
  console.error('Failed:', result.error);
}
```

**Parameters:**
- `phone` (string, required) - Recipient phone number
- `message` (string, required) - Message text
- `mediaUrl` (string, optional) - Image/media URL
- `retryCount` (number, optional) - Current retry attempt

**Returns:**
```javascript
{
  success: true/false,
  data: {...},      // API response
  status: 200,      // HTTP status
  error: 'message', // Error message if failed
  retryCount: 0     // Number of retries attempted
}
```

**Features:**
- Automatic retry (3 attempts)
- 30-second timeout
- Phone number validation and formatting
- Automatic URL encoding
- Comprehensive error handling

#### `sendOrderConfirmation(params)`
Sends order confirmation with product image.

```javascript
import { sendOrderConfirmation } from './utils/whatsappWebhook';

const result = await sendOrderConfirmation({
  order: {
    id: 'ORD-123',
    date: '2026-05-26',
    items: [
      { name: 'Product 1', quantity: 2, price: 1000 }
    ],
    total: 2000,
    paymentMethod: 'COD',
    address: 'Mumbai, India'
  },
  customerPhone: '919876543210'
});
```

**Message Format:**
```
🎉 *Order Confirmed!*

Order ID: *ORD-123*
Date: 26/05/2026

📦 *Order Details:*
• Product 1 (Qty: 2) - ₹1000

💰 *Total Amount:* ₹2,000
💳 *Payment Method:* COD
📍 *Delivery Address:* Mumbai, India

Thank you for shopping with Samartha Craft Studio! 🙏

Track your order: https://yoursite.com/profile
```

#### `sendProductInquiry(params)`
Sends product inquiry message.

```javascript
import { sendProductInquiry } from './utils/whatsappWebhook';

const result = await sendProductInquiry({
  product: productObject,
  customerPhone: '919876543210',
  customerName: 'John Doe',
  inquiryMessage: 'Is this available in blue?'
});
```

#### `sendCartReminder(params)`
Sends cart abandonment reminder.

```javascript
import { sendCartReminder } from './utils/whatsappWebhook';

const result = await sendCartReminder({
  cartItems: [
    { name: 'Product 1', price: 1000, quantity: 1 }
  ],
  customerPhone: '919876543210',
  customerName: 'John Doe'
});
```

#### `buildWhatsAppWebhookUrl(params)`
Builds webhook URL with proper encoding (low-level function).

```javascript
import { buildWhatsAppWebhookUrl } from './utils/whatsappWebhook';

const url = buildWhatsAppWebhookUrl({
  phone: '919876543210',
  message: 'Hello!',
  mediaUrl: 'https://example.com/image.jpg',
  webhookId: 'custom_webhook_id' // optional
});
```

## 🔧 Integration Examples

### Checkout Page Integration

```javascript
// CheckoutPage.jsx
import { handleCheckoutNotification } from '../utils/checkoutIntegration';

const handlePlaceOrder = async () => {
  try {
    // Create order
    const orderData = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      items: cart,
      total: totalAmount,
      paymentMethod: paymentMethod,
      address: deliveryAddress,
      phone: phone,
      customerName: name
    };
    
    // Save to Firestore
    await addOrder(orderData);
    
    // Send WhatsApp notification (non-blocking)
    handleCheckoutNotification(orderData).catch(err => {
      console.error('WhatsApp notification failed:', err);
      // Don't block checkout if WhatsApp fails
    });
    
    // Show success
    setOrderPlaced(true);
    
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Order placement failed');
  }
};
```

### Product Page Integration

```javascript
// ProductPage.jsx
import { sendProductInquiry } from '../utils/whatsappWebhook';

const handleInquiry = async () => {
  const result = await sendProductInquiry({
    product: matchedProduct,
    customerPhone: userPhone,
    customerName: userName,
    inquiryMessage: inquiryText
  });
  
  if (result.success) {
    alert('Inquiry sent successfully! We will contact you soon.');
  } else {
    alert('Failed to send inquiry. Please try again or call us.');
  }
};
```

### Admin Panel - Test Integration

```javascript
// AdminPage.jsx
import { sendWhatsAppMessage, getProductImageUrl } from '../utils';

const testWhatsAppIntegration = async () => {
  const testProduct = products[0]; // First product
  
  const result = await sendWhatsAppMessage({
    phone: '919876543210', // Your test number
    message: '🧪 Test message from Samartha Craft Studio Admin Panel',
    mediaUrl: getProductImageUrl(testProduct)
  });
  
  if (result.success) {
    alert('✅ WhatsApp integration working!');
  } else {
    alert(`❌ Test failed: ${result.error}`);
  }
};
```

## 🛠️ Configuration

### Update Webhook Configuration

```javascript
import { updateWebhookConfig } from './utils/whatsappWebhook';

updateWebhookConfig({
  webhookId: 'new_webhook_id',
  maxRetries: 5,
  retryDelay: 3000,
  timeout: 60000
});
```

### Get Current Configuration

```javascript
import { getWebhookConfig } from './utils/whatsappWebhook';

const config = getWebhookConfig();
console.log('Current config:', config);
```

## 🔍 Debugging

### Enable Detailed Logs

All functions include comprehensive console logging:

```javascript
// Logs will show:
// - Input parameters
// - URL processing steps
// - Encoding results
// - API requests/responses
// - Retry attempts
// - Error details
```

### Test Image URL Processing

```javascript
import { processImageUrl, isValidImageUrl } from './utils/imageUtils';

const testUrl = 'http://firebasestorage.googleapis.com/...';

console.log('Is valid?', isValidImageUrl(testUrl));
console.log('Processed:', processImageUrl(testUrl));
```

## ⚠️ Error Handling

All functions return structured error responses:

```javascript
{
  success: false,
  error: 'Error message',
  retryCount: 2 // If retries were attempted
}
```

**Best Practice:**
```javascript
const result = await sendWhatsAppMessage({...});

if (!result.success) {
  // Log error for debugging
  console.error('WhatsApp failed:', result.error);
  
  // Show user-friendly message
  alert('Unable to send notification. Your order is confirmed.');
  
  // Optional: Send to error tracking service
  // trackError('whatsapp_failed', result.error);
}
```

## 📝 Phone Number Format

**Supported Formats:**
- `9876543210` (10 digits, auto-adds +91)
- `919876543210` (with country code)
- `+91 98765 43210` (formatted, auto-cleaned)
- `+91-9876543210` (with dashes, auto-cleaned)

**Auto-formatting:**
- Removes all non-digit characters
- Adds country code if missing (defaults to +91 for India)
- Validates length (10-15 digits)

## 🔒 Security Best Practices

1. **Never expose webhook ID in client code**
   ```javascript
   // ❌ Bad
   const webhookId = 'abc123';
   
   // ✅ Good
   const webhookId = process.env.VITE_WHATSAPP_WEBHOOK_ID;
   ```

2. **Validate phone numbers**
   - All functions automatically validate
   - Invalid numbers are rejected before API call

3. **Handle errors gracefully**
   - Don't block user flow if WhatsApp fails
   - Log errors for debugging
   - Show user-friendly messages

4. **Rate limiting**
   - Implement client-side rate limiting
   - Don't spam users with messages

## 🧪 Testing

### Test Checklist

- [ ] Test with Firebase Storage URLs
- [ ] Test with regular HTTPS URLs
- [ ] Test with HTTP URLs (should convert to HTTPS)
- [ ] Test with data URLs (base64)
- [ ] Test with invalid URLs (should use fallback)
- [ ] Test with missing images (should use fallback)
- [ ] Test phone number validation
- [ ] Test retry mechanism (simulate failure)
- [ ] Test timeout handling
- [ ] Test with different product structures

### Test Script

```javascript
// test-whatsapp.js
import { 
  sendWhatsAppMessage, 
  getProductImageUrl 
} from './utils';

async function runTests() {
  const testProduct = {
    name: 'Test Product',
    price: 1000,
    image: 'https://firebasestorage.googleapis.com/...'
  };
  
  console.log('Testing image URL extraction...');
  const imageUrl = getProductImageUrl(testProduct);
  console.log('Image URL:', imageUrl);
  
  console.log('\nTesting WhatsApp message...');
  const result = await sendWhatsAppMessage({
    phone: '919876543210',
    message: 'Test message',
    mediaUrl: imageUrl
  });
  
  console.log('Result:', result);
}

runTests();
```

## 📞 Support

For issues or questions:
1. Check console logs for detailed error messages
2. Verify webhook ID is correct
3. Test with a simple message first (no media)
4. Ensure Firebase URLs are publicly accessible
5. Check phone number format

## 🔄 Updates

**Version 1.0.0** (Current)
- Initial release
- Firebase URL handling
- WhatsApp webhook integration
- Retry mechanism
- Comprehensive error handling
- Multiple message types
