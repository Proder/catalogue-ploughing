/**
 * Catalogue Ploughing - Google Apps Script Backend
 * Features: Authentication (Email + OTP), Pagination, Order Management
 */

// ========================================
// CONFIGURATION
// ========================================
const SPREADSHEET_ID = '1egReGRdpUZ6pcPeyGnnOc1zCMxlgxIos5zmuz5-OfyM';
const ORDERS_SHEET = 'Orders';
const CATEGORIES_SHEET = 'Categories';
const PRODUCTS_SHEET = 'Products';
const ALLOWED_USERS_SHEET = 'AllowedUsers';
const FRONTEND_URL = 'http://localhost:5174';  // Update with deployed URL

// Pagination defaults
const DEFAULT_PAGE_SIZE = 10;

// ========================================
// MAIN ENTRY POINTS
// ========================================

/**
 * Handle GET requests
 */
function doGet(e) {
  const action = e.parameter.action;
  let result;
  
  try {
    switch (action) {
      // Auth endpoints
      case 'checkEmail':
        result = checkEmailAccess(e.parameter.email);
        break;
      case 'verifyOTP':
        result = verifyOTP(e.parameter.email, e.parameter.otp);
        break;
      
      // Catalogue endpoints (with pagination)
      case 'getCategories':
        result = getCategories();
        break;
      case 'getProducts':
        result = getProducts(
          e.parameter.categoryId,
          parseInt(e.parameter.page) || 1,
          parseInt(e.parameter.limit) || DEFAULT_PAGE_SIZE
        );
        break;
      case 'getCatalogue':
        result = getCatalogue(); // Legacy - returns all products
        break;
      
      // Order endpoints
      case 'getOrder':
        result = getOrder(e.parameter.orderId);
        break;
      case 'getOrderByToken':
        result = getOrderByToken(e.parameter.token);
        break;
      
      case 'health':
        result = { success: true, message: 'API is running', version: '2.0' };
        break;
      default:
        result = { success: false, message: 'Unknown action' };
    }
  } catch (error) {
    result = { success: false, message: error.toString() };
  }
  
  return createJsonResponse(result);
}

/**
 * Handle POST requests
 */
function doPost(e) {
  let result;
  
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      // Auth endpoints
      case 'sendOTP':
        result = sendOTP(data.email);
        break;
      
      // Order endpoints
      case 'createOrder':
        result = createOrder(data.payload);
        break;
      case 'updateOrder':
        result = updateOrder(data.orderId, data.payload, data.editToken);
        break;
      
      default:
        result = { success: false, message: 'Unknown action' };
    }
  } catch (error) {
    result = { success: false, message: error.toString() };
  }
  
  return createJsonResponse(result);
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function generateEditToken() {
  return Utilities.getUuid();
}

// ========================================
// AUTHENTICATION FUNCTIONS
// ========================================

/**
 * Check if email is in AllowedUsers sheet
 */
