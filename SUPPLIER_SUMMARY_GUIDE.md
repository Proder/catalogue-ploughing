# Supplier Summary Sheet - User Guide

## Overview

The **SupplierSummary** sheet provides an at-a-glance view of all products that need to be ordered, grouped by supplier with aggregated quantities across all orders. This makes it easy to see what to order from each supplier.

## Features

✅ **Automatic Updates**: Refreshes automatically when orders are created or updated  
✅ **Aggregated Data**: Combines quantities from multiple orders  
✅ **Supplier Grouping**: All products organized by supplier  
✅ **Clear Layout**: Color-coded by supplier for easy scanning  
✅ **Complete Details**: Shows product ID, name, total quantity, and unit price

---

## Sheet Structure

The SupplierSummary sheet contains these columns:

| Column | Description |
|--------|-------------|
| **Supplier** | Name of the supplier |
| **Product ID** | Product code/identifier |
| **Product Name** | Full product name |
| **Total Quantity** | Sum of all quantities across all orders |
| **Unit Price** | Price per unit |

### Example

```
| Supplier        | Product ID | Product Name       | Total Quantity | Unit Price |
|-----------------|------------|-------------------|----------------|------------|
| Acme Flags Inc  | A1         | Standard Flag Pole| 5              | $475.00    |
| Acme Flags Inc  | A2         | Flag & Pole Kit   | 3              | $295.00    |
| Banner Co       | B1         | Vinyl Banner      | 10             | $85.00     |
| Banner Co       | B2         | Mesh Banner       | 8              | $95.00     |
```

Products are sorted by:
1. **Supplier** (alphabetically)
2. **Product Name** (alphabetically within each supplier)

---

## How to Use

### Initial Setup

1. **Deploy Updated Code**
   - Open your Google Sheet
   - Go to **Extensions** → **Apps Script**
   - Ensure the updated `Code.gs` is deployed
   - Save the script

2. **Generate Initial Summary** (if you have existing orders)
   - In Apps Script editor, select `regenerateSupplierSummarySheet` from dropdown
   - Click the **Run** button (▶️)
   - Check execution log for "SupplierSummary sheet regenerated successfully"
   - Return to your sheet to see the new **SupplierSummary** tab

### Automatic Updates

The sheet automatically updates when:
- ✅ A new order is created
- ✅ An existing order is edited
- ✅ The OrderDetails sheet is regenerated

**No manual action needed!** Just place or edit orders and the summary stays current.

---

## Practical Use Cases

### 📦 Preparing Orders

Use the summary to quickly see what to order from each supplier:

1. Filter by supplier to focus on one vendor
2. Copy the product list
3. Use it for placing bulk orders

### 📊 Inventory Planning

- See total demand across all customers
- Identify frequently ordered products
- Plan bulk purchases based on aggregated quantities

### 💰 Cost Analysis

- Calculate total spend per supplier
- Use unit prices to estimate total costs
- Export to Excel for detailed financial analysis

### 📋 Supply Chain Management

- Track which suppliers you depend on most
- Identify potential single-source risks
- Plan alternative suppliers for high-volume products

---

## Advanced Features

### Filtering

1. Click on any column header
2. Select **Data** → **Create a filter**
3. Use filter dropdowns to:
   - View products from specific suppliers
   - Find products above certain quantity thresholds
   - Isolate specific product IDs

### Exporting

**Export to CSV:**
1. Select the data range you need
2. **File** → **Download** → **Comma Separated Values (.csv)**
3. Open in Excel or import into other tools

**Copy to Clipboard:**
1. Select the rows you need
2. **Ctrl+C** (Windows) or **Cmd+C** (Mac)
3. Paste into emails, documents, or ordering systems

### Pivot Tables

Create custom analysis:
1. **Insert** → **Pivot table**
2. Example analyses:
   - Sum total quantities by supplier
   - Calculate total value per supplier (Quantity × Unit Price)
   - Count unique products per supplier

---

## Common Questions

**Q: When does the summary update?**  
A: Automatically whenever an order is created or modified. No manual refresh needed.

**Q: Can I manually edit the SupplierSummary sheet?**  
A: You can, but changes will be overwritten on the next update. The sheet is auto-generated from OrderDetails.

**Q: What if a product has no supplier?**  
A: It will appear under "Unknown Supplier" in the summary.

**Q: How do I refresh the summary manually?**  
A: Run the `regenerateSupplierSummarySheet()` function from the Apps Script editor.

**Q: Can I customize the columns or formatting?**  
A: Yes! Edit the `getOrCreateSupplierSummarySheet()` function in `Code.gs` to add columns or change styling.

**Q: Does it work with edited orders?**  
A: Yes! When an order is edited, the summary recalculates to reflect the new quantities.

---

## Troubleshooting

### Summary sheet is empty
- Ensure you have orders in the OrderDetails sheet
- Run `regenerateSupplierSummarySheet()` manually
- Check the execution log for errors

### Quantities seem wrong
- Verify the OrderDetails sheet has correct data
- Run `regenerateSupplierSummarySheet()` to rebuild from scratch
- Check for duplicate order entries in OrderDetails

### Supplier names are missing
- Ensure your Products sheet has the Supplier column filled in
- Products without suppliers will show as "Unknown Supplier"
- Update your Products sheet and regenerate orders

---

## Tips for Best Results

1. **Keep Supplier Names Consistent**: Use the exact same spelling in your Products sheet for proper grouping
2. **Regular Backups**: Export the summary periodically for your records
3. **Share Read-Only Access**: Share the SupplierSummary tab with your purchasing team
4. **Set Up Alerts**: Use Google Sheets notifications to track when quantities exceed thresholds

---

## Next Steps

✅ **Test the Feature**: Create a test order and watch the summary update  
✅ **Share with Team**: Give purchasing team access to the SupplierSummary sheet  
✅ **Set Up Workflows**: Integrate the summary into your ordering process  
✅ **Customize**: Adjust columns or formatting to match your needs

The SupplierSummary sheet is now your go-to tool for understanding ordering requirements at a glance! 🎉
