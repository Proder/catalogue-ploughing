import type { Category } from '../types';

/**
 * Mock catalogue data - used as fallback when API is unavailable
 */
export const MOCK_CATEGORIES: Category[] = [
    {
        id: 'electronics',
        name: 'Electronics',
        products: [
            {
                id: 'elec-001',
                name: 'Wireless Mouse',
                description: 'Ergonomic wireless mouse with USB receiver',
                pricing2025: 29.99,
            },
            {
                id: 'elec-002',
                name: 'Mechanical Keyboard',
                description: 'RGB backlit mechanical gaming keyboard',
                pricing2025: 89.99,
            },
            {
                id: 'elec-003',
                name: 'USB-C Hub',
                description: '7-in-1 USB-C hub with HDMI and card reader',
                pricing2025: 49.99,
            },
            {
                id: 'elec-004',
                name: 'Webcam HD',
                description: '1080p HD webcam with built-in microphone',
                pricing2025: 79.99,
            },
        ],
    },
    {
        id: 'office',
        name: 'Office Supplies',
        products: [
            {
                id: 'off-001',
                name: 'Notebook Set',
                description: 'Pack of 3 lined notebooks, A5 size',
                pricing2025: 12.99,
            },
            {
                id: 'off-002',
                name: 'Pen Collection',
                description: 'Assorted ballpoint pens, 12-pack',
                pricing2025: 8.99,
            },
            {
                id: 'off-003',
                name: 'Desk Organizer',
                description: 'Bamboo desk organizer with multiple compartments',
                pricing2025: 34.99,
            },
        ],
    },
    {
        id: 'furniture',
        name: 'Furniture',
        products: [
            {
                id: 'furn-001',
                name: 'Ergonomic Chair',
                description: 'Adjustable office chair with lumbar support',
                pricing2025: 249.99,
            },
            {
                id: 'furn-002',
                name: 'Standing Desk',
                description: 'Electric height-adjustable standing desk',
                pricing2025: 499.99,
            },
            {
                id: 'furn-003',
                name: 'Monitor Stand',
                description: 'Wooden monitor stand with storage drawer',
                pricing2025: 45.99,
            },
        ],
    },
    {
        id: 'accessories',
        name: 'Accessories',
        products: [
            {
                id: 'acc-001',
                name: 'Laptop Sleeve',
                description: 'Neoprene laptop sleeve, 15-inch',
                pricing2025: 19.99,
            },
            {
                id: 'acc-002',
                name: 'Cable Management',
                description: 'Cable clips and organizer set',
                pricing2025: 14.99,
            },
            {
                id: 'acc-003',
                name: 'Phone Stand',
                description: 'Adjustable aluminum phone stand',
                pricing2025: 24.99,
            },
            {
                id: 'acc-004',
                name: 'Desk Lamp',
                description: 'LED desk lamp with touch control',
                pricing2025: 39.99,
            },
        ],
    },
    {
        id: 'storage',
        name: 'Storage Solutions',
        products: [
            {
                id: 'stor-001',
                name: 'Filing Cabinet',
                description: '3-drawer metal filing cabinet',
                pricing2025: 129.99,
            },
            {
                id: 'stor-002',
                name: 'Bookshelf',
                description: '5-tier wooden bookshelf',
                pricing2025: 89.99,
            },
            {
                id: 'stor-003',
                name: 'Storage Boxes',
                description: 'Set of 4 decorative storage boxes',
                pricing2025: 29.99,
            },
        ],
    },
];
