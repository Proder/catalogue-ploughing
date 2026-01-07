# Quick Start: Order Details Sheet Setup

## Step 1: Deploy the Updated Code

1. **Copy the updated Code.gs**
   - Open your Google Sheets spreadsheet
   - Go to **Extensions** → **Apps Script**
   - Replace the entire content with the updated `Code.gs` file
   - Click **Save** (💾)

2. **Verify the Configuration**
   - Check that `SPREADSHEET_ID` is set correctly (line 9)
   - Ensure `ORDERS_SHEET`, `CATEGORIES_SHEET`, and `PRODUCTS_SHEET` names match your sheets

## Step 2: Backfill Existing Orders (Optional)

If you already have orders in your system and want to format them into the OrderDetails sheet:

1. In the Apps Script editor, select the function `regenerateOrderDetailsSheet` from the dropdown
2. Click the **Run** button (▶️)
3. Authorize the script if prompted
4. Check the execution log - you should see "OrderDetails sheet regenerated successfully"
5. Go back to your spreadsheet and you'll see the new **OrderDetails** sheet

## Step 3: Test with a New Order

Create a test order using your frontend application or API. The system will automatically:
- Create the order in the Orders sheet
- Extract the products from the JSON
- Add each product as a separate row in OrderDetails
- Add spacing between orders

## What You'll See

### In the Orders Sheet
```
| Order ID   | Timestamp | Name | Email | ... | LineItems (JSON)                |
|------------|-----------|------|-------|-----|---------------------------------|
| ORD-123456 | 2026-... | John | ...   | ... | [{"productId":"A1","productName":"Flag Pole",...}] |
```

### In the OrderDetails Sheet (Automatically Created)
```
| Order ID   | Customer | Email | Product ID | Product Name | Quantity | Price | Total |
|------------|----------|-------|------------|--------------|----------|-------|-------|
| ORD-123456 | John     | ...   | A1         | Flag Pole    | 1        | $475  | $475  |
| ORD-123456 | John     | ...   | A2         | Flag & Pole  | 1        | $295  | $295  |
|            |          |       |            |              |          |       |       |  ← Spacing
| ORD-123457 | Jane     | ...   | A3         | Archway      | 2        | $1800 | $3600 |
|            |          |       |            |              |          |       |       |  ← Spacing
```

## Key Features

✅ **Automatic**: Works on every new order
✅ **Spaced**: Empty rows between orders for clarity
✅ **Complete**: Full customer and product details on each row
✅ **Formatted**: Color-coded headers and alternating row colors
✅ **Synchronized**: Updates when orders are edited

## Usage Tips

### Filtering
- Click on any column header → **Data** → **Create a filter**
- Filter by customer email to see all their products
- Filter by product ID to see sales of a specific item

### Sorting
- Sort by Order Date to see chronological product orders
- Sort by Product Name to group similar products together
- Sort by Customer Name to see orders by customer

### Exporting
- Select the data range you want
- **File** → **Download** → **Comma Separated Values (.csv)**
- Use in Excel, data analysis tools, or reporting systems

### Analysis
- Create a pivot table: **Insert** → **Pivot table**
- Analyze total sales by product, category, or customer
- Generate charts for visual insights

## Common Questions

**Do I need to do anything special when creating orders?**
No! The system automatically handles everything. Just make sure your order JSON includes the required fields.

**Can I manually edit the OrderDetails sheet?**
You can, but changes will be overwritten if the order is updated. The OrderDetails sheet is automatically generated from the Orders sheet.

**What if I delete an order from the Orders sheet?**
The corresponding rows in OrderDetails will remain. If you want to clean up, run `regenerateOrderDetailsSheet()` to rebuild from scratch.

**Can I customize the columns or formatting?**
Yes! Modify the `getOrCreateOrderDetailsSheet()` function in Code.gs to change headers, add columns, or adjust styling.

## Next Steps

1. ✅ Deploy the updated code
2. ✅ Run `regenerateOrderDetailsSheet()` if you have existing orders
3. ✅ Test with a new order
4. ✅ Share the OrderDetails sheet with your team
5. ✅ Set up filters, pivot tables, or charts as needed

That's it! Your product data is now beautifully formatted and ready for analysis. 🎉
