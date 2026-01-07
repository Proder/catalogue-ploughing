# Order Details Sheet - Product Breakdown

## Overview
The system now automatically creates a separate **OrderDetails** sheet that displays each product from every order on its own row. This makes it easy to:
- See all products ordered by each customer
- Analyze individual product sales
- Track orders in a more readable format
- Export product-level data for reporting

## Features

### Automatic Product Row Formatting
When an order is placed, the JSON array of products is automatically:
1. **Extracted** from the order
2. **Split** into individual rows (one row per product)
3. **Formatted** with complete customer and order information
4. **Spaced** with an empty row between different orders for better readability
5. **Color-coded** with alternating backgrounds for visual clarity

### Sheet Structure
The **OrderDetails** sheet contains the following columns:

| Column | Description |
|--------|-------------|
| Order ID | Unique order identifier (e.g., ORD-1234567890) |
| Order Date | Timestamp when the order was placed |
| Customer Name | Name of the customer |
| Email | Customer's email address |
| Company | Customer's company (optional) |
| Phone | Customer's phone number (optional) |
| Category ID | Product category ID |
| Category Name | Product category name |
| Product ID | Product code/ID |
| Product Name | Name of the product |
| Unit Price | Price per unit |
| Quantity | Number of units ordered |
| Line Total | Total for this product (Unit Price × Quantity) |
| Order Subtotal | Subtotal for the entire order |
| Tax Rate | Tax rate applied |
| Tax Amount | Total tax amount |
| Grand Total | Final order total |
| Status | Order status (pending, completed, etc.) |

## Example

### Input (JSON in Orders Sheet)
```json
[
  {
    "categoryId": "outdoor-features",
    "categoryName": "Outdoor Features",
    "productId": "A1",
    "productName": "Flag Pole and Surround",
    "unitPrice": 475,
    "quantity": 1,
    "lineTotal": 475
  },
  {
    "categoryId": "outdoor-features",
    "categoryName": "Outdoor Features",
    "productId": "A2",
    "productName": "Flag & Pole",
    "unitPrice": 295,
    "quantity": 1,
    "lineTotal": 295
  }
]
```

### Output (OrderDetails Sheet)
```
Order ID    | Customer Name | Email           | Product ID | Product Name           | Quantity | Unit Price | Line Total
------------|---------------|-----------------|------------|------------------------|----------|------------|------------
ORD-1234567 | John Doe      | john@email.com  | A1         | Flag Pole and Surround | 1        | $475       | $475
ORD-1234567 | John Doe      | john@email.com  | A2         | Flag & Pole            | 1        | $295       | $295
            |               |                 |            |                        |          |            |
ORD-1234568 | Jane Smith    | jane@email.com  | A3         | Entrance Archway       | 2        | $1800      | $3600
            |               |                 |            |                        |          |            |
```

## Automatic Integration

### On Order Creation
When a new order is created via `createOrder()`:
1. Order is saved to the **Orders** sheet (with JSON in column L)
2. Products are automatically extracted and added to **OrderDetails** sheet
3. An empty row is added for spacing
4. Confirmation email is sent

### On Order Update
When an order is updated via `updateOrder()`:
1. Old product rows are removed from **OrderDetails** sheet
2. Updated products are added back
3. Spacing is maintained
4. Update confirmation email is sent

## Manual Operations

### Regenerate the OrderDetails Sheet
If you need to rebuild the entire OrderDetails sheet from existing orders:

1. Open **Apps Script Editor** (Extensions → Apps Script)
2. Run the function: `regenerateOrderDetailsSheet()`

This will:
- Delete the existing OrderDetails sheet
- Create a new one with headers
- Process all orders from the Orders sheet
- Format all products into separate rows with spacing

### Usage Steps:
1. Click on the function name `regenerateOrderDetailsSheet` in the editor
2. Click the **Run** button (▶️)
3. Authorize the script if prompted
4. Check the execution log for confirmation

## Benefits

### For Data Analysis
- **Easy Filtering**: Filter by product, customer, or category
- **Product Sales**: See all instances of a specific product across all orders
- **Customer History**: View all products ordered by a specific customer
- **Export Ready**: Data is already in a flat format suitable for CSV export

### For Order Management
- **Quick Lookup**: Find specific products without parsing JSON
- **Visual Clarity**: Empty rows between orders make it easy to scan
- **Complete Context**: Each row has full customer and order information

### For Reporting
- **Pivot Tables**: Create pivot tables for product analysis
- **Charts**: Generate charts based on product sales
- **Summaries**: Use SUMIF, COUNTIF to analyze product performance

## Technical Details

### Functions Added to Code.gs

#### `getOrCreateOrderDetailsSheet()`
Creates the OrderDetails sheet if it doesn't exist, sets up headers and formatting.

#### `addOrderToDetailsSheet(orderData, orderId)`
Adds all products from an order as separate rows with spacing.

#### `updateOrderInDetailsSheet(orderData, orderId)`
Removes old product rows and adds updated ones.

#### `regenerateOrderDetailsSheet()`
Rebuilds the entire sheet from scratch using existing orders.

## Notes

- The OrderDetails sheet is automatically created on the first order
- Updates and deletions (if implemented) are automatically synchronized
- The empty spacing rows help visually separate different orders
- Product rows for the same order have a light gray background (#f7fafc)
- Headers are frozen and styled with a purple background (#667eea)

## Troubleshooting

**Q: OrderDetails sheet is not being created**
- Check that SPREADSHEET_ID is correctly set at the top of Code.gs
- Ensure the script has permission to modify the spreadsheet

**Q: Some orders are missing from OrderDetails**
- Run `regenerateOrderDetailsSheet()` to rebuild from all existing orders

**Q: Product information is incomplete**
- Ensure your lineItems JSON includes all required fields (productId, productName, quantity, unitPrice, lineTotal)
- Check that categoryId and categoryName are included in the JSON

**Q: Spacing rows are missing**
- Run `regenerateOrderDetailsSheet()` to apply proper formatting
