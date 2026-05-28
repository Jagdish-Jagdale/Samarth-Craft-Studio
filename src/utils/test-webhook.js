/**
 * WhatsApp Webhook Test Utility
 * Use this to test your webhook directly
 */

// Test webhook with your exact format
export function testWebhook() {
  const testData = {
    phone: '918058516003',
    customerName: 'Palash Borgave',
    orderId: 'SM-ORD-12345',
    amount: '2500',
    productName: 'Kolhapuri Chappal',
    paymentMethod: 'Cash on Delivery',
    address: 'Kolhapur Maharashtra'
  };

  // Build message in your format: ordcnfrm,name,orderid,amount,pname,paymethod,address
  const message = `ordcnfrm,${testData.customerName},${testData.orderId},${testData.amount},${testData.productName},${testData.paymentMethod},${testData.address}`;
  
  // Build webhook URL
  const webhookId = '6a16bca56f1a8bf9dd614ae3';
  const baseUrl = `https://webhook.whatapi.in/webhook/${webhookId}`;
  
  // Create URL with parameters
  const url = new URL(baseUrl);
  url.searchParams.set('number', testData.phone);
  url.searchParams.set('message', message);
  url.searchParams.set('medialink', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5_D8CPU_3jypCMI5hWPmpaNIwR42x1wIGvw&s');
  
  const finalUrl = url.toString();
  
  console.log('\n=== WhatsApp Webhook Test ===');
  console.log('Phone:', testData.phone);
  console.log('Message:', message);
  console.log('\nFull URL:', finalUrl);
  console.log('\nURL Length:', finalUrl.length);
  
  // Test Method 1: Fetch with no-cors
  console.log('\n--- Testing Method 1: Fetch (no-cors) ---');
  fetch(finalUrl, { mode: 'no-cors' })
    .then(() => {
      console.log('✅ Method 1: Request sent successfully');
    })
    .catch(err => {
      console.error('❌ Method 1 failed:', err.message);
    });
  
  // Test Method 2: Image fallback
  console.log('\n--- Testing Method 2: Image Fallback ---');
  try {
    const img = new Image();
    img.onload = () => console.log('✅ Method 2: Image loaded (webhook triggered)');
    img.onerror = () => console.log('⚠️ Method 2: Image error (but webhook may have triggered)');
    img.src = finalUrl;
    console.log('✅ Method 2: Image request initiated');
  } catch (err) {
    console.error('❌ Method 2 failed:', err.message);
  }
  
  return finalUrl;
}

// Run test when this file is imported
if (typeof window !== 'undefined') {
  console.log('WhatsApp Webhook Test Utility Loaded');
  console.log('Run testWebhook() in console to test');
  window.testWebhook = testWebhook;
}
