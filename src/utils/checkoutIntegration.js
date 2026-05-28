/**
 * Checkout Integration Example
 * Shows how to integrate WhatsApp notifications in the checkout flow
 */

import { sendOrderConfirmation, sendWhatsAppMessage } from './whatsappWebhook';
import { getProductImageUrl } from './imageUtils';

/**
 * Handles post-checkout WhatsApp notification
 * Call this after successful order placement
 * 
 * @param {Object} orderData - Complete order data
 * @returns {Promise<Object>} - Notification result
 */
export async function handleCheckoutNotification(orderData) {
  console.log('\n=== Handling Checkout Notification ===');
  
  try {
    // Extract customer phone from order
    const customerPhone = orderData.phone || orderData.customerPhone;
    
    if (!customerPhone) {
      console.warn('No customer phone number provided, skipping WhatsApp notification');
      return {
        success: false,
        error: 'No phone number provided'
      };
    }
    
    // Send order confirmation
    const result = await sendOrderConfirmation({
      order: orderData,
      customerPhone
    });
    
    if (result.success) {
      console.log('✅ Order confirmation sent successfully');
    } else {
      console.error('❌ Failed to send order confirmation:', result.error);
    }
    
    return result;
    
  } catch (error) {
    console.error('Error in checkout notification:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Sends a custom WhatsApp message with product image
 * Useful for product inquiries, support, etc.
 * 
 * @param {Object} params - Message parameters
 * @param {string} params.phone - Recipient phone number
 * @param {string} params.message - Message text
 * @param {Object} params.product - Optional product object for image
 * @returns {Promise<Object>} - Message result
 */
export async function sendCustomProductMessage({ phone, message, product = null }) {
  console.log('\n=== Sending Custom Product Message ===');
  
  try {
    let mediaUrl = null;
    
    // Get product image if product provided
    if (product) {
      mediaUrl = getProductImageUrl(product);
      console.log('Product image URL:', mediaUrl);
    }
    
    // Send message
    const result = await sendWhatsAppMessage({
      phone,
      message,
      mediaUrl
    });
    
    return result;
    
  } catch (error) {
    console.error('Error sending custom message:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Example: Send order confirmation after checkout
 * 
 * Usage in CheckoutPage.jsx:
 * 
 * import { handleCheckoutNotification } from '../utils/checkoutIntegration';
 * 
 * const handlePlaceOrder = async () => {
 *   // ... existing order creation logic ...
 *   
 *   const orderData = {
 *     id: orderId,
 *     date: new Date().toLocaleDateString(),
 *     items: cart,
 *     total: totalAmount,
 *     paymentMethod: paymentMethod,
 *     address: deliveryAddress,
 *     phone: phone,
 *     customerName: name
 *   };
 *   
 *   // Save order to Firestore
 *   await addOrder(orderData);
 *   
 *   // Send WhatsApp notification (non-blocking)
 *   handleCheckoutNotification(orderData).catch(err => {
 *     console.error('WhatsApp notification failed:', err);
 *     // Don't block checkout if WhatsApp fails
 *   });
 *   
 *   // Continue with success flow
 *   setOrderPlaced(true);
 * };
 */

/**
 * Example: Send product inquiry from product page
 * 
 * Usage in ProductPage.jsx:
 * 
 * import { sendProductInquiry } from '../utils/whatsappWebhook';
 * 
 * const handleInquiry = async () => {
 *   const result = await sendProductInquiry({
 *     product: matchedProduct,
 *     customerPhone: userPhone,
 *     customerName: userName,
 *     inquiryMessage: 'I am interested in this product'
 *   });
 *   
 *   if (result.success) {
 *     alert('Inquiry sent successfully!');
 *   } else {
 *     alert('Failed to send inquiry. Please try again.');
 *   }
 * };
 */

/**
 * Example: Test WhatsApp integration
 * 
 * Usage in Admin Panel or Dev Tools:
 * 
 * import { sendWhatsAppMessage } from '../utils/whatsappWebhook';
 * import { getProductImageUrl } from '../utils/imageUtils';
 * 
 * const testWhatsApp = async () => {
 *   const testProduct = {
 *     name: 'Test Product',
 *     price: 1000,
 *     image: 'https://firebasestorage.googleapis.com/...'
 *   };
 *   
 *   const result = await sendWhatsAppMessage({
 *     phone: '919876543210',
 *     message: 'Test message from Samartha Craft Studio',
 *     mediaUrl: getProductImageUrl(testProduct)
 *   });
 *   
 *   console.log('Test result:', result);
 * };
 */
