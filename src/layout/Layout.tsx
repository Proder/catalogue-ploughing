import type { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral-50 to-neutral-100">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-primary-500 border-b border-primary-600">
                <div className="section-container">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white tracking-tight">
                                    Catalogue Portal
                                </h1>
                            </div>
                        </div>

                        {/* Nav */}
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Products</a>
                            <a href="#" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Orders</a>
                            <a href="#" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Support</a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 py-8">
                <div className="section-container">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-neutral-900 text-neutral-400 py-12 mt-auto">
                <div className="section-container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-white">Catalogue Portal</span>
                            </div>
                            <p className="text-sm leading-relaxed">
                                Streamline your ordering process with our modern catalogue management system.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Browse Products</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm">
                                <li>support@catalogue.com</li>
                                <li>+1 (555) 123-4567</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-10 pt-8 border-t border-neutral-800 text-center text-sm">
                        © {new Date().getFullYear()} Catalogue Portal. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