function checkEmailAccess(email) {
  if (!email) {
    return { success: false, message: 'Email is required' };
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(ALLOWED_USERS_SHEET);
  
  if (!sheet) {
    // If AllowedUsers sheet doesn't exist, allow all (for backwards compatibility)
    Logger.log('AllowedUsers sheet not found - allowing all access');
    return { success: true, message: 'Access granted' };
  }
  
  const data = sheet.getDataRange().getValues();
  const normalizedEmail = email.toLowerCase().trim();
  
  for (let i = 1; i < data.length; i++) {
    const rowEmail = (data[i][0] || '').toString().toLowerCase().trim();
    const isActive = data[i][1] === true || data[i][1] === 'TRUE';
    
    if (rowEmail === normalizedEmail && isActive) {
      return { success: true, message: 'Email authorized' };
    }
  }
  
  return { 
    success: false, 
    message: 'This email is not authorized. Please contact the administrator.' 
  };
}

/**
 * Generate OTP, store in cache, and send email
 */
function sendOTP(email) {
  if (!email) {
    return { success: false, message: 'Email is required' };
  }
  
  // First check if email is authorized
  const authCheck = checkEmailAccess(email);
  if (!authCheck.success) {
    return authCheck;
  }
  
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store in cache for 5 minutes (300 seconds)
  const cache = CacheService.getScriptCache();
  cache.put(`otp_${email.toLowerCase()}`, otp, 300);
  
  // Send email
  try {
    MailApp.sendEmail({
      to: email,
      subject: 'Your Catalogue Access Code',
      htmlBody: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
            .container { max-width: 480px; margin: 0 auto; padding: 40px 20px; }
            .card { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .logo { color: #36656b; font-size: 24px; font-weight: bold; margin-bottom: 30px; }
            .title { font-size: 20px; color: #333; margin-bottom: 10px; }
            .subtitle { color: #666; margin-bottom: 30px; }
            .otp-box { 
              background: linear-gradient(135deg, #36656b 0%, #4a8a91 100%);
              color: white;
              font-size: 36px; 
              font-weight: bold; 
              letter-spacing: 12px; 
              padding: 24px 32px;
              text-align: center;
              border-radius: 12px;
              margin: 20px 0;
            }
            .note { color: #888; font-size: 14px; margin-top: 30px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="logo">🌿 Catalogue Ploughing</div>
              <div class="title">Your Access Code</div>
              <div class="subtitle">Enter this code to access the product catalogue</div>
              <div class="otp-box">${otp}</div>
              <div class="note">
                ⏱️ This code expires in 5 minutes<br>
                🔒 Don't share this code with anyone
              </div>
            </div>
            <div class="footer">
              If you didn't request this code, you can safely ignore this email.
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    return { success: true, message: 'Access code sent to your email' };
  } catch (error) {
    Logger.log('Failed to send OTP email: ' + error.toString());
    return { success: false, message: 'Failed to send email. Please try again.' };
  }
}

/**
 * Verify OTP from cache
 */
function verifyOTP(email, otp) {
  if (!email || !otp) {
    return { success: false, message: 'Email and code are required' };
  }
  
  const cache = CacheService.getScriptCache();
  const storedOTP = cache.get(`otp_${email.toLowerCase()}`);
  
  if (!storedOTP) {
    return { success: false, message: 'Code expired. Please request a new one.' };
  }
  
  if (storedOTP === otp.trim()) {
    // Remove OTP after successful verification (one-time use)
    cache.remove(`otp_${email.toLowerCase()}`);
    
    // Generate session token
    const sessionToken = generateSessionToken(email);
    
    return { 
      success: true, 
      message: 'Verified successfully',
      sessionToken: sessionToken,
      email: email
    };
  }
  
  return { success: false, message: 'Incorrect code. Please try again.' };
}

/**
 * Generate a session token (valid for 24 hours)
 */
function generateSessionToken(email) {
  const expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  const data = { email: email.toLowerCase(), expires: expires };
  return Utilities.base64Encode(JSON.stringify(data));
}

/**
 * Validate session token
 */
function validateSession(token) {
  try {
    const decoded = Utilities.newBlob(Utilities.base64Decode(token)).getDataAsString();
    const data = JSON.parse(decoded);
    
    if (Date.now() > data.expires) {
      return { valid: false, message: 'Session expired' };
    }
    
    return { valid: true, email: data.email };
  } catch (error) {
    return { valid: false, message: 'Invalid session' };
  }
}

// ========================================
// CATALOGUE FUNCTIONS
// ========================================

/**
 * Get categories only (without products)
 */
function getCategories() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const catSheet = ss.getSheetByName(CATEGORIES_SHEET);
  const catData = catSheet.getDataRange().getValues();
  catData.shift(); // Remove header
  
  const categories = catData
    .filter(row => row[0])
    .sort((a, b) => (a[2] || 0) - (b[2] || 0))
    .map(row => ({
      id: row[0],
      name: row[1]
    }));
  
  return { success: true, categories: categories };
}

/**
 * Get products with pagination
 */
function getProducts(categoryName, page, limit) {
  page = page || 1;
  limit = limit || DEFAULT_PAGE_SIZE;
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const prodSheet = ss.getSheetByName(PRODUCTS_SHEET);
  const prodData = prodSheet.getDataRange().getValues();
  prodData.shift(); // Remove header
  
  // Filter by category and active status
  const filtered = prodData.filter(row => {
    const productCategory = (row[1] || '').toString().trim();
    const isActive = row[8] === true || row[8] === 'TRUE';
    const matchesCategory = !categoryName || productCategory === categoryName;
    return matchesCategory && isActive && row[0]; // Has ID
  });
  
  // Calculate pagination
  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);
  const paginated = filtered.slice(startIndex, endIndex);
  
  // Map to product objects
  const products = paginated.map(row => ({
    id: row[0],
    name: row[2],
    description: row[5] || row[2],
    pricing2025: parseFloat(row[4]) || 0,
    imageUrl: row[3] || undefined,
    exampleUrl: row[6] || undefined,
    artworkTemplateUrl: row[7] || undefined,
    notes: row[5] || undefined
  }));
  
  return {
    success: true,
    products: products,
    pagination: {
      page: page,
      limit: limit,
      total: total,
      hasMore: endIndex < total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Get full catalogue (legacy - for backwards compatibility)
 */
function getCatalogue() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  const catSheet = ss.getSheetByName(CATEGORIES_SHEET);
  const catData = catSheet.getDataRange().getValues();
  catData.shift();
  
  const prodSheet = ss.getSheetByName(PRODUCTS_SHEET);
  const prodData = prodSheet.getDataRange().getValues();
  prodData.shift();
  
  const categories = catData
    .filter(row => row[0])
    .sort((a, b) => (a[2] || 0) - (b[2] || 0))
    .map(catRow => {
      const categoryId = catRow[0];
      const categoryName = catRow[1];
      
      const products = prodData
        .filter(prodRow => {
          const productCategory = (prodRow[1] || '').toString().trim();
          const isActive = prodRow[8] === true || prodRow[8] === 'TRUE';
          return productCategory === categoryName && isActive;
        })
        .map(prodRow => ({
          id: prodRow[0],
          name: prodRow[2],
          description: prodRow[5] || prodRow[2],
          pricing2025: parseFloat(prodRow[4]) || 0,
          imageUrl: prodRow[3] || undefined,
          exampleUrl: prodRow[6] || undefined,
          artworkTemplateUrl: prodRow[7] || undefined,
          notes: prodRow[5] || undefined
        }));
      
      return {
        id: categoryId,
        name: categoryName,
        products: products
      };
    });
  
  return { success: true, categories: categories };
}

// ========================================
// ORDER FUNCTIONS
// ========================================

function createOrder(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(ORDERS_SHEET);
  
  const orderId = 'ORD-' + Date.now();
  const editToken = generateEditToken();
  
  const row = [
    orderId,
    payload.timestamp || new Date().toISOString(),
    payload.userInfo.name,
    payload.userInfo.email,
    payload.userInfo.company || '',
    payload.userInfo.phone || '',
    payload.totals.subtotal,
    payload.totals.taxRate,
    payload.totals.taxAmount,
    payload.totals.grandTotal,
    'pending',
    JSON.stringify(payload.lineItems),
    editToken
  ];
  
  sheet.appendRow(row);
  
  try {
    sendOrderConfirmation(payload, orderId, editToken);
  } catch (emailError) {
    Logger.log('Failed to send order email: ' + emailError.toString());
  }
  
  return {
    success: true,
    orderId: orderId,
    editToken: editToken,
    message: 'Order created successfully'
  };
}

function getOrder(orderId) {
  if (!orderId) {
    return { success: false, order: null, message: 'OrderId is required' };
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(ORDERS_SHEET);
  const data = sheet.getDataRange().getValues();
  data.shift();
  
  const orderRow = data.find(row => row[0] === orderId);
  
  if (!orderRow) {
    return { success: false, order: null, message: 'Order not found' };
  }
  
  const order = {
    orderId: orderRow[0],
    userInfo: {
      name: orderRow[2],
      email: orderRow[3],
      company: orderRow[4] || undefined,
      phone: orderRow[5] || undefined
    },
    lineItems: JSON.parse(orderRow[11]),
    totals: {
      subtotal: orderRow[6],
      taxRate: orderRow[7],
      taxAmount: orderRow[8],
      grandTotal: orderRow[9]
    },
    timestamp: orderRow[1],
    status: orderRow[10],
    editToken: orderRow[12]
  };
  
  return { success: true, order: order };
}

function getOrderByToken(token) {
  if (!token) {
    return { success: false, order: null, message: 'Edit token is required' };
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(ORDERS_SHEET);
  const data = sheet.getDataRange().getValues();
  data.shift();
  
  const orderRow = data.find(row => row[12] === token);
  
  if (!orderRow) {
    return { success: false, order: null, message: 'Order not found or invalid edit link' };
  }
  
  const order = {
    orderId: orderRow[0],
    userInfo: {
      name: orderRow[2],
      email: orderRow[3],
      company: orderRow[4] || undefined,
      phone: orderRow[5] || undefined
    },
    lineItems: JSON.parse(orderRow[11]),
    totals: {
      subtotal: orderRow[6],
      taxRate: orderRow[7],
      taxAmount: orderRow[8],
      grandTotal: orderRow[9]
    },
    timestamp: orderRow[1],
    status: orderRow[10],
    editToken: orderRow[12]
  };
  
  return { success: true, order: order };
}

function updateOrder(orderId, payload, editToken) {
  if (!orderId) {
    return { success: false, message: 'OrderId is required' };
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(ORDERS_SHEET);
  const data = sheet.getDataRange().getValues();
  
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === orderId) {
      if (editToken && data[i][12] !== editToken) {
        return { success: false, message: 'Invalid edit token' };
      }
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) {
    return { success: false, message: 'Order not found' };
  }
  
  const existingEditToken = data[rowIndex - 1][12];
  
  const range = sheet.getRange(rowIndex, 1, 1, 13);
  range.setValues([[
    orderId,
    payload.timestamp || new Date().toISOString(),
    payload.userInfo.name,
    payload.userInfo.email,
    payload.userInfo.company || '',
    payload.userInfo.phone || '',
    payload.totals.subtotal,
    payload.totals.taxRate,
    payload.totals.taxAmount,
    payload.totals.grandTotal,
    'pending',
    JSON.stringify(payload.lineItems),
    existingEditToken
  ]]);
  
  try {
    sendUpdateConfirmation(payload, orderId, existingEditToken);
  } catch (emailError) {
    Logger.log('Failed to send update email: ' + emailError.toString());
  }
  
  return {
    success: true,
    orderId: orderId,
    message: 'Order updated successfully'
  };
}

// ========================================
// EMAIL FUNCTIONS
// ========================================

function sendOrderConfirmation(payload, orderId, editToken) {
  const email = payload.userInfo.email;
  const name = payload.userInfo.name;
  const editUrl = `${FRONTEND_URL}?edit=${editToken}`;
  
  let itemsHtml = '';
  payload.lineItems.forEach(item => {
    itemsHtml += `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${item.productName}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">€${item.unitPrice.toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;"><strong>€${item.lineTotal.toFixed(2)}</strong></td>
      </tr>
    `;
  });
  
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #36656b 0%, #4a8a91 100%); color: white; padding: 40px; text-align: center; border-radius: 16px 16px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: white; padding: 40px; border: 1px solid #e2e8f0; border-top: none; }
        .button { display: inline-block; padding: 14px 28px; background: #36656b; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
        .summary { background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f7fafc; padding: 12px; text-align: left; font-weight: 600; }
        .totals { text-align: right; margin-top: 20px; }
        .grand-total { font-size: 1.4em; color: #36656b; font-weight: bold; }
        .footer { text-align: center; color: #718096; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your order, ${name}</p>
        </div>
        
        <div class="content">
          <div class="summary">
            <strong>Order ID:</strong> ${orderId}<br>
            <strong>Date:</strong> ${new Date(payload.timestamp).toLocaleString()}
          </div>
          
          <h3 style="margin-top: 30px;">Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="totals">
            <p>Subtotal: €${payload.totals.subtotal.toFixed(2)}</p>
            <p>Tax (${(payload.totals.taxRate * 100).toFixed(0)}%): €${payload.totals.taxAmount.toFixed(2)}</p>
            <p class="grand-total">Grand Total: €${payload.totals.grandTotal.toFixed(2)}</p>
          </div>
          
          <div style="background: #FFF5E6; border-left: 4px solid #FFB84D; padding: 15px; margin: 30px 0; border-radius: 4px;">
            <strong>📝 Need to make changes?</strong><br>
            You can edit your order using the button below.
          </div>
          
          <center>
            <a href="${editUrl}" class="button">Edit Your Order</a>
          </center>
        </div>
        
        <div class="footer">
          <p>Catalogue Ploughing • This is an automated email</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  MailApp.sendEmail({
    to: email,
    subject: `Order Confirmation #${orderId} - Catalogue Ploughing`,
    htmlBody: htmlBody
  });
}

function sendUpdateConfirmation(payload, orderId, editToken) {
  const email = payload.userInfo.email;
  const name = payload.userInfo.name;
  const editUrl = `${FRONTEND_URL}?edit=${editToken}`;
  
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5;">
      <div style="max-width: 500px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #75b06f 0%, #5a9654 100%); color: white; padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
          <h1 style="margin: 0;">✓ Order Updated!</h1>
        </div>
        <div style="padding: 30px; background: white; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px;">
          <p>Hi ${name},</p>
          <p>Your order <strong>#${orderId}</strong> has been updated.</p>
          <p style="font-size: 1.2em;">New Total: <strong style="color: #36656b;">€${payload.totals.grandTotal.toFixed(2)}</strong></p>
          <p><a href="${editUrl}" style="color: #36656b;">View or edit your order</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  MailApp.sendEmail({
    to: email,
    subject: `Order Updated #${orderId} - Catalogue Ploughing`,
    htmlBody: htmlBody
  });
}
