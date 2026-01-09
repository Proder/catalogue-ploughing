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
                            <img
                                src="/logo.jpeg"
                                alt="Catalogue Ploughing Logo"
                                className="w-10 h-10 rounded-lg object-cover shadow-lg"
                            />
                            <div>
                                <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
                                    Catalogue Ploughing
                                </h1>
                            </div>
                        </div>


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
                                <img
                                    src="/logo.jpeg"
                                    alt="Catalogue Ploughing Logo"
                                    className="w-10 h-10 rounded-lg object-cover"
                                />
                                <span className="font-semibold text-white">Catalogue Ploughing</span>
                            </div>
                            <p className="text-sm leading-relaxed">
                                Streamline your ordering process with our modern catalogue management system.
                            </p>
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
