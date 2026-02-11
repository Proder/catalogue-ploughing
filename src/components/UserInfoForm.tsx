import type { UserInfo, ValidationErrors } from '../types';

interface UserInfoFormProps {
    userInfo: UserInfo;
    validationErrors: ValidationErrors;
    onChange: (field: keyof UserInfo, value: any) => void;
    readOnly?: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Dummy data for dropdowns
const DEPARTMENTS = [
    'Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'Other'
];

const HUBS = [
    'Main Hall', 'Outdoor Arena', 'Food Court', 'Tech Zone', 'Agri-Hub'
];

export function UserInfoForm({ userInfo, validationErrors, onChange, readOnly = false }: UserInfoFormProps) {
    return (
        <section className={`card-elevated p-8 mb-10 slide-up ${readOnly ? 'opacity-90 pointer-events-none bg-gray-50' : ''}`}>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="section-title">Step 1: Information</h2>
                        <p className="section-subtitle text-sm">Please provide your contact and stand details</p>
                    </div>
                </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-neutral-700">
                        Primary Contact - Full Name <span className="text-error-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        className={`input-field ${validationErrors.name ? 'input-error' : ''}`}
                        value={userInfo.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        placeholder="John Doe"
                        disabled={readOnly}
                    />
                    {validationErrors.name && (
                        <p className="text-error-600 text-sm mt-1">{validationErrors.name}</p>
                    )}
                </div>

                {/* Department */}
                <div className="space-y-2">
                    <label htmlFor="department" className="block text-sm font-semibold text-neutral-700">
                        Department / Organisation <span className="text-error-500">*</span>
                    </label>
                    <select
                        id="department"
                        className={`input-field ${validationErrors.department ? 'input-error' : ''}`}
                        value={userInfo.department || ''}
                        onChange={(e) => onChange('department', e.target.value)}
                        disabled={readOnly}
                    >
                        <option value="">Select Department</option>
                        {DEPARTMENTS.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    {validationErrors.department && (
                        <p className="text-error-600 text-sm mt-1">{validationErrors.department}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-neutral-700">
                        Email Address - Lead <span className="text-error-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        className={`input-field ${validationErrors.email ? 'input-error' : ''}`}
                        value={userInfo.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        placeholder="john@company.com"
                        disabled={readOnly}
                    />
                    {validationErrors.email && (
                        <p className="text-error-600 text-sm mt-1">{validationErrors.email}</p>
                    )}
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                    <label htmlFor="mobile" className="block text-sm font-semibold text-neutral-700">
                        Mobile Number
                    </label>
                    <input
                        type="tel"
                        id="mobile"
                        className="input-field"
                        value={userInfo.mobile || ''}
                        onChange={(e) => onChange('mobile', e.target.value)}
                        placeholder="+353 00 000 0000"
                        disabled={readOnly}
                    />
                </div>

                {/* Backup Name */}
                <div className="space-y-2">
                    <label htmlFor="backupName" className="block text-sm font-semibold text-neutral-700">
                        Back-up Contact - Full Name <span className="text-error-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="backupName"
                        className={`input-field ${validationErrors.backupName ? 'input-error' : ''}`}
                        value={userInfo.backupName || ''}
                        onChange={(e) => onChange('backupName', e.target.value)}
                        placeholder="Jane Doe"
                        disabled={readOnly}
                    />
                    {validationErrors.backupName && (
                        <p className="text-error-600 text-sm mt-1">{validationErrors.backupName}</p>
                    )}
                </div>

                {/* Backup Email */}
                <div className="space-y-2">
                    <label htmlFor="backupEmail" className="block text-sm font-semibold text-neutral-700">
                        Back-up Contact Email <span className="text-error-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="backupEmail"
                        className={`input-field ${validationErrors.backupEmail ? 'input-error' : ''}`}
                        value={userInfo.backupEmail || ''}
                        onChange={(e) => onChange('backupEmail', e.target.value)}
                        placeholder="jane@company.com"
                        disabled={readOnly}
                    />
                    {validationErrors.backupEmail && (
                        <p className="text-error-600 text-sm mt-1">{validationErrors.backupEmail}</p>
                    )}
                </div>

                {/* Hub */}
                <div className="space-y-2">
                    <label htmlFor="hub" className="block text-sm font-semibold text-neutral-700">
                        Hub / Theme <span className="text-error-500">*</span>
                    </label>
                    <select
                        id="hub"
                        className={`input-field ${validationErrors.hub ? 'input-error' : ''}`}
                        value={userInfo.hub || ''}
                        onChange={(e) => onChange('hub', e.target.value)}
                        disabled={readOnly}
                    >
                        <option value="">Select Hub</option>
                        {HUBS.map(hub => (
                            <option key={hub} value={hub}>{hub}</option>
                        ))}
                    </select>
                    {validationErrors.hub && (
                        <p className="text-error-600 text-sm mt-1">{validationErrors.hub}</p>
                    )}
                </div>

                {/* Same Requirements (Full width) */}
                <div className="col-span-1 md:col-span-2 space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Same requirements as last year? (Same stand size)
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="sameRequirements"
                                className="w-4 h-4 text-primary-600"
                                checked={userInfo.sameRequirements === true}
                                onChange={() => onChange('sameRequirements', true)}
                                disabled={readOnly}
                            />
                            <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="sameRequirements"
                                className="w-4 h-4 text-primary-600"
                                checked={userInfo.sameRequirements === false}
                                onChange={() => onChange('sameRequirements', false)}
                                disabled={readOnly}
                            />
                            <span>No</span>
                        </label>
                    </div>
                </div>

            </div>
        </section>
    );
}

export function validateUserInfo(userInfo: UserInfo): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!userInfo.name?.trim()) errors.name = 'Name is required';
    if (!userInfo.email?.trim()) {
        errors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(userInfo.email)) {
        errors.email = 'Invalid email address';
    }

    if (!userInfo.department) errors.department = 'Department is required';
    if (!userInfo.hub) errors.hub = 'Hub is required';

    if (!userInfo.backupName?.trim()) errors.backupName = 'Back-up contact name is required';
    if (!userInfo.backupEmail?.trim()) {
        errors.backupEmail = 'Back-up contact email is required';
    } else if (!EMAIL_REGEX.test(userInfo.backupEmail)) {
        errors.backupEmail = 'Invalid email address';
    }

    return errors;
}
