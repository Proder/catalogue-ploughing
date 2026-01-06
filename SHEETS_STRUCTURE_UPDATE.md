# Updated Google Sheets Structure for Real Catalogue

## ⚠️ IMPORTANT: New Sheet Structure Required

Your real product data requires a different sheet structure. Here's what to update:

---

## Sheet 1: Products (Updated Structure)

### New Column Headers (Row 1):

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Code | Category | Item | ImageUrl | Pricing2023 | Pricing2025 | Notes | ExampleUrl | ArtworkTemplateUrl | Active |

### Column Descriptions:

- **A - Code**: Product code (A1, A2, B1, C1, D1, etc.)
- **B - Category**: Category name (Outdoor Features, Feather Flags, etc.)
- **C - Item**: Product name/description
- **D - ImageUrl**: Direct URL to product image (optional)
- **E - Pricing2023**: Historical pricing (€ amount or 0)
- **F - Pricing2025**: Current pricing (€ amount) - **THIS IS THE PRICE USED**
- **G - Notes**: Additional information
- **H - ExampleUrl**: URL to example image (optional)
- **I - ArtworkTemplateUrl**: URL to artwork template (optional)
- **J - Active**: TRUE or FALSE

### Sample Data (copy to your sheet):

```
A1,Outdoor Features,Flag Pole and Surround,,0,475,Pole Supplied by Castle,,,TRUE
A2,Outdoor Features,Flag & Pole,,0,295,Pole Supplied by Castle,,,TRUE
A3,Outdoor Features,Entrance Archway (SMALL),,1800,1800,6m W x 3.5m H goalpost,,,TRUE
B1,Feather Flags,2.3m (small) feather flag,,0,220,With Single Sided Print and water base,,,TRUE
C1,Teardrop Flags,2.3m (small) teardrop flag,,0,230,With Single Sided Print and water base,,,TRUE
D1,Flags,Flags 0.9m h x 1.5m w,,0,145,Hem & eyelet - branding visible both sides,,,TRUE
```

---

## Sheet 2: Categories (Simplified)

### Column Headers:

| A | B | C |
|---|---|---|
| CategoryId | CategoryName | SortOrder |

### Data:

```
outdoor-features,Outdoor Features,1
feather-flags,Feather Flags,2
teardrop-flags,Teardrop Flags,3
flags,Flags,4
```

**Note**: CategoryId should be lowercase-with-dashes version of CategoryName

---

## Sheet 3: Orders (Add EditToken)

### Column Headers (13 columns):

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| OrderId | Timestamp | Name | Email | Company | Phone | Subtotal | TaxRate | TaxAmount | GrandTotal | Status | LineItemsJSON | EditToken |

---

## 🔄 Migration Steps

### If You Already Have Data:

1. **Backup your current sheet** (File → Make a copy)
2. **Create new Products sheet** with updated columns
3. **Copy your data** column by column to match new structure
4. **Map your fields:**
   - Your "Code" → Column A (Code)
   - Your "Categories" → Column B (Category)  
   - Your "Item" → Column C (Item)
   - Your "Image" → Column D (ImageUrl) - add URLs later
   - Your "Pricing 2025" → Column F (Pricing2025) - **remove € symbol, just numbers**
   - Your "Pricing 2023" → Column E (Pricing2023)
   - Your "Notes" → Column G (Notes)
   - Your "Example" → Column H (ExampleUrl) - add URLs later
   - Your "Artwork Template" → Column I (ArtworkTemplateUrl) - add URLs later
   - Add TRUE to Column J (Active) for all rows

### Important: Remove € Symbol!

Excel/Google Sheets might have "€475" - change to just `475` (number format)

---

## 📊 Quick Setup (Fresh Start)

### Option 1: Import CSV Files

1. I created `products.csv` and `categories.csv` for you
2. In Google Sheets:
   - **Products sheet**: File → Import → Upload → select `products.csv`
   - **Categories sheet**: File → Import → Upload → select `categories.csv`
3. Done! ✅

### Option 2: Manual Entry

1. Type/paste the headers exactly as shown above
2. Copy your data from your existing spreadsheet
3. Adjust column mapping as needed

---

## 🖼️ Adding Images (Optional)

### Step 1: Upload Images

Upload your product images to:
- **Google Drive** (recommended)
- **Imgur** (free)
- **Your own server**

### Step 2: Get URLs

For Google Drive:
1. Upload image
2. Right-click → Get link → Set to "Anyone with link"
3. Copy the link ID: `https://drive.google.com/file/d/FILE_ID/view`
4. Use this format: `https://drive.google.com/uc?id=FILE_ID`

### Step 3: Add to Sheet

Paste the URL in:
- Column D (ImageUrl) - main product image
- Column H (ExampleUrl) - example/reference image
- Column I (ArtworkTemplateUrl) - downloadable template

Leave blank if you don't have images yet!

---

## ✅ Verification

After updating your sheets:

1. **Check Categories sheet** has 4 rows (+ header)
2. **Check Products sheet** has your products with Code in column A
3. **Check pricing is numbers only** (no € symbol)
4. **Check Active column** is TRUE/FALSE
5. **Re-deploy Apps Script** (Deploy → Manage deployments → New version)

Your catalogue should now load with your real products! 🎉
