/**
 * Test Integration Script
 * Use this to test WhatsApp and image URL utilities
 */

import { 
  sendWhatsAppMessage,
  sendOrderConfirmation,
  sendProductInquiry,
  getProductImageUrl,
  processImageUrl,
  isValidImageUrl,
  encodeImageUrlForWebhook
} from './index';

/**
 * Test 1: Image URL Processing
 */
export async function testImageProcessing() {
  console.log('\n========================================');
  console.log('TEST 1: Image URL Processing');
  console.log('========================================\n');
  
  const testUrls = [
    // Firebase Storage URL
    'https://firebasestorage.googleapis.com/v0/b/project.appspot.com/o/images%2Fproduct.jpg?alt=media&token=abc123',
    // HTTP URL (should convert to HTTPS)
    'http://example.com/image.jpg',
    // Data URL
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    // Invalid URL
    'not-a-valid-url',
    // Missing URL
    null
  ];
  
  testUrls.forEach((url, index) => {
    console.log(`\nTest URL ${index + 1}:`);
    console.log('Input:', url);
    console.log('Is valid?', isValidImageUrl(url));
    console.log('Processed:', processImageUrl(url));
    console.log('Encoded:', encodeImageUrlForWebhook(url).substring(0, 100) + '...');
  });
  
  console.log('\n✅ Image processing tests completed\n');
}

/**
 * Test 2: Product Image Extraction
 */
export async function testProductImageExtraction() {
  console.log('\n========================================');
  console.log('TEST 2: Product Image Extraction');
  console.log('========================================\n');
  
  const testProducts = [
    // Product with color variants
    {
      name: 'Product with Color Variants',
      colorVariants: [
        {
          colorName: 'Red',
          images: ['https://example.com/red.jpg']
        }
      ]
    },
    // Product with images array
    {
      name: 'Product with Images Array',
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
    },
    // Product with single image
    {
      name: 'Product with Single Image',
      image: 'https://example.com/single.jpg'
    },
    // Product with no images
    {
      name: 'Product with No Images'
    }
  ];
  
  testProducts.forEach((product, index) => {
    console.log(`\nProduct ${index + 1}: ${product.name}`);
    const imageUrl = getProductImageUrl(product);
    console.log('Extracted image:', imageUrl);
  });
  
  console.log('\n✅ Product image extraction tests completed\n');
}

/**
 * Test 3: WhatsApp Message (Dry Run)
 */
export async function testWhatsAppDryRun() {
  console.log('\n========================================');
  console.log('TEST 3: WhatsApp Message (Dry Run)');
  console.log('========================================\n');
  
  const testMessage = {
    phone: '919876543210',
    message: 'Test message from Samartha Craft Studio',
    mediaUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'
  };
  
  console.log('Test message parameters:');
  console.log(JSON.stringify(testMessage, null, 2));
  
  console.log('\n⚠️  This is a dry run. To send actual message, call:');
  console.log('await sendWhatsAppMessage(testMessage);\n');
  
  console.log('✅ Dry run completed\n');
}

/**
 * Test 4: Send Actual WhatsApp Message
 * WARNING: This will send a real message!
 */
export async function testWhatsAppActual(phone) {
  console.log('\n========================================');
  console.log('TEST 4: Send Actual WhatsApp Message');
  console.log('========================================\n');
  
  if (!phone) {
    console.error('❌ Error: Phone number required');
    console.log('Usage: testWhatsAppActual("919876543210")');
    return;
  }
  
  console.log('⚠️  WARNING: This will send a real WhatsApp message!');
  console.log('Recipient:', phone);
  
  const result = await sendWhatsAppMessage({
    phone: phone,
    message: '🧪 Test message from Samartha Craft Studio\n\nThis is an automated test message.',
    mediaUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'
  });
  
  console.log('\nResult:', result);
  
  if (result.success) {
    console.log('✅ Message sent successfully!');
  } else {
    console.log('❌ Message failed:', result.error);
  }
}

