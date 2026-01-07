# Catalogue Order Portal

A comprehensive order management system built with React, TypeScript, Vite, and Google Apps Script.

## 🎯 Features

- **Product Catalogue**: Browse products organized by categories
- **Order Management**: Create and edit orders with automatic email confirmations
- **Google Sheets Backend**: Orders stored in Google Sheets with Apps Script API
- **Order Details Formatting**: Automatic product-level breakdowns in a separate sheet

## 📊 New: OrderDetails Sheet

The system now automatically creates an **OrderDetails** sheet that formats each product from your orders into separate rows with spacing between orders. This makes it easy to:
- Analyze individual product sales
- Track customer purchase history
- Export product-level data for reporting
- Filter and sort by product, customer, or category

### Example

When you receive an order with multiple products in JSON format:
```json
[
  {"productId":"A1","productName":"Flag Pole and Surround","unitPrice":475,"quantity":1},
  {"productId":"A2","productName":"Flag & Pole","unitPrice":295,"quantity":1}
]
```

The system automatically creates separate rows:
```
Order ID   | Customer | Product ID | Product Name           | Quantity | Price
-----------|----------|------------|------------------------|----------|-------
ORD-123456 | John Doe | A1         | Flag Pole and Surround | 1        | $475
ORD-123456 | John Doe | A2         | Flag & Pole            | 1        | $295
```

📖 **Full Documentation**: See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for complete details.

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
