/**
 * Catalogue Order Portal - Google Apps Script Backend
 * Handles order creation, retrieval, catalogue management, and email notifications
 */

// ========================================
// CONFIGURATION - UPDATE THIS!
// ========================================
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';  // Replace with your actual Spreadsheet ID
const ORDERS_SHEET = 'Orders';
const CATEGORIES_SHEET = 'Categories';
const PRODUCTS_SHEET = 'Products';
const ALLOWED_USERS_SHEET = 'AllowedUsers';  // For authentication
const FRONTEND_URL = 'http://localhost:5174';  // Update with your deployed frontend URL


// ========================================
// MAIN ENTRY POINTS
// ========================================

/**
 * Handle GET requests
 * Endpoints: Auth, Catalogue, Orders, Health
 */
function doGet(e) {
  const action = e.parameter.action;
  let result;
  
  try {
    switch (action) {
      // Authentication endpoints
      case 'checkEmail':
        result = checkEmailAccess(e.parameter.email);
        break;
      case 'verifyOTP':
        result = verifyOTP(e.parameter.email, e.parameter.otp);
        break;
      
      // Catalogue endpoints
      case 'getCategories':
        result = getCategoriesOnly();
        break;
      case 'getProductsByCategory':
        result = getProductsByCategory(e.parameter.categoryId);
        break;
      case 'getCatalogue':
        result = getCatalogue();
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
        result = { success: false, message: 'Unknown action. Use ?action=health to test' };
    }
  } catch (error) {
    result = { success: false, message: error.toString() };
  }
  
  return createJsonResponse(result);
}

/**
 * Handle POST requests
 * Endpoints: Auth, Orders
 */
function doPost(e) {
  let result;
  
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      // Authentication endpoint
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

/**
 * Create JSON response with proper content type
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Generate a secure random edit token
 */
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
              <div class="logo">📦 Catalogue Ploughing</div>
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
// CATALOGUE OPERATIONS
// ========================================

/**
 * Get catalogue data (categories with products)
 * NEW: Supports updated product structure with Code, Pricing2025, Images
 */
function getCatalogue() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Get categories
  const catSheet = ss.getSheetByName(CATEGORIES_SHEET);
  const catData = catSheet.getDataRange().getValues();
  const catHeaders = catData.shift(); // Remove header row
  
  // Get products
  const prodSheet = ss.getSheetByName(PRODUCTS_SHEET);
  const prodData = prodSheet.getDataRange().getValues();
  const prodHeaders = prodData.shift(); // Remove header row
  
  // Build categories with products
  // Products sheet columns: A=Code, B=Category, C=Item, D=Size, E=ImageUrl, F=Pricing2025, G=Notes, H=ExampleUrl, I=ArtworkTemplateUrl, J=Active, K=Supplier
  const categories = catData
    .filter(row => row[0]) // Skip empty rows
    .sort((a, b) => a[2] - b[2]) // Sort by SortOrder
    .map(catRow => {
      const categoryId = catRow[0];
      const categoryName = catRow[1];
      
      // Find products that match this category name (column B)
      const products = prodData
        .filter(prodRow => {
          const productCategory = prodRow[1] ? prodRow[1].trim() : '';
          // Handle Active column - could be boolean TRUE or string "TRUE"
          const activeValue = prodRow[9];
          const isActive = activeValue === true || activeValue === 'TRUE' || activeValue === 'true';
          
          // Debug logging
          Logger.log('Product: ' + prodRow[0] + ', Category: "' + productCategory + '", Active: ' + activeValue + ' (type: ' + typeof activeValue + '), Match: ' + (productCategory === categoryName && isActive));
          
          return productCategory === categoryName && isActive;
        })
        .map(prodRow => ({
          id: prodRow[0],                    // Code (A column)
          name: prodRow[2],                  // Item name (C column)
          description: prodRow[6] || prodRow[2], // Notes or Item name as fallback
          pricing2025: parseFloat(prodRow[5]) || 0,  // Pricing2025 (F column)
          imageUrl: prodRow[4] || undefined,       // ImageUrl (E column)
          exampleUrl: prodRow[7] || undefined,     // ExampleUrl (H column)
          artworkTemplateUrl: prodRow[8] || undefined, // ArtworkTemplateUrl (I column)
          notes: prodRow[6] || undefined,       // Notes (G column)
          size: prodRow[3] || undefined,        // Size (D column) - hidden from user
          supplier: prodRow[10] || undefined    // Supplier (K column) - hidden from user
        }));
      
      Logger.log('Category: ' + categoryName + ', Products found: ' + products.length);
      
      return {
        id: categoryId,
        name: categoryName,
        products: products
      };
    });
  
  return { success: true, categories: categories };
}

