# Google Apps Script Setup Guide

## Step 1: Create Google Sheet

1. **Go to Google Sheets**
   - Open https://sheets.google.com
   - Click the **+ Blank** button to create a new spreadsheet

2. **Name your spreadsheet**
   - Click on "Untitled spreadsheet" at the top
   - Rename it to: **Catalogue Order Portal**

3. **Get the Spreadsheet ID**
   - Look at the URL in your browser:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit
   ```
   - Copy the ID between `/d/` and `/edit`
   - **Save this ID** - you'll need it for the Apps Script code
   
   Example: If URL is `https://docs.google.com/spreadsheets/d/1ABC123xyz/edit`  
   Then Spreadsheet ID is: `1ABC123xyz`

---

## Step 2: Create the Three Sheets

1. **Rename the first sheet**
   - Double-click on "Sheet1" tab at the bottom
   - Rename to: **Orders**

2. **Add two more sheets**
   - Click the **+** button at the bottom left (next to Orders tab)
   - Name the new sheet: **Categories**
   - Click **+** again
   - Name it: **Products**

---

## Step 3: Add Headers to Each Sheet

### Orders Sheet
Click on the **Orders** tab, then add these headers in row 1:

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| OrderId | Timestamp | Name | Email | Company | Phone | Subtotal | TaxRate | TaxAmount | GrandTotal | Status | LineItemsJSON |

### Categories Sheet
Click on the **Categories** tab, then add these headers:

| A | B | C |
|---|---|---|
| CategoryId | CategoryName | SortOrder |

### Products Sheet
Click on the **Products** tab, then add these headers:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| ProductId | CategoryId | Name | Description | Size | UnitPrice | Active |

---

## Step 4: Populate Initial Data

### Fill Categories Sheet

Add these rows below the headers:

| CategoryId | CategoryName | SortOrder |
|-----------|--------------|-----------|
| electronics | Electronics | 1 |
| office | Office Supplies | 2 |
| furniture | Furniture | 3 |
| accessories | Accessories | 4 |
| storage | Storage Solutions | 5 |

### Fill Products Sheet

Add all products from your mock data (27 rows). Here's how to format them:

| ProductId | CategoryId | Name | Description | Size | UnitPrice | Active |
|-----------|-----------|------|-------------|------|-----------|--------|
| elec-001 | electronics | Wireless Mouse | Ergonomic wireless mouse with USB receiver | Standard | 29.99 | TRUE |
| elec-002 | electronics | Mechanical Keyboard | RGB backlit mechanical gaming keyboard | Full-size | 89.99 | TRUE |
| ... | ... | ... | ... | ... | ... | ... |

**Tip**: You can copy-paste from Excel or a CSV file!

---

## Step 5: Create Apps Script

1. **Open Apps Script Editor**
   - In your Google Sheet, click **Extensions** → **Apps Script**
   - A new tab will open with the Apps Script editor

2. **Replace Code.gs**
   - You'll see a file called `Code.gs` with some default code
   - **Delete all the default code**
   - Copy the complete Apps Script code from `implementation_plan.md`
   - Paste it into `Code.gs`

3. **Update the Spreadsheet ID**
   - Find this line near the top:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   ```
   - Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID from Step 1
   - Example:
   ```javascript
   const SPREADSHEET_ID = '1ABC123xyz';
   ```

4. **Save the script**
   - Click the **💾 Save** icon (or press Ctrl+S)
   - Name the project: **Catalogue Order Portal API**

---

## Step 6: Deploy as Web App

1. **Start deployment**
   - Click the **Deploy** button (top right)
   - Select **New deployment**

2. **Configure deployment**
   - Click the gear icon ⚙️ next to "Select type"
   - Choose **Web app**

3. **Set deployment settings**:
   - **Description**: `Catalogue Order Portal API v1`
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
   
   > **Important**: "Anyone" means anyone with the URL can call it. This is needed for your React app to work.

4. **Authorize**
   - Click **Deploy**
   - You'll see a warning: "This app isn't verified"
   - Click **Advanced** → **Go to [Project Name] (unsafe)**
   - Click **Allow** to grant permissions

5. **Copy the Web App URL**
   - After deployment, you'll see:
   ```
   Web app URL: https://script.google.com/macros/s/SCRIPT_ID/exec
   ```
   - **Copy this entire URL**
   - This is your API endpoint!

---

## Step 7: Configure Frontend

1. **Open your .env file**
   - Location: `d:\Adapt AI Now\catalogue-ploughing\.env`

2. **Update the API URL**
   ```
   VITE_API_BASE_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
   - Replace with your actual Web App URL from Step 6

3. **Restart dev server**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

---

## Step 8: Test the Integration

### Test 1: Health Check
Open this URL in your browser:
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=health
```

Expected response:
```json
{"success":true,"message":"API is running"}
```

### Test 2: Get Catalogue
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getCategories
```

You should see your categories and products in JSON format!

### Test 3: Submit Order from React App
1. Open your React app: `http://localhost:5174`
2. Fill in the form
3. Select some products
4. Click Submit Order
5. Check the **Orders** sheet in Google Sheets - a new row should appear!

---

## Troubleshooting

### Error: "Script function not found: doPost"
- Make sure you copied the entire `Code.gs` code
- Check that function names match exactly

### Error: "Authorization required"
- Re-deploy the web app
- Make sure "Who has access" is set to **Anyone**

### Error: "Cannot find module"
- Check the SPREADSHEET_ID is correct
- Make sure sheet names match exactly: Orders, Categories, Products

### CORS errors in browser
- Make sure you deployed as a **Web app**, not as an Add-on
- Try redeploying with a new version number

---

## Making Updates

If you change the Apps Script code later:

1. Click **Deploy** → **Manage deployments**
2. Click the **Edit** icon (pencil) next to your deployment
3. Change **Version** to **New version**
4. Click **Deploy**
5. The Web App URL stays the same!

---

**You're all set!** Your React app is now connected to Google Sheets via Apps Script.
