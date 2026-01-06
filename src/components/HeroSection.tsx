export function HeroSection() {
    return (
        <section className="relative overflow-hidden rounded-3xl bg-primary-500 p-12 md:p-16 mb-10 fade-in">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Decorative Circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-secondary-400/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-accent-400/15 blur-3xl" />

            {/* Content */}
            <div className="relative text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                    <span className="w-2 h-2 rounded-full bg-accent-300 animate-pulse" />
                    <span className="text-sm font-medium text-white/90">Simple & Fast Ordering</span>
                </div>

                {/* Heading */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                    Welcome to Our
                    <span className="block text-accent-300 mt-2">Product Catalogue</span>
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Browse our collection, select items, and submit your order with ease.
                    Fast processing and seamless experience guaranteed.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-4 max-w-md mx-auto">
                    <div className="flex-1 min-w-[100px] px-5 py-4 rounded-xl bg-white/10 backdrop-blur-sm">
                        <div className="text-3xl font-bold text-white">50+</div>
                        <div className="text-sm text-white/70 font-medium mt-1">Products</div>
                    </div>
                    <div className="flex-1 min-w-[100px] px-5 py-4 rounded-xl bg-white/10 backdrop-blur-sm">
                        <div className="text-3xl font-bold text-white">5</div>
                        <div className="text-sm text-white/70 font-medium mt-1">Categories</div>
                    </div>
                    <div className="flex-1 min-w-[100px] px-5 py-4 rounded-xl bg-white/10 backdrop-blur-sm">
                        <div className="text-3xl font-bold text-white">24h</div>
                        <div className="text-sm text-white/70 font-medium mt-1">Processing</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
