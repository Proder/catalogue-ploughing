import { useState, useRef, useEffect, type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkEmail, requestOTP, verifyOTP } from '../api/authClient';

interface AuthGateProps {
    children: ReactNode;
}

type AuthStep = 'email' | 'otp' | 'loading';

export function AuthGate({ children }: AuthGateProps) {
    const { isAuthenticated, isLoading, setAuthenticated } = useAuth();
    const [step, setStep] = useState<AuthStep>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Handle resend cooldown
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-neutral-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If authenticated, show the app
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // Handle email submission
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // First check if email is authorized
            const checkResult = await checkEmail(email);

            if (!checkResult.success) {
                setError(checkResult.message);
                setIsSubmitting(false);
                return;
            }

            // Send OTP
            const otpResult = await requestOTP(email);

            if (otpResult.success) {
                setStep('otp');
                setResendCooldown(60); // 60 second cooldown
            } else {
                setError(otpResult.message);
            }
        } catch (err) {
            setError('Failed to connect. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle OTP input
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only digits

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only last character
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    // Handle OTP paste
    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(''));
            otpRefs.current[5]?.focus();
        }
    };

    // Handle OTP keydown (backspace)
    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    // Handle OTP verification
    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            setError('Please enter all 6 digits');
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await verifyOTP(email, otpCode);

            if (result.success && result.sessionToken) {
                setAuthenticated(email, result.sessionToken);
            } else {
                setError(result.message);
                setOtp(['', '', '', '', '', '']);
                otpRefs.current[0]?.focus();
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle resend
    const handleResend = async () => {
        if (resendCooldown > 0) return;

        setError(null);
        setIsSubmitting(true);

        try {
            const result = await requestOTP(email);
            if (result.success) {
                setResendCooldown(60);
                setOtp(['', '', '', '', '', '']);
            } else {
                setError(result.message);
            }
        } catch {
            setError('Failed to resend code.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100 px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary-500 px-8 py-10 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden mb-4">
                            <img
                                src="/logo.jpeg"
                                alt="Catalogue Ploughing Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Catalogue Ploughing</h1>
                        <p className="text-white/80 mt-2 text-sm">
                            {step === 'email'
                                ? 'Enter your email to access the product catalogue'
                                : 'Check your email for the access code'
                            }
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {step === 'email' ? (
                            <form onSubmit={handleEmailSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your.email@company.com"
                                        className="input-field"
                                        required
                                        autoFocus
                                    />
                                </div>

                                {error && (
                                    <div className="flex items-start gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !email}
                                    className="w-full btn-primary py-4 text-base"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Checking...
                                        </span>
                                    ) : (
                                        'Request Access Code'
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleOtpSubmit} className="space-y-6">
                                <div>
                                    <p className="text-sm text-neutral-600 mb-4 text-center">
                                        We sent a 6-digit code to<br />
                                        <strong className="text-neutral-900">{email}</strong>
                                    </p>

                                    {/* OTP Input */}
                                    <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => { otpRefs.current[index] = el; }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                className="w-12 h-14 text-center text-xl font-bold border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all"
                                                autoFocus={index === 0}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-start gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                                        </svg>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting || otp.some(d => !d)}
                                    className="w-full btn-primary py-4 text-base"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Verifying...
                                        </span>
                                    ) : (
                                        'Verify Code'
                                    )}
                                </button>

                                {/* Resend */}
                                <div className="text-center text-sm">
                                    <span className="text-neutral-500">Didn't receive it? </span>
                                    {resendCooldown > 0 ? (
                                        <span className="text-neutral-400">Resend in {resendCooldown}s</span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            disabled={isSubmitting}
                                            className="text-primary-600 hover:text-primary-700 font-semibold"
                                        >
                                            Resend Code
                                        </button>
                                    )}
                                </div>

                                {/* Back to email */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep('email');
                                        setOtp(['', '', '', '', '', '']);
                                        setError(null);
                                    }}
                                    className="w-full text-sm text-neutral-500 hover:text-neutral-700"
                                >
                                    ← Use a different email
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-neutral-500 mt-6">
                    Authorized personnel only.<br />
                    Contact admin if you need access.
                </p>
            </div>
        </div>
    );
}
