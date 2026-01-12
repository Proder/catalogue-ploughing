# Catalogue Ploughing

A mobile-first product catalogue and order management system built with React, TypeScript, and Tailwind CSS. Features a Google Apps Script backend for seamless Google Sheets integration.

![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

## ✨ Features

- **📱 Mobile-First Design** - Responsive layout optimized for all screen sizes
- **🛒 Product Catalogue** - Browse products organized by searchable categories
- **📝 Order Management** - Create and edit orders with real-time validation
- **📧 Email Confirmations** - Automatic order confirmation emails with edit links
- **📊 Google Sheets Backend** - All orders stored in Google Sheets via Apps Script API
- **🔄 Lazy Loading** - Products loaded on-demand per category for fast initial load
- **🔍 Category Search** - Quickly find categories with built-in search functionality

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google account (for backend setup)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd catalogue-ploughing

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### Google Apps Script Backend

The backend is powered by Google Apps Script connected to Google Sheets.

1. Create a new Google Sheet
2. Open **Extensions > Apps Script**
3. Copy the contents of `backend/Code.gs` into the Apps Script editor
4. Deploy as a Web App:
   - Click **Deploy > New deployment**
   - Select **Web app**
   - Set **Execute as**: Me
   - Set **Who has access**: Anyone
   - Click **Deploy** and copy the URL
5. Add the deployment URL to your `.env` file

### Google Sheet Structure

The backend expects these sheets in your Google Spreadsheet:

| Sheet Name | Purpose |
|------------|---------|
| `Catalogue` | Product data with categories, prices, and images |
| `Orders` | Order records with customer info and line items |
| `OrderDetails` | Flattened product-level order breakdown |
| `SupplierSummary` | Aggregated data by supplier |

## 📁 Project Structure

```
catalogue-ploughing/
├── src/
│   ├── api/                 # API client for backend communication
│   │   ├── authClient.ts    # Authentication utilities
│   │   └── orderClient.ts   # Order & catalogue API functions
│   ├── components/          # Reusable UI components
│   │   ├── CategoryPanel.tsx
│   │   ├── CategoryTabs.tsx
│   │   ├── ConfirmationView.tsx
│   │   ├── HeroSection.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── OrderSummary.tsx
│   │   ├── ProductCard.tsx
│   │   └── UserInfoForm.tsx
│   ├── context/             # React context providers
│   ├── features/            # Feature modules
│   │   └── order/           # Order page feature
│   ├── layout/              # Layout components
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Root application component
│   ├── index.css            # Global styles & Tailwind config
│   └── main.tsx             # Application entry point
├── backend/
│   └── Code.gs              # Google Apps Script backend
├── public/                  # Static assets
├── .env.example             # Environment template
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.ts           # Vite configuration
└── package.json
```

## 🔌 API Endpoints

The Google Apps Script backend exposes these endpoints:

| Action | Method | Description |
|--------|--------|-------------|
| `getCategories` | GET | Fetch category list (lightweight) |
| `getProductsByCategory` | GET | Fetch products for a specific category |
| `getCatalogue` | GET | Fetch full catalogue (fallback) |
| `createOrder` | POST | Submit a new order |
| `updateOrder` | POST | Update an existing order |
| `getOrder` | GET | Retrieve order by ID |
| `getOrderByToken` | GET | Retrieve order by edit token |

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize the color palette:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your primary colors */ },
      secondary: { /* your secondary colors */ },
      accent: { /* your accent colors */ },
    }
  }
}
```

### Styling

Global styles and utility classes are defined in `src/index.css` using Tailwind's `@layer` directive.

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite 7
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Styling**: Tailwind CSS with custom design system

## 📄 License

This project is proprietary software. All rights reserved.

---

Built with ❤️ for seamless catalogue and order management.