/**
 * Get categories only (without products) - OPTIMIZED for fast loading
 */
function getCategoriesOnly() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const catSheet = ss.getSheetByName(CATEGORIES_SHEET);
  const catData = catSheet.getDataRange().getValues();
  const catHeaders = catData.shift(); // Remove header row
  
  // Return only category metadata (no products)
  const categories = catData
    .filter(row => row[0]) // Skip empty rows
    .sort((a, b) => a[2] - b[2]) // Sort by SortOrder
    .map(catRow => ({
      id: catRow[0],
      name: catRow[1],
      sortOrder: catRow[2]
    }));
  
  return { success: true, categories: categories };
}

/**
 * Get products for a specific category - OPTIMIZED for on-demand loading
 */
function getProductsByCategory(categoryId) {
  if (!categoryId) {
    return { success: false, products: [], message: 'Category ID is required' };
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Get category info
  const catSheet = ss.getSheetByName(CATEGORIES_SHEET);
  const catData = catSheet.getDataRange().getValues();
  const catHeaders = catData.shift();
  
  // Find the category
  const categoryRow = catData.find(row => row[0] === categoryId);
  if (!categoryRow) {
    return { success: false, products: [], message: 'Category not found' };
  }
  
  const categoryName = categoryRow[1];
  
  // Get products
  const prodSheet = ss.getSheetByName(PRODUCTS_SHEET);
  const prodData = prodSheet.getDataRange().getValues();
  const prodHeaders = prodData.shift();
  
  // Filter products for this category
  const products = prodData
    .filter(prodRow => {
      const productCategory = prodRow[1] ? prodRow[1].trim() : '';
      const activeValue = prodRow[9];
      const isActive = activeValue === true || activeValue === 'TRUE' || activeValue === 'true';
      return productCategory === categoryName && isActive;
    })
    .map(prodRow => ({
      id: prodRow[0],                    // Code (A column)
      name: prodRow[2],                  // Item name (C column)
      description: prodRow[6] || '', // Notes or Item name as fallback
      pricing2025: parseFloat(prodRow[5]) || 0,  // Pricing2025 (F column)
      imageUrl: prodRow[4] || undefined,       // ImageUrl (E column)
      exampleUrl: prodRow[7] || undefined,     // ExampleUrl (H column)
      artworkTemplateUrl: prodRow[8] || undefined, // ArtworkTemplateUrl (I column)
      notes: prodRow[6] || undefined,       // Notes (G column)
      size: prodRow[3] || undefined,        // Size (D column)
      supplier: prodRow[10] || undefined    // Supplier (K column)
    }));
  
  return { 
    success: true, 
    categoryId: categoryId,
    categoryName: categoryName,
    products: products 
  };
}


// ========================================
// ORDER OPERATIONS
// ========================================

/**
 * Create a new order
 */
function createOrder(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(ORDERS_SHEET);
  
  // Generate order ID and edit token
  const orderId = 'ORD-' + Date.now();
  const editToken = generateEditToken();
  
  // Format timestamp for Ireland timezone
  const timestamp = payload.timestamp || new Date().toISOString();
  const irelandDate = new Date(timestamp).toLocaleString('en-IE', { timeZone: 'Europe/Dublin' });
  
  // Prepare row data - simplified to just total (10 columns including EditToken)
  const row = [
    orderId,
    irelandDate,
    payload.userInfo.name,
    payload.userInfo.email,
    payload.userInfo.company || '',
    payload.userInfo.phone || '',
    payload.totals.total,
    'pending',
    JSON.stringify(payload.lineItems),
    editToken  // Column J - EditToken
  ];
  
  sheet.appendRow(row);
  
  // Add order to OrderDetails sheet
  try {
    addOrderToDetailsSheet(payload, orderId);
  } catch (detailsError) {
    Logger.log('Failed to add to OrderDetails sheet: ' + detailsError.toString());
  }
  
  // Update SupplierSummary sheet
  try {
    updateSupplierSummarySheet();
  } catch (summaryError) {
    Logger.log('Failed to update SupplierSummary sheet: ' + summaryError.toString());
  }
  
  // Send confirmation email
  try {
    sendOrderConfirmation(payload, orderId, editToken);
  } catch (emailError) {
    Logger.log('Failed to send email: ' + emailError.toString());
    // Don't fail the order creation if email fails
  }
  
  return {
    success: true,
    orderId: orderId,
    editToken: editToken,
    message: 'Order created successfully. Confirmation email sent.'
  };
}

/**
 * Get an existing order by ID
 */
function getOrder(orderId) {
  if (!orderId) {
    return { success: false, order: null, message: 'OrderId is required' };
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(ORDERS_SHEET);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // Remove header row
  
  // Find order row
  const orderRow = data.find(row => row[0] === orderId);
  
  if (!orderRow) {
    return { success: false, order: null, message: 'Order not found' };
  }
  
  // Reconstruct order payload
  const order = {
    orderId: orderRow[0],
    userInfo: {
      name: orderRow[2],
      email: orderRow[3],
      company: orderRow[4] || undefined,
      phone: orderRow[5] || undefined
    },
    lineItems: JSON.parse(orderRow[8]),
    totals: {
      total: orderRow[6]
    },
    timestamp: orderRow[1],
    status: orderRow[7],
    editToken: orderRow[9]  // Column J
  };
  
  return { success: true, order: order };
}

/**
 * Get an existing order by edit token
 */
function getOrderByToken(token) {
  if (!token) {
    return { success: false, order: null, message: 'Edit token is required' };
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(ORDERS_SHEET);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // Remove header row
  
  // Find order row by edit token (column J)
  const orderRow = data.find(row => row[9] === token);
  
  if (!orderRow) {
    return { success: false, order: null, message: 'Order not found or invalid edit link' };
  }
  
  // Reconstruct order payload
  const order = {
    orderId: orderRow[0],
    userInfo: {
      name: orderRow[2],
      email: orderRow[3],
      company: orderRow[4] || undefined,
      phone: orderRow[5] || undefined
    },
    lineItems: JSON.parse(orderRow[8]),
    totals: {
      total: orderRow[6]
    },
    timestamp: orderRow[1],
    status: orderRow[7],
    editToken: orderRow[9]
  };
  
  return { success: true, order: order };
}

/**
 * Update an existing order
 */
function updateOrder(orderId, payload, editToken) {
  if (!orderId) {
    return { success: false, message: 'OrderId is required' };
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(ORDERS_SHEET);
  const data = sheet.getDataRange().getValues();
  
  // Find order row index (1-indexed in Sheets)
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === orderId) {
      // Verify edit token if provided (column J)
      if (editToken && data[i][9] !== editToken) {
        return { success: false, message: 'Invalid edit token' };
      }
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) {
    return { success: false, message: 'Order not found' };
  }
  
  // Keep the existing edit token
  const existingEditToken = data[rowIndex - 1][9];
  
  // Format timestamp for Ireland timezone
  const timestamp = payload.timestamp || new Date().toISOString();
  const irelandDate = new Date(timestamp).toLocaleString('en-IE', { timeZone: 'Europe/Dublin' });
  
  // Update row data (10 columns including EditToken)
  const range = sheet.getRange(rowIndex, 1, 1, 10);
  range.setValues([[
    orderId,
    irelandDate,
    payload.userInfo.name,
    payload.userInfo.email,
    payload.userInfo.company || '',
    payload.userInfo.phone || '',
    payload.totals.total,
    'pending',
    JSON.stringify(payload.lineItems),
    existingEditToken  // Keep the same edit token
  ]]);
  
  // Update OrderDetails sheet
  try {
    updateOrderInDetailsSheet(payload, orderId);
  } catch (detailsError) {
    Logger.log('Failed to update OrderDetails sheet: ' + detailsError.toString());
  }
  
  // Update SupplierSummary sheet
  try {
    updateSupplierSummarySheet();
  } catch (summaryError) {
    Logger.log('Failed to update SupplierSummary sheet: ' + summaryError.toString());
  }
  
  // Send update confirmation email
  try {
    sendUpdateConfirmation(payload, orderId, existingEditToken);
  } catch (emailError) {
    Logger.log('Failed to send update email: ' + emailError.toString());
  }
  
  return {
    success: true,
    orderId: orderId,
    message: 'Order updated successfully. Confirmation email sent.'
  };
}


// ========================================
// EMAIL FUNCTIONS
// ========================================

/**
 * Send order confirmation email with edit link
 */
function sendOrderConfirmation(payload, orderId, editToken) {
  const email = payload.userInfo.email;
  const name = payload.userInfo.name;
  const editUrl = `${FRONTEND_URL}?edit=${editToken}`;
  
  // Build line items HTML
  let itemsHtml = '';
  payload.lineItems.forEach(item => {
    itemsHtml += `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; word-wrap: break-word;">${item.productName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; word-wrap: break-word;">${item.size}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">€${item.unitPrice.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;"><strong>€${item.lineTotal.toFixed(2)}</strong></td>
      </tr>
    `;
  });
  
  // Email HTML template
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e2e8f0; }
        .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .summary { background: #f7fafc; padding: 15px; border-radius: 6px; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; table-layout: fixed; }
        th { background: #f7fafc; padding: 10px; text-align: left; font-weight: 600; border-bottom: 2px solid #e2e8f0; word-wrap: break-word; }
        td { word-wrap: break-word; overflow-wrap: break-word; }
        .totals { text-align: right; margin-top: 20px; }
        .grand-total { font-size: 1.2em; color: #667eea; font-weight: bold; }
        .footer { text-align: center; color: #718096; font-size: 0.9em; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">✓ Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0;">Thank you for your order, ${name}</p>
        </div>
        
        <div class="content">
          <p>Your order has been received and is being processed. Here are your order details:</p>
          
          <div class="summary">
            <strong>Order ID:</strong> ${orderId}<br>
            <strong>Date:</strong> ${new Date(payload.timestamp).toLocaleString('en-IE', { timeZone: 'Europe/Dublin' })}<br>
            <strong>Email:</strong> ${email}
          </div>
          
          <h3>Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
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
            <p class="grand-total">Total: €${payload.totals.total.toFixed(2)}</p>
          </div>
          
          <div style="background: #FFF5E6; border-left: 4px solid #FFB84D; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <strong>📝 Need to make changes?</strong><br>
            You can edit your order anytime using the link below:
          </div>
          
          <center>
            <a href="${editUrl}" class="button">Edit Your Order</a>
          </center>
          
          <p style="font-size: 0.9em; color: #718096; margin-top: 20px;">
            Save this email for your records. The edit link will allow you to modify your order details at any time.
          </p>
        </div>
        
        <div class="footer">
          <p>This is an automated email from Catalogue Order Portal.</p>
          <p>If you have any questions, please reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Plain text version
  const plainBody = `
Order Confirmed!

Thank you for your order, ${name}

Order ID: ${orderId}
Date: ${new Date(payload.timestamp).toLocaleString()}

Order Items:
${payload.lineItems.map(item => `- ${item.productName} (${item.size}) x${item.quantity} = €${item.lineTotal.toFixed(2)}`).join('\n')}

Total: €${payload.totals.total.toFixed(2)}

Edit your order: ${editUrl}
  `;
  
  MailApp.sendEmail({
    to: email,
    subject: `Order Confirmation #${orderId}`,
    body: plainBody,
    htmlBody: htmlBody
  });
}

/**
 * Send order update confirmation email
 */
function sendUpdateConfirmation(payload, orderId, editToken) {
  const email = payload.userInfo.email;
  const name = payload.userInfo.name;
  const editUrl = `${FRONTEND_URL}?edit=${editToken}`;
  
  // Simplified update email
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #48bb78; color: white; padding: 30px; text-align: center; border-radius: 8px;">
          <h1 style="margin: 0;">✓ Order Updated!</h1>
        </div>
        <div style="padding: 30px; background: white; border: 1px solid #e2e8f0;">
          <p>Hi ${name},</p>
          <p>Your order <strong>#${orderId}</strong> has been successfully updated.</p>
          <p>Total: <strong style="color: #667eea; font-size: 1.2em;">€${payload.totals.total.toFixed(2)}</strong></p>
          <p>You can view or edit your order again: <a href="${editUrl}">Edit Order</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  MailApp.sendEmail({
    to: email,
    subject: `Order Updated #${orderId}`,
    htmlBody: htmlBody
  });
}


// ========================================
// ORDER DETAILS SHEET FORMATTING
// ========================================

/**
 * Create or get the OrderDetails sheet
 */
function getOrCreateOrderDetailsSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let detailsSheet = ss.getSheetByName('OrderDetails');
  
  if (!detailsSheet) {
    detailsSheet = ss.insertSheet('OrderDetails');
    
    // Set up headers
    const headers = [
      'Order ID',
      'Order Date',
      'Customer Name',
      'Email',
      'Company',
      'Phone',
      'Category Name',
      'Product ID',
      'Product Name',
      'Size',
      'Supplier',
      'Unit Price',
      'Quantity'
    ];
    
    const headerRange = detailsSheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#667eea');
    headerRange.setFontColor('#ffffff');
    
    // Freeze header row
    detailsSheet.setFrozenRows(1);
    
    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
      detailsSheet.autoResizeColumn(i);
    }
  }
  
  return detailsSheet;
}

/**
 * Add order line items to OrderDetails sheet
 * This is called automatically when an order is created
 */
function addOrderToDetailsSheet(orderData, orderId) {
  const detailsSheet = getOrCreateOrderDetailsSheet();
  const lineItems = orderData.lineItems;
  
  // Prepare rows for each line item
  const rows = lineItems.map(item => [
    orderId,
    orderData.timestamp || new Date().toISOString(),
    orderData.userInfo.name,
    orderData.userInfo.email,
    orderData.userInfo.company || '',
    orderData.userInfo.phone || '',
    item.categoryName || '',
    item.productId || '',
    item.productName,
    item.size || '',
    item.supplier || '',
    item.unitPrice,
    item.quantity
  ]);
  
  
  // Append all product rows
  if (rows.length > 0) {
    const startRow = detailsSheet.getLastRow() + 1;
    
    // Add product rows
    detailsSheet.getRange(startRow, 1, rows.length, rows[0].length).setValues(rows);
    
    // Apply alternating colors to make orders visually distinct (before adding spacing)
    const dataRange = detailsSheet.getRange(startRow, 1, rows.length, rows[0].length);
    dataRange.setBackground('#f7fafc');
    
    // Add an empty row after this order for spacing using getRange instead of appendRow
    const spacingRow = startRow + rows.length;
    const emptyRow = new Array(13).fill(''); // 13 columns of empty strings
    detailsSheet.getRange(spacingRow, 1, 1, 13).setValues([emptyRow]);
  }
}

/**
 * Update order details in OrderDetails sheet
 * Removes old entries and adds new ones
 */
function updateOrderInDetailsSheet(orderData, orderId) {
  const detailsSheet = getOrCreateOrderDetailsSheet();
  const data = detailsSheet.getDataRange().getValues();
  
  // Find and delete existing rows for this orderId
  let rowsToDelete = [];
  for (let i = data.length - 1; i >= 1; i--) { // Start from bottom, skip header
    if (data[i][0] === orderId) {
      rowsToDelete.push(i + 1); // +1 because sheet rows are 1-indexed
    }
  }
  
  // Delete rows (must delete from bottom to top to maintain indices)
  rowsToDelete.sort((a, b) => b - a);
  rowsToDelete.forEach(rowIndex => {
    detailsSheet.deleteRow(rowIndex);
  });
  
  // Also remove the spacing row if it exists
  if (rowsToDelete.length > 0) {
    const lastDeletedRow = rowsToDelete[rowsToDelete.length - 1];
    const checkRow = detailsSheet.getRange(lastDeletedRow, 1).getValue();
    if (checkRow === '') {
      detailsSheet.deleteRow(lastDeletedRow);
    }
  }
  
  // Add updated order
  addOrderToDetailsSheet(orderData, orderId);
}

/**
 * Regenerate entire OrderDetails sheet from Orders sheet
 * Useful for backfilling existing orders
 */
function regenerateOrderDetailsSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ordersSheet = ss.getSheetByName(ORDERS_SHEET);
  
  // Delete existing OrderDetails sheet if it exists
  const existingSheet = ss.getSheetByName('OrderDetails');
  if (existingSheet) {
    ss.deleteSheet(existingSheet);
  }
  
  // Create new OrderDetails sheet
  const detailsSheet = getOrCreateOrderDetailsSheet();
  
  // Get all orders
  const ordersData = ordersSheet.getDataRange().getValues();
  ordersData.shift(); // Remove header
  
  // Build all rows in memory with spacing
  const allRows = [];
  
  ordersData.forEach((row, index) => {
    if (!row[0]) return; // Skip empty rows
    
    const orderId = row[0];
    const orderData = {
      timestamp: row[1],
      userInfo: {
        name: row[2],
        email: row[3],
        company: row[4],
        phone: row[5]
      },
      lineItems: JSON.parse(row[11]),
      totals: {
        subtotal: row[6],
        taxRate: row[7],
        taxAmount: row[8],
        grandTotal: row[9]
      }
    };
    
    // Add rows for each line item
    orderData.lineItems.forEach(item => {
      allRows.push([
        orderId,
        orderData.timestamp || new Date().toISOString(),
        orderData.userInfo.name,
        orderData.userInfo.email,
        orderData.userInfo.company || '',
        orderData.userInfo.phone || '',
        item.categoryName || '',
        item.productId || '',
        item.productName,
        item.size || '',
        item.supplier || '',
        item.unitPrice,
        item.quantity
      ]);
    });
    
    // Add spacing row after this order (empty row with 13 columns)
    allRows.push(new Array(13).fill(''));
  });
  
  // Write all rows at once
  if (allRows.length > 0) {
    detailsSheet.getRange(2, 1, allRows.length, 13).setValues(allRows);
    
    // Apply background color to product rows (skip spacing rows)
    let rowIndex = 2; // Start after header
    ordersData.forEach(orderRow => {
      if (!orderRow[0]) return;
      
      const lineItemsCount = JSON.parse(orderRow[11]).length;
      
      // Color the product rows
      if (lineItemsCount > 0) {
        detailsSheet.getRange(rowIndex, 1, lineItemsCount, 13).setBackground('#f7fafc');
        rowIndex += lineItemsCount + 1; // Skip products + spacing row
      }
    });
  }
  
  Logger.log('OrderDetails sheet regenerated successfully');
  
  // Also update SupplierSummary sheet
  try {
    updateSupplierSummarySheet();
  } catch (summaryError) {
    Logger.log('Failed to update SupplierSummary sheet: ' + summaryError.toString());
  }
  
  return { success: true, message: 'OrderDetails sheet regenerated' };
}


// ========================================
// SUPPLIER SUMMARY SHEET
// ========================================

/**
 * Create or get the SupplierSummary sheet
 * This sheet aggregates products by supplier with total quantities
 */
function getOrCreateSupplierSummarySheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let summarySheet = ss.getSheetByName('SupplierSummary');
  
  if (!summarySheet) {
    summarySheet = ss.insertSheet('SupplierSummary');
    
    // Set up headers
    const headers = [
      'Supplier',
      'Product ID',
      'Product Name',
      'Total Quantity',
      'Unit Price'
    ];
    
    const headerRange = summarySheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#36656b');
    headerRange.setFontColor('#ffffff');
    
    // Freeze header row
    summarySheet.setFrozenRows(1);
    
    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
      summarySheet.autoResizeColumn(i);
    }
  }
  
  return summarySheet;
}

/**
 * Update the SupplierSummary sheet with aggregated data from OrderDetails
 * This is called automatically whenever orders are created or updated
 */
function updateSupplierSummarySheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const summarySheet = getOrCreateSupplierSummarySheet();
  const detailsSheet = ss.getSheetByName('OrderDetails');
  
  if (!detailsSheet) {
    Logger.log('OrderDetails sheet not found - cannot update supplier summary');
    return;
  }
  
  const data = detailsSheet.getDataRange().getValues();
  
  // Skip if only header row exists
  if (data.length <= 1) {
    Logger.log('No order data to summarize');
    return;
  }
  
  // Skip header row
  data.shift();
  
  // Aggregate data by supplier and product
  // Key format: "Supplier|ProductID"
  const aggregation = {};
  
  data.forEach(row => {
    // Skip empty rows (spacing rows)
    if (!row[0]) return;
    
    const supplier = row[10] || 'Unknown Supplier'; // Column K (Supplier)
    const productId = row[7] || '';                 // Column H (Product ID)
    const productName = row[8] || '';               // Column I (Product Name)
    const unitPrice = row[11] || 0;                 // Column L (Unit Price)
    const quantity = row[12] || 0;                  // Column M (Quantity)
    
    const key = `${supplier}|${productId}`;
    
    if (!aggregation[key]) {
      aggregation[key] = {
        supplier: supplier,
        productId: productId,
        productName: productName,
        unitPrice: unitPrice,
        totalQuantity: 0
      };
    }
    
    aggregation[key].totalQuantity += Number(quantity);
  });
  
  // Convert aggregation object to sorted array
  const summaryRows = Object.values(aggregation)
    .sort((a, b) => {
      // Sort by supplier first, then by product name
      if (a.supplier !== b.supplier) {
        return a.supplier.localeCompare(b.supplier);
      }
      return a.productName.localeCompare(b.productName);
    })
    .map(item => [
      item.supplier,
      item.productId,
      item.productName,
      item.totalQuantity,
      item.unitPrice
    ]);
  
  // Clear existing data (keep header)
  if (summarySheet.getLastRow() > 1) {
    summarySheet.getRange(2, 1, summarySheet.getLastRow() - 1, 5).clear();
  }
  
  // Write new data
  if (summaryRows.length > 0) {
    summarySheet.getRange(2, 1, summaryRows.length, 5).setValues(summaryRows);
    
    // Apply alternating row colors by supplier
    let currentSupplier = null;
    let useAlternateColor = false;
    
    summaryRows.forEach((row, index) => {
      const rowNum = index + 2; // +2 because of header and 0-based index
      const supplier = row[0];
      
      // Change color when supplier changes
      if (supplier !== currentSupplier) {
        currentSupplier = supplier;
        useAlternateColor = !useAlternateColor;
      }
      
      const backgroundColor = useAlternateColor ? '#f0f4f5' : '#ffffff';
      summarySheet.getRange(rowNum, 1, 1, 5).setBackground(backgroundColor);
    });
    
    // Auto-resize columns after adding data
    for (let i = 1; i <= 5; i++) {
      summarySheet.autoResizeColumn(i);
    }
  }
  
  Logger.log('SupplierSummary sheet updated successfully with ' + summaryRows.length + ' products');
}

/**
 * Regenerate the entire SupplierSummary sheet from OrderDetails
 * Useful for manual refresh or fixing data issues
 */
function regenerateSupplierSummarySheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Delete existing SupplierSummary sheet if it exists
  const existingSheet = ss.getSheetByName('SupplierSummary');
  if (existingSheet) {
    ss.deleteSheet(existingSheet);
  }
  
  // Recreate and populate
  updateSupplierSummarySheet();
  
  Logger.log('SupplierSummary sheet regenerated successfully');
  return { success: true, message: 'SupplierSummary sheet regenerated' };
}
