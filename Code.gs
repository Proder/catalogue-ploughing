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
const FRONTEND_URL = 'http://localhost:5174';  // Update with your deployed frontend URL


// ========================================
// MAIN ENTRY POINTS
// ========================================

/**
 * Handle GET requests
 * Endpoints: ?action=getCategories, ?action=getOrder&orderId=XXX, ?action=getOrderByToken&token=XXX, ?action=health
 */
function doGet(e) {
  const action = e.parameter.action;
  let result;
  
  try {
    switch (action) {
      case 'getCategories':
        result = getCatalogue();
        break;
      case 'getOrder':
        result = getOrder(e.parameter.orderId);
        break;
      case 'getOrderByToken':
        result = getOrderByToken(e.parameter.token);
        break;
      case 'health':
        result = { success: true, message: 'API is running' };
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
 * Endpoints: action=createOrder, action=updateOrder
 */
function doPost(e) {
  let result;
  
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'createOrder':
        result = createOrder(data.payload);
        break;
      case 'updateOrder':
        result = updateOrder(data.orderId, data.payload, data.editToken);
        break;
      default:
        result = { success: false, message: 'Unknown action. Use action=createOrder or action=updateOrder' };
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
  // Products sheet columns: A=Code, B=Category, C=Item, D=ImageUrl, E=Pricing2025, F=Notes, G=ExampleUrl, H=ArtworkTemplateUrl, I=Active
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
          const isActive = prodRow[8] === true || prodRow[8] === 'TRUE';
          return productCategory === categoryName && isActive;
        })
        .map(prodRow => ({
          id: prodRow[0],                    // Code (A1, B1, etc.)
          name: prodRow[2],                  // Item name
          description: prodRow[5] || prodRow[2], // Notes or Item name as fallback
          pricing2025: parseFloat(prodRow[4]) || 0,  // Pricing2025 (current price)
          imageUrl: prodRow[3] || undefined,       // ImageUrl
          exampleUrl: prodRow[6] || undefined,     // ExampleUrl
          artworkTemplateUrl: prodRow[7] || undefined, // ArtworkTemplateUrl
          notes: prodRow[5] || undefined       // Notes
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
  
  // Prepare row data (now includes EditToken in column M)
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
    editToken  // Column M - EditToken
  ];
  
  sheet.appendRow(row);
  
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
    lineItems: JSON.parse(orderRow[11]),
    totals: {
      subtotal: orderRow[6],
      taxRate: orderRow[7],
      taxAmount: orderRow[8],
      grandTotal: orderRow[9]
    },
    timestamp: orderRow[1],
    status: orderRow[10],
    editToken: orderRow[12]  // Column M
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
  
  // Find order row by edit token (column M)
  const orderRow = data.find(row => row[12] === token);
  
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
      // Verify edit token if provided
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
  
  // Keep the existing edit token
  const existingEditToken = data[rowIndex - 1][12];
  
  // Update row data (13 columns including EditToken)
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
    existingEditToken  // Keep the same edit token
  ]]);
  
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
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.productName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.size}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${item.unitPrice.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;"><strong>$${item.lineTotal.toFixed(2)}</strong></td>
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
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f7fafc; padding: 10px; text-align: left; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
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
            <strong>Date:</strong> ${new Date(payload.timestamp).toLocaleString()}<br>
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
            <p>Subtotal: $${payload.totals.subtotal.toFixed(2)}</p>
            <p>Tax (${(payload.totals.taxRate * 100).toFixed(0)}%): $${payload.totals.taxAmount.toFixed(2)}</p>
            <p class="grand-total">Grand Total: $${payload.totals.grandTotal.toFixed(2)}</p>
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
${payload.lineItems.map(item => `- ${item.productName} (${item.size}) x${item.quantity} = $${item.lineTotal.toFixed(2)}`).join('\n')}

Subtotal: $${payload.totals.subtotal.toFixed(2)}
Tax (${(payload.totals.taxRate * 100).toFixed(0)}%): $${payload.totals.taxAmount.toFixed(2)}
Grand Total: $${payload.totals.grandTotal.toFixed(2)}

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
          <p>Grand Total: <strong style="color: #667eea; font-size: 1.2em;">$${payload.totals.grandTotal.toFixed(2)}</strong></p>
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
