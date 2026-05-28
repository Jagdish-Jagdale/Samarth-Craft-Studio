/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onCall, HttpsError, onRequest} = require("firebase-functions/v2/https");
const Razorpay = require("razorpay");
const axios = require("axios");
const cors = require("cors")({origin: true});
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({maxInstances: 10});

const razorpay = new Razorpay({
  key_id: "rzp_live_SpK5TbUGSdvi0Q",
  key_secret: "9fpu3DtT1Xk500bCH4SgE8Y9",
});

exports.createRazorpayOrder = onCall(async (request) => {
  try {
    const data = request.data;
    if (!data || !data.amount) {
      throw new HttpsError(
          "invalid-argument",
          "The function must be called with an amount."
      );
    }

    const options = {
      amount: data.amount, // amount in smallest currency unit (paise)
      currency: data.currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new HttpsError("internal", error.message || "Failed to create order");
  }
});

/**
 * Send WhatsApp Order Confirmation via WhatAPI
 * Text-only mode — no image/media
 */
exports.sendWhatsAppOrderConfirmation = onRequest({cors: true}, async (req, res) => {
  console.log('📤 WHATSAPP ORDER CONFIRMATION');

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
    return;
  }

  res.set("Access-Control-Allow-Origin", "*");

  try {
    const data = req.body.data || req.body;

    if (!data || !data.phone || !data.order) {
      return res.status(400).json({ success: false, error: "Phone and order required" });
    }

    const {phone, order} = data;

    // Clean phone number
    let cleanPhone = String(phone).replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;
    console.log('📱 Phone:', cleanPhone);
    console.log('📦 Order ID:', order.id);

    // Build order details
    const customerName = String(order.customerName || "Customer").replace(/[,\n]/g, " ").trim();
    const orderId = String(order.id || "N/A").trim();
    const amount = String(order.total || 0);
    let productName = "Product";
    if (Array.isArray(order.items) && order.items.length > 0) {
      productName = String(order.items[0].name || "Product").replace(/[,\n]/g, " ").trim();
      if (order.items.length > 1) productName += ` +${order.items.length - 1} more`;
    }
    const paymentMethod = String(order.paymentMethod || "N/A").replace(/[,\n]/g, " ").trim();
    const address = String(order.address || "N/A").replace(/\n/g, " ").trim();

    // Webhook ID from .env
    const webhookId = "6a16bca56f1a8bf9dd614ae3";
    
    // Template format: ordcnfrm,name,ordid,total,products,paymethod,address
    const templateMessage = `ordcnfrm,${customerName},${orderId},${amount},${productName},${paymentMethod},${address}`;

    // ATTEMPT 1: Primary webhook with ordcnfrm template
    const url1 = `https://webhook.whatapi.in/webhook/${webhookId}?number=${cleanPhone}&message=${encodeURIComponent(templateMessage)}`;
    console.log(`🎯 Attempt 1: Webhook (${webhookId}) using template ordcnfrm`);
    try {
      const r1 = await axios.get(url1, { timeout: 15000, validateStatus: () => true });
      console.log('Response 1:', r1.status, JSON.stringify(r1.data));
      if (r1.status === 200) {
        return res.status(200).json({
          success: true,
          message: "WhatsApp order confirmation template sent",
          phone: cleanPhone,
          method: "ordcnfrm_template"
        });
      }
    } catch(e) { console.log('Attempt 1 failed:', e.message); }

    // ATTEMPT 2: Backup — try alternative template name ordercnfrm
    const backupTemplateMessage = `ordercnfrm,${customerName},${orderId},${amount},${productName},${paymentMethod},${address}`;
    const url2 = `https://webhook.whatapi.in/webhook/${webhookId}?number=${cleanPhone}&message=${encodeURIComponent(backupTemplateMessage)}`;
    console.log(`🎯 Attempt 2: Webhook (${webhookId}) using backup template ordercnfrm`);
    try {
      const r2 = await axios.get(url2, { timeout: 15000, validateStatus: () => true });
      console.log('Response 2:', r2.status, JSON.stringify(r2.data));
      if (r2.status === 200) {
        return res.status(200).json({
          success: true,
          message: "WhatsApp order confirmation template sent (backup)",
          phone: cleanPhone,
          method: "ordercnfrm_template"
        });
      }
    } catch(e) { console.log('Attempt 2 failed:', e.message); }

    return res.status(200).json({
      success: false,
      message: "All attempts failed — check WhatAPI webhook and template status",
      phone: cleanPhone
    });

  } catch (error) {
    console.error('CRITICAL ERROR:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Request WhatsApp Order Cancellation
 * Saves pending cancellation in Firestore and sends WhatAPI confirmation message
 */
exports.requestWhatsAppOrderCancellation = onRequest({cors: true}, async (req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
    return;
  }

  // Set response headers for CORS
  res.set("Access-Control-Allow-Origin", "*");

  try {
    const data = req.body.data || req.body;
    if (!data || !data.phone || !data.orderId) {
      return res.status(400).json({
        success: false,
        error: "Phone number and order ID are required",
      });
    }

    const { phone, orderId, customerName, amount } = data;
    console.log(`Cancellation requested for Phone: ${phone}, Order ID: ${orderId}, Amount: ${amount}`);

    // Clean phone number
    let cleanPhone = String(phone).replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;

    const formattedName = String(customerName || "Customer").replace(/,/g, " ").trim();
    const cleanOrderId = String(orderId).replace(/,/g, " ").trim();

    // 1. Record the pending cancellation in Firestore
    await db.collection("pending_cancellations").doc(cleanPhone).set({
      orderId: cleanOrderId,
      customerName: formattedName,
      amount: amount || 0,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // 2. Fire WhatsApp message via WhatAPI webhook
    const webhookId = "6a1692b96f1a8bf9dd60ef87";
    const messageText = `ordcancel,${formattedName},${cleanOrderId},yes,no`;
    const webhookUrl = `https://webhook.whatapi.in/webhook/${webhookId}?number=${cleanPhone}&message=${encodeURIComponent(messageText)}`;

    console.log(`Calling WhatAPI webhook for cancellation: ${webhookUrl}`);
    const response = await axios.get(webhookUrl, { timeout: 15000, validateStatus: () => true });
    console.log(`WhatAPI Response status: ${response.status}`, response.data);

    return res.status(200).json({
      data: {
        success: true,
        message: "Cancellation request WhatsApp sent",
        whatapiResponse: response.data
      }
    });

  } catch (error) {
    console.error("Error in requestWhatsAppOrderCancellation:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to process cancellation request"
    });
  }
});

/**
 * Webhook receiver for incoming WhatsApp messages/button clicks from WhatAPI
 * URL: https://whatsappincomingwebhook-gc53j5bqka-uc.a.run.app
 * Configure this URL in your WhatAPI account as the Reply Webhook / Incoming Webhook.
 */
exports.whatsappIncomingWebhook = onRequest({cors: true}, async (req, res) => {
  console.log('📥 ============ INCOMING WHATSAPP WEBHOOK ============');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers));
  console.log('Query params:', JSON.stringify(req.query));
  console.log('Raw body:', JSON.stringify(req.body));
  console.log('=====================================================');

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
    return;
  }

  // Set response headers for CORS
  res.set("Access-Control-Allow-Origin", "*");

  // Handle Webhook Verification (Challenge)
  if (req.method === "GET") {
    const challenge = req.query['hub.challenge'] || req.query.challenge || req.query.challange;
    if (challenge) {
      console.log(`✅ Webhook verified! Challenge: ${challenge}`);
      return res.status(200).send(challenge);
    }
    return res.status(200).send("Webhook is active and ready.");
  }

  try {
    let phone = "";
    let message = "";

    if (req.method === "POST") {
      const body = req.body || {};
      
      // 1. Meta / Cloud API Standard Structure
      if (body.object === "whatsapp_business_account" && body.entry && body.entry[0]) {
        const changeValue = body.entry[0].changes && body.entry[0].changes[0] && body.entry[0].changes[0].value;
        if (changeValue && changeValue.messages && changeValue.messages[0]) {
          const msg = changeValue.messages[0];
          phone = msg.from || (changeValue.contacts && changeValue.contacts[0] && changeValue.contacts[0].wa_id) || "";
          
          if (msg.type === "text" && msg.text) {
            message = msg.text.body || "";
          } else if (msg.type === "button" && msg.button) {
            message = msg.button.text || "";
          } else if (msg.type === "interactive" && msg.interactive) {
            message = (msg.interactive.button_reply && msg.interactive.button_reply.title) || 
                      (msg.interactive.list_reply && msg.interactive.list_reply.title) || "";
          }
        }
      }
      
      // 2. WhatAPI specific fields (fallback)
      if (!phone) {
        if (body.waNumber) phone = body.waNumber;
      else if (body.number) phone = body.number;
      else if (body.phone) phone = body.phone;
      else if (body.from) phone = body.from;
      else if (body.sender) phone = body.sender;
      else if (body.data && body.data.phone) phone = body.data.phone;
      else if (body.data && body.data.from) phone = body.data.from;
      else if (body.messages && body.messages[0]) {
        const msg = body.messages[0];
        phone = msg.from || msg.sender || (body.contacts && body.contacts[0] && body.contacts[0].wa_id) || "";
      }
      }
      
      // WhatAPI specific message fields
      if (!message) {
        if (body.reply) message = body.reply;
        else if (body.message) message = body.message;
        else if (body.text) message = body.text;
        else if (body.body) message = body.body;
        else if (body.buttonText) message = body.buttonText;
        else if (body.selectedOption) message = body.selectedOption;
        else if (body.data && body.data.message) message = body.data.message;
        else if (body.data && body.data.body) message = body.data.body;
        else if (body.messages && body.messages[0]) {
          const msg = body.messages[0];
          if (msg.text && typeof msg.text === 'object') {
            message = msg.text.body || "";
          } else if (msg.text) {
            message = msg.text;
          } else if (msg.body) {
            message = msg.body;
          } else if (msg.button && msg.button.text) {
            message = msg.button.text;
          } else if (msg.interactive && msg.interactive.button_reply) {
            message = msg.interactive.button_reply.title || msg.interactive.button_reply.id || "";
          }
        }
      }
    } else if (req.method === "GET") {
      // WhatAPI may also send GET requests
      phone = req.query.waNumber || req.query.number || req.query.phone || req.query.from || "";
      message = req.query.reply || req.query.message || req.query.msg || req.query.body || req.query.selectedOption || "";
    }

    // Clean phone number
    let cleanPhone = String(phone).replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;

    const lowerMessage = String(message).toLowerCase().trim();
    console.log(`✅ Parsed Phone: "${cleanPhone}", Message: "${lowerMessage}"`);
    console.log(`🔍 Original message before lowercasing: "${message}"`);
    console.log(`🔍 Message length: ${lowerMessage.length}`);
    console.log(`🔍 Message includes 'yes': ${lowerMessage.includes('yes')}`);
    console.log(`🔍 Message equals 'yes': ${lowerMessage === 'yes'}`);

    if (!cleanPhone) {
      console.warn("⚠️ No phone number found in request. Dumping all body keys:", Object.keys(req.body || {}));
      return res.status(400).json({ success: false, error: "Phone number not found in payload" });
    }

    // Look up pending cancellation request
    const pendingRef = db.collection("pending_cancellations").doc(cleanPhone);
    const pendingSnap = await pendingRef.get();

    if (!pendingSnap.exists) {
      console.log(`ℹ️ No pending cancellation found for phone ${cleanPhone}`);
      return res.status(200).json({ success: true, message: "No action taken (no pending cancellation)" });
    }

    const pendingData = pendingSnap.data();
    const orderId = pendingData.orderId;
    const customerName = pendingData.customerName || "Customer";
    console.log(`📋 Found pending cancellation for Order ID: ${orderId}, Customer: ${customerName}`);

    if (lowerMessage === "yes" || lowerMessage.includes("yes") || lowerMessage === "y" || 
        lowerMessage === "✅ yes" || lowerMessage.includes("✅") || 
        lowerMessage.includes("confirm") || lowerMessage.includes("cancel order")) {
      console.log(`🟢 User confirmed cancellation - Cancelling Order ID: ${orderId}`);
      console.log(`🟢 Matched message: "${lowerMessage}"`);
      
      // 1. Update order status in Firestore to Cancelled
      const orderRef = db.collection("orders").doc(orderId);
      await orderRef.update({
        orderStatus: 'Cancelled',
        status: 'Cancelled',
        cancelledAt: new Date().toISOString()
      });
      console.log(`✅ Firestore order ${orderId} status updated to Cancelled`);

      // 2. Delete the pending cancellation document
      await pendingRef.delete();
      console.log(`🗑️ Pending cancellation doc deleted for phone ${cleanPhone}`);

      // 3. Send "Order Cancelled Successfully" WhatsApp message
      const successMessage = `ordercancel,${customerName},${orderId}`;

      try {
        const successUrl = `https://webhook.whatapi.in/webhook/6a0ed0836f1a8bf9dd5ad2e3?number=${cleanPhone}&message=${encodeURIComponent(successMessage)}`;
        console.log(`📤 Sending cancellation success message`);
        const r = await axios.get(successUrl, { timeout: 12000, validateStatus: () => true });
        console.log(`📊 Response: ${r.status}`, JSON.stringify(r.data));
        if (r.status === 200) {
          console.log(`✅ Cancellation success message sent`);
        }
      } catch(e) {
        console.log(`❌ Cancellation success message failed:`, e.message);
      }

      return res.status(200).json({ success: true, message: "Order cancelled successfully", orderId });

    } else if (lowerMessage === "no" || lowerMessage.includes("no") || lowerMessage === "n" ||
               lowerMessage === "❌ no" || lowerMessage.includes("❌") ||
               lowerMessage.includes("keep order") || lowerMessage.includes("don't cancel")) {
      console.log(`🔴 User declined cancellation - Reverting Order ID: ${orderId} to Processing`);
      console.log(`🔴 Matched message: "${lowerMessage}"`);

      // Revert order status in Firestore
      const orderRef = db.collection("orders").doc(orderId);
      await orderRef.update({
        orderStatus: 'Processing',
        status: 'Processing'
      });

      // Delete the pending cancellation document
      await pendingRef.delete();

      console.log(`✅ Cancellation declined. Order ${orderId} reverted to Processing.`);

      return res.status(200).json({ success: true, message: "Cancellation request declined, order reverted to Processing", orderId });
    }

    console.log(`ℹ️ Message "${lowerMessage}" did not match expected patterns — no action taken`);
    console.log(`🔍 Available patterns: yes, y, ✅ yes, confirm, cancel order, no, n, ❌ no, keep order, don't cancel`);
    
    // Log the pending cancellation data for debugging
    console.log(`📋 Pending cancellation data:`, pendingData);
    
    return res.status(200).json({ 
      success: true, 
      message: "Message received, but did not match expected confirmation patterns",
      receivedMessage: lowerMessage,
      orderId: orderId,
      customerName: customerName,
      availablePatterns: ["yes", "y", "✅ yes", "confirm", "cancel order", "no", "n", "❌ no", "keep order", "don't cancel"]
    });

  } catch (error) {
    console.error("❌ Critical error in incoming webhook:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Manual trigger for testing order cancellation success message
 * This helps debug webhook issues
 */
exports.testOrderCancellationSuccess = onRequest({cors: true}, async (req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
    return;
  }

  res.set("Access-Control-Allow-Origin", "*");

  try {
    const data = req.body.data || req.body;
    const { phone = "918058516003", orderId = "SM-ORD-48790", customerName = "Palash Borgave" } = data;

    // Clean phone number
    let cleanPhone = String(phone).replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;

    console.log(`🧪 TESTING cancellation success message for Order: ${orderId}, Phone: ${cleanPhone}`);

    // Test multiple webhook approaches
    const results = [];

    // Approach 1: Original format
    try {
      const confirmWebhookId = "6a0ed0836f1a8bf9dd5ad2e3";
      const confirmMessage = `ordercancel,${customerName},${orderId}`;
      const confirmUrl = `https://webhook.whatapi.in/webhook/${confirmWebhookId}?number=${cleanPhone}&message=${encodeURIComponent(confirmMessage)}`;
      
      console.log(`📤 Testing original format: ${confirmUrl}`);
      const response1 = await axios.get(confirmUrl, { timeout: 15000, validateStatus: () => true });
      
      results.push({
        approach: "original_format",
        url: confirmUrl,
        status: response1.status,
        data: response1.data,
        success: response1.status === 200
      });
    } catch (error) {
      results.push({
        approach: "original_format",
        error: error.message,
        success: false
      });
    }

    // Approach 2: Simple message
    try {
      const confirmWebhookId = "6a0ed0836f1a8bf9dd5ad2e3";
      const simpleMessage = `Order ${orderId} has been cancelled successfully. Thank you!`;
      const simpleUrl = `https://webhook.whatapi.in/webhook/${confirmWebhookId}?number=${cleanPhone}&message=${encodeURIComponent(simpleMessage)}`;
      
      console.log(`📤 Testing simple message: ${simpleUrl}`);
      const response2 = await axios.get(simpleUrl, { timeout: 15000, validateStatus: () => true });
      
      results.push({
        approach: "simple_message",
        url: simpleUrl,
        status: response2.status,
        data: response2.data,
        success: response2.status === 200
      });
    } catch (error) {
      results.push({
        approach: "simple_message",
        error: error.message,
        success: false
      });
    }

    // Approach 3: Exact format from user's question
    try {
      const confirmWebhookId = "6a0ed0836f1a8bf9dd5ad2e3";
      const exactMessage = `ordercancel,name,orderno`;
      const exactUrl = `https://webhook.whatapi.in/webhook/${confirmWebhookId}?number=${cleanPhone}&message=${encodeURIComponent(exactMessage)}`;
      
      console.log(`📤 Testing exact format from question: ${exactUrl}`);
      const response3 = await axios.get(exactUrl, { timeout: 15000, validateStatus: () => true });
      
      results.push({
        approach: "exact_format",
        url: exactUrl,
        status: response3.status,
        data: response3.data,
        success: response3.status === 200
      });
    } catch (error) {
      results.push({
        approach: "exact_format",
        error: error.message,
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      message: "Test completed",
      results: results,
      summary: {
        total_attempts: results.length,
        successful_attempts: results.filter(r => r.success).length,
        failed_attempts: results.filter(r => !r.success).length
      }
    });

  } catch (error) {
    console.error("❌ Error in test function:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});