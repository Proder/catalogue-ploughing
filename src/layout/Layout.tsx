import type { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="layout">
            <header className="layout-header">
                <div className="container">
                    <h1 className="site-title">Catalogue Order Portal</h1>
                </div>
            </header>
            <main className="layout-main">
                <div className="container">{children}</div>
            </main>
            <footer className="layout-footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Catalogue Order Portal. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
