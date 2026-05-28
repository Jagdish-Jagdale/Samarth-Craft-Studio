/**
 * WhatsApp Webhook Utilities
 * Handles WhatsApp API integration via Firebase Cloud Functions
 * Text-only mode — no image/media
 */

/**
 * Sends order confirmation via WhatsApp using Firebase Cloud Function
 * @param {Object} params - Order parameters
 * @param {Object} params.order - Order object
 * @param {string} params.customerPhone - Customer phone number
 * @returns {Promise<Object>} - Response from backend
 */
export async function sendOrderConfirmation({ order, customerPhone }) {
  console.log('📤 WHATSAPP ORDER CONFIRMATION - START');
  
  try {
    // Build payload — NO mediaUrl, text only
    const payload = {
      phone: customerPhone,
      order: {
        id: order.id,
        customerName: order.customerName || order.customer || 'Customer',
        total: order.total || 0,
        items: order.items || [],
        paymentMethod: order.paymentMethod || 'N/A',
        address: order.address || 'N/A'
      }
    };
    
    console.log('📦 Payload prepared');
    console.log('   Phone:', customerPhone);
    console.log('   Order ID:', order.id);
    console.log('   Items count:', order.items?.length || 0);
    
    // Call Firebase Cloud Function
    const functionUrl = 'https://us-central1-kolhapuri-chappals-56bdc.cloudfunctions.net/sendWhatsAppOrderConfirmation';
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload })
    });
    
    console.log('📡 Response status:', response.status);
    
    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error('❌ Failed to parse response JSON:', parseError.message);
      result = { success: false, error: 'Invalid response from server' };
    }
    
    if (result.success) {
      console.log('✅ WHATSAPP MESSAGE SENT SUCCESSFULLY!');
      console.log('   Phone:', result.phone || customerPhone);
      console.log('   Method:', result.method || 'N/A');
    } else {
      console.error('❌ WHATSAPP MESSAGE FAILED:', result.error || result.message);
    }
    
    console.log('📤 WHATSAPP ORDER CONFIRMATION - END');
    return result;
    
  } catch (error) {
    console.error('❌ CRITICAL ERROR in sendOrderConfirmation:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Calls the backend Firebase Cloud Function to request WhatsApp order cancellation confirmation
 * @param {Object} params
 * @param {string} params.orderId - The ID of the order to cancel
 * @param {string} params.phone - Customer's phone number
 * @param {string} params.customerName - Customer's name
 * @returns {Promise<Object>} - Response from the backend
 */
export async function requestWhatsAppOrderCancellation({ orderId, phone, customerName }) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📤 REQUEST WHATSAPP ORDER CANCELLATION - START');
  console.log('   Order ID:', orderId);
  console.log('   Phone:', phone);
  console.log('   Name:', customerName);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const functionUrl = 'https://requestwhatsappordercancellation-gc53j5bqka-uc.a.run.app';
    const payload = { orderId, phone, customerName };
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: payload })
    });
    
    console.log('📡 Response received, status:', response.status);
    
    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error('❌ Failed to parse response JSON:', parseError.message);
      result = {
        success: false,
        error: 'Invalid response from server'
      };
    }
    
    // Cloud Functions response structure has { data: ... } or raw json depending on v2 onCall vs onRequest.
    // For onRequest it's raw JSON. Let's handle both.
    const finalResult = result.data || result;
    console.log('📊 Final Result:', finalResult);
    
    return finalResult;
  } catch (error) {
    console.error('❌ CRITICAL ERROR in requestWhatsAppOrderCancellation:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}
