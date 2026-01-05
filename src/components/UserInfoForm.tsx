import type { UserInfo, ValidationErrors } from '../types';
import './UserInfoForm.css';

interface UserInfoFormProps {
    userInfo: UserInfo;
    validationErrors: ValidationErrors;
    onChange: (field: keyof UserInfo, value: string) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function UserInfoForm({ userInfo, validationErrors, onChange }: UserInfoFormProps) {
    return (
        <section className="user-info-section">
            <h3 className="section-title">Your Information</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="name" className="form-label">
                        Name <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        className={`form-input ${validationErrors.name ? 'error' : ''}`}
                        value={userInfo.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        placeholder="Enter your full name"
                    />
                    {validationErrors.name && (
                        <span className="error-message">{validationErrors.name}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        Email <span className="required">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        className={`form-input ${validationErrors.email ? 'error' : ''}`}
                        value={userInfo.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                    />
                    {validationErrors.email && (
                        <span className="error-message">{validationErrors.email}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="company" className="form-label">
                        Company/Organization
                    </label>
                    <input
                        type="text"
                        id="company"
                        className="form-input"
                        value={userInfo.company || ''}
                        onChange={(e) => onChange('company', e.target.value)}
                        placeholder="Your company (optional)"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                        Phone
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        className="form-input"
                        value={userInfo.phone || ''}
                        onChange={(e) => onChange('phone', e.target.value)}
                        placeholder="Your phone number (optional)"
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
