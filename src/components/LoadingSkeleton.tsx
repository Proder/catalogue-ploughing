interface ProductSkeletonProps {
    count?: number;
}

export function ProductSkeleton({ count = 6 }: ProductSkeletonProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="p-6 rounded-2xl border-2 border-neutral-200 bg-white animate-pulse"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="h-6 w-40 bg-neutral-200 rounded-lg" />
                        <div className="h-8 w-16 bg-neutral-200 rounded-lg" />
                    </div>

                    {/* Description */}
                    <div className="space-y-2 mb-6">
                        <div className="h-4 w-full bg-neutral-200 rounded" />
                        <div className="h-4 w-2/3 bg-neutral-200 rounded" />
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex gap-3">
                        <div className="h-11 w-11 bg-neutral-200 rounded-xl" />
                        <div className="h-11 flex-1 bg-neutral-200 rounded-xl" />
                        <div className="h-11 w-11 bg-neutral-200 rounded-xl" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function CategoryTabsSkeleton() {
    return (
        <div className="flex flex-wrap gap-3 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="h-12 bg-neutral-200 rounded-xl"
                    style={{ width: `${80 + Math.random() * 60}px` }}
                />
            ))}
        </div>
    );
}

export function FormSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-4 w-24 bg-neutral-200 rounded" />
                        <div className="h-12 w-full bg-neutral-200 rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    );
}
