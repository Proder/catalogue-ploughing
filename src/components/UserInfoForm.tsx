import type { UserInfo, ValidationErrors } from '../types';

interface UserInfoFormProps {
    userInfo: UserInfo;
    validationErrors: ValidationErrors;
    onChange: (field: keyof UserInfo, value: string) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function UserInfoForm({ userInfo, validationErrors, onChange }: UserInfoFormProps) {
    return (
        <section className="card-elevated p-8 mb-10 slide-up">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="section-title">Your Information</h2>
                        <p className="section-subtitle text-sm">Please fill in your contact details</p>
                    </div>
                </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-neutral-700">
                        Full Name <span className="text-error-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        className={`input-field ${validationErrors.name ? 'input-error' : ''}`}
                        value={userInfo.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        placeholder="John Doe"
                    />
                    {validationErrors.name && (
                        <p className="flex items-center gap-1.5 text-sm text-error-600 mt-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {validationErrors.name}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-neutral-700">
                        Email Address <span className="text-error-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        className={`input-field ${validationErrors.email ? 'input-error' : ''}`}
                        value={userInfo.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        placeholder="john@company.com"
                    />
                    {validationErrors.email && (
                        <p className="flex items-center gap-1.5 text-sm text-error-600 mt-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {validationErrors.email}
                        </p>
                    )}
                </div>

                {/* Company */}
                <div className="space-y-2">
                    <label htmlFor="company" className="block text-sm font-semibold text-neutral-700">
                        Company/Organization
                    </label>
                    <input
                        type="text"
                        id="company"
                        className="input-field"
                        value={userInfo.company || ''}
                        onChange={(e) => onChange('company', e.target.value)}
                        placeholder="Acme Inc. (optional)"
                    />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        className="input-field"
                        value={userInfo.phone || ''}
                        onChange={(e) => onChange('phone', e.target.value)}
                        placeholder="+1 (555) 000-0000 (optional)"
                    />
                </div>
            </div>
        </section>
    );
}

export function validateUserInfo(userInfo: UserInfo): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!userInfo.name || userInfo.name.trim().length === 0) {
        errors.name = 'Name is required';
    }

    if (!userInfo.email || userInfo.email.trim().length === 0) {
        errors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(userInfo.email)) {
        errors.email = 'Please enter a valid email address';
    }

    return errors;
}
