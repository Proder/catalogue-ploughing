import type { Phase1Data, ValidationErrors } from '../types';

interface Phase1FormProps {
    data: Phase1Data;
    validationErrors: ValidationErrors;
    onChange: (field: keyof Phase1Data, value: any) => void;
    readOnly?: boolean;
}

export function Phase1Form({ data, validationErrors, onChange, readOnly = false }: Phase1FormProps) {
    return (
        <section className={`card-elevated p-8 mb-10 slide-up ${readOnly ? 'opacity-90 pointer-events-none bg-gray-50' : ''}`}>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="section-title">Phase 1: Requirements</h2>
                        <p className="section-subtitle text-sm">Specific exhibition details and requests</p>
                    </div>
                </div>
            </div>

            {/* Form Grid */}
            <div className="space-y-8">



                {/* Spatial Requirements */}
                <div className="bg-white p-6 rounded-lg border border-neutral-200">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-4">Spatial Requirements</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Exhibition Footprint (Width x Depth) <span className="text-error-500">*</span>
                            </label>
                            <p className="text-xs text-neutral-500 mb-2">
                                Needs to be free form. If complex, break down e.g. "3m x 2m AND 3m x 2m"
                            </p>
                            <input
                                type="text"
                                className={`input-field ${validationErrors.footprint ? 'input-error' : ''}`}
                                value={data.footprint || ''}
                                onChange={(e) => onChange('footprint', e.target.value)}
                                placeholder="e.g. 3m x 5m"
                                disabled={readOnly}
                            />
                            {validationErrors.footprint && (
                                <p className="text-error-600 text-sm mt-1">{validationErrors.footprint}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white p-6 rounded-lg border border-neutral-200">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-4">Location</h3>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Specific requests regarding location
                        </label>
                        <p className="text-xs text-neutral-500 mb-2">
                            e.g. Preferred neighbours, corner, island display. (Not guaranteed)
                        </p>
                        <textarea
                            className="input-field h-24 resize-none"
                            value={data.locationRequests || ''}
                            onChange={(e) => onChange('locationRequests', e.target.value)}
                            placeholder="Enter your location preferences..."
                            disabled={readOnly}
                        />
                    </div>
                </div>

                {/* Storage */}
                <div className="bg-white p-6 rounded-lg border border-neutral-200">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-4">Storage</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-6">
                            <span className="font-medium">Shared storage requirement?</span>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        className="w-4 h-4 text-purple-600"
                                        checked={data.sharedStorage === true}
                                        onChange={() => onChange('sharedStorage', true)}
                                        disabled={readOnly}
                                    />
                                    <span>Yes</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        className="w-4 h-4 text-purple-600"
                                        checked={data.sharedStorage === false}
                                        onChange={() => onChange('sharedStorage', false)}
                                        disabled={readOnly}
                                    />
                                    <span>No</span>
                                </label>
                            </div>
                        </div>

                        {data.sharedStorage && (
                            <div className="slide-up">
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    Requirement in metres square <span className="text-error-500">*</span>
                                </label>
                                <p className="text-xs text-neutral-500 mb-2">
                                    Department leads need to ensure ample storage space is booked in advance.
                                </p>
                                <input
                                    type="text"
                                    className={`input-field ${validationErrors.storageSize ? 'input-error' : ''}`}
                                    value={data.storageSize || ''}
                                    onChange={(e) => onChange('storageSize', e.target.value)}
                                    placeholder="e.g. 1 metres squared"
                                    disabled={readOnly}
                                />
                                {validationErrors.storageSize && (
                                    <p className="text-error-600 text-sm mt-1">{validationErrors.storageSize}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
}

export function validatePhase1Data(data: Phase1Data): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!data.footprint?.trim()) {
        errors.footprint = 'Exhibition footprint is required';
    }

    if (data.sharedStorage && !data.storageSize?.trim()) {
        errors.storageSize = 'Storage size is required when shared storage is selected';
    }

    return errors;
}
