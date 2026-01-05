import './HeroSection.css';

export function HeroSection() {
    return (
        <section className="hero">
            <h2 className="hero-title">Welcome to Our Catalogue</h2>
            <p className="hero-description">
                Browse through our extensive collection of products across multiple categories.
                Select the items you need, specify quantities, and submit your order with ease.
            </p>
            <p className="hero-subheading">
                Simply fill in your details below, choose items from our catalog, and we'll process your order promptly.
            </p>
        </section>
    );
}