/**
 * Test 5: Order Confirmation
 */
export async function testOrderConfirmation(phone) {
  console.log('\n========================================');
  console.log('TEST 5: Order Confirmation');
  console.log('========================================\n');
  
  if (!phone) {
    console.error('❌ Error: Phone number required');
    console.log('Usage: testOrderConfirmation("919876543210")');
    return;
  }
  
  const testOrder = {
    id: 'TEST-ORD-' + Date.now(),
    date: new Date().toLocaleDateString(),
    items: [
      { name: 'Test Product 1', quantity: 2, price: 1000 },
      { name: 'Test Product 2', quantity: 1, price: 2000 }
    ],
    total: 4000,
    paymentMethod: 'Test Payment',
    address: 'Test Address, Mumbai, India'
  };
  
  console.log('Test order:');
  console.log(JSON.stringify(testOrder, null, 2));
  
  console.log('\n⚠️  Sending order confirmation...');
  
  const result = await sendOrderConfirmation({
    order: testOrder,
    customerPhone: phone
  });
  
  console.log('\nResult:', result);
  
  if (result.success) {
    console.log('✅ Order confirmation sent successfully!');
  } else {
    console.log('❌ Order confirmation failed:', result.error);
  }
}

/**
 * Test 6: Product Inquiry
 */
export async function testProductInquiry(phone) {
  console.log('\n========================================');
  console.log('TEST 6: Product Inquiry');
  console.log('========================================\n');
  
  if (!phone) {
    console.error('❌ Error: Phone number required');
    console.log('Usage: testProductInquiry("919876543210")');
    return;
  }
  
  const testProduct = {
    id: 1,
    name: 'Test Kolhapuri Chappal',
    price: 1500,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80'
  };
  
  console.log('Test product:');
  console.log(JSON.stringify(testProduct, null, 2));
  
  console.log('\n⚠️  Sending product inquiry...');
  
  const result = await sendProductInquiry({
    product: testProduct,
    customerPhone: phone,
    customerName: 'Test Customer',
    inquiryMessage: 'I am interested in this product. Is it available?'
  });
  
  console.log('\nResult:', result);
  
  if (result.success) {
    console.log('✅ Product inquiry sent successfully!');
  } else {
    console.log('❌ Product inquiry failed:', result.error);
  }
}

/**
 * Run All Tests
 */
export async function runAllTests(phone = null) {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   WhatsApp Integration Test Suite     ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  // Test 1: Image Processing
  await testImageProcessing();
  
  // Test 2: Product Image Extraction
  await testProductImageExtraction();
  
  // Test 3: WhatsApp Dry Run
  await testWhatsAppDryRun();
  
  // If phone provided, run actual tests
  if (phone) {
    console.log('\n⚠️  Phone number provided. Running actual message tests...\n');
    
    // Test 4: Actual Message
    await testWhatsAppActual(phone);
    
    // Wait 2 seconds between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 5: Order Confirmation
    await testOrderConfirmation(phone);
    
    // Wait 2 seconds between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 6: Product Inquiry
    await testProductInquiry(phone);
  } else {
    console.log('\n💡 To run actual message tests, provide phone number:');
    console.log('runAllTests("919876543210")\n');
  }
  
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║      All Tests Completed! ✅           ║');
  console.log('╚════════════════════════════════════════╝\n');
}

/**
 * Quick Test - Run from browser console
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Import and run:
 * 
 * import { runAllTests } from './utils/test-integration';
 * runAllTests(); // Dry run only
 * 
 * // Or with actual phone number:
 * runAllTests('919876543210'); // Sends real messages!
 */

// Export for easy access
export default {
  testImageProcessing,
  testProductImageExtraction,
  testWhatsAppDryRun,
  testWhatsAppActual,
  testOrderConfirmation,
  testProductInquiry,
  runAllTests
};
