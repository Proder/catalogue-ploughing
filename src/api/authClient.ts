/**
 * Authentication API client
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface AuthResponse {
    success: boolean;
    message: string;
    sessionToken?: string;
    email?: string;
}

/**
 * Check if email is in the whitelist
 */
export async function checkEmail(email: string): Promise<AuthResponse> {
    try {
        if (!API_BASE_URL) {
            // Development mode - allow all emails
            console.warn('API not configured - allowing all emails in dev mode');
            return { success: true, message: 'Email authorized (dev mode)' };
        }

        const response = await fetch(
            `${API_BASE_URL}?action=checkEmail&email=${encodeURIComponent(email)}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to check email:', error);
        throw error;
    }
}

/**
 * Request OTP to be sent to email
 */
export async function requestOTP(email: string): Promise<AuthResponse> {
    try {
        if (!API_BASE_URL) {
            // Development mode - simulate OTP
            console.warn('API not configured - simulating OTP in dev mode');
            console.log('DEV MODE: OTP would be sent to', email);
            console.log('DEV MODE: Use code 123456 to login');
            return { success: true, message: 'OTP sent (dev mode - use 123456)' };
        }

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({
                action: 'sendOTP',
                email: email,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to send OTP:', error);
        throw error;
    }
}

/**
 * Verify OTP code
 */
export async function verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    try {
        if (!API_BASE_URL) {
            // Development mode - accept 123456
            if (otp === '123456') {
                const devToken = btoa(JSON.stringify({
                    email,
                    expires: Date.now() + 24 * 60 * 60 * 1000
                }));
                return {
                    success: true,
                    message: 'Verified (dev mode)',
                    sessionToken: devToken,
                    email
                };
            }
            return { success: false, message: 'Invalid code. In dev mode, use 123456' };
        }

        const response = await fetch(
            `${API_BASE_URL}?action=verifyOTP&email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to verify OTP:', error);
        throw error;
    }
}
