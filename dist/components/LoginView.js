'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation.js';
import { createPayloadAuthClient } from '../exports/client.js';
import { hasAnyRole, hasAllRoles } from '../utils/access.js';
/**
 * Check if user has the required role(s)
 */ function checkUserRoles(user, requiredRole, requireAllRoles) {
    // No role requirement = access granted
    if (!requiredRole) return true;
    // No user = access denied
    if (!user) return false;
    const roles = Array.isArray(requiredRole) ? requiredRole : [
        requiredRole
    ];
    if (requireAllRoles) {
        return hasAllRoles(user, roles);
    }
    return hasAnyRole(user, roles);
}
export function LoginView({ authClient: providedClient, logo, title = 'Login', afterLoginPath = '/admin', requiredRole = 'admin', requireAllRoles = false, enablePasskey = 'auto', enableSignUp = 'auto', defaultSignUpRole = 'user', enableForgotPassword = 'auto', resetPasswordUrl }) {
    const router = useRouter();
    // View state
    const [viewMode, setViewMode] = useState('login');
    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // UI state
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [passkeyLoading, setPasskeyLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);
    // Feature availability
    const [passkeyAvailable, setPasskeyAvailable] = useState(enablePasskey === true);
    const [signUpAvailable, setSignUpAvailable] = useState(enableSignUp === true);
    const [forgotPasswordAvailable, setForgotPasswordAvailable] = useState(enableForgotPassword === true);
    // Two-factor authentication state
    const [totpCode, setTotpCode] = useState('');
    const [totpLoading, setTotpLoading] = useState(false);
    const getClient = ()=>providedClient ?? createPayloadAuthClient();
    // Check if user is already logged in on mount
    useEffect(()=>{
        async function checkSession() {
            try {
                const client = getClient();
                const result = await client.getSession();
                if (result.data?.user) {
                    const user = result.data.user;
                    // User is logged in, check role
                    if (checkUserRoles(user, requiredRole, requireAllRoles)) {
                        router.push(afterLoginPath);
                        return;
                    } else {
                        setAccessDenied(true);
                    }
                }
            } catch  {
            // No session, show login form
            }
            setCheckingSession(false);
        }
        checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        afterLoginPath,
        requiredRole,
        requireAllRoles,
        router
    ]);
    // Auto-detect passkey availability if set to 'auto'
    useEffect(()=>{
        if (enablePasskey === 'auto') {
            // Check if passkey endpoint exists (GET request)
            // Better Auth passkey routes are at /passkey/* (singular)
            fetch('/api/auth/passkey/generate-authenticate-options', {
                method: 'GET',
                credentials: 'include'
            }).then((res)=>{
                // If we get a response (even 400/401 for not authenticated), passkey is available
                // 404 means passkey plugin is not installed
                setPasskeyAvailable(res.status !== 404);
            }).catch(()=>{
                setPasskeyAvailable(false);
            });
        } else {
            setPasskeyAvailable(enablePasskey === true);
        }
    }, [
        enablePasskey
    ]);
    // Auto-detect sign up availability if set to 'auto'
    useEffect(()=>{
        if (enableSignUp === 'auto') {
            // Check if sign-up endpoint exists
            fetch('/api/auth/sign-up/email', {
                method: 'OPTIONS',
                credentials: 'include'
            }).then((res)=>{
                // 404 means sign-up is not available
                setSignUpAvailable(res.status !== 404);
            }).catch(()=>{
                // If OPTIONS fails, try a HEAD or just assume it's available since it's a core endpoint
                setSignUpAvailable(true);
            });
        } else {
            setSignUpAvailable(enableSignUp === true);
        }
    }, [
        enableSignUp
    ]);
    // Auto-detect forgot password availability if set to 'auto'
    useEffect(()=>{
        if (enableForgotPassword === 'auto') {
            // Check if request-password-reset endpoint exists
            fetch('/api/auth/request-password-reset', {
                method: 'OPTIONS',
                credentials: 'include'
            }).then((res)=>{
                // 404 means request-password-reset is not available
                setForgotPasswordAvailable(res.status !== 404);
            }).catch(()=>{
                // If OPTIONS fails, assume it's available since it's a core endpoint
                setForgotPasswordAvailable(true);
            });
        } else {
            setForgotPasswordAvailable(enableForgotPassword === true);
        }
    }, [
        enableForgotPassword
    ]);
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        setAccessDenied(false);
        try {
            const client = getClient();
            const result = await client.signIn.email({
                email,
                password
            });
            // Check if 2FA is required (use 'in' operator for proper TypeScript inference)
            if (result.data && 'twoFactorRedirect' in result.data && result.data.twoFactorRedirect) {
                setViewMode('twoFactor');
                setLoading(false);
                return;
            }
            if (result.error) {
                setError(result.error.message ?? 'Invalid credentials');
                setLoading(false);
                return;
            }
            if (result.data?.user) {
                const user = result.data.user;
                // Check role if required
                if (!checkUserRoles(user, requiredRole, requireAllRoles)) {
                    setAccessDenied(true);
                    setLoading(false);
                    return;
                }
                router.push(afterLoginPath);
                router.refresh();
            }
        } catch  {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    }
    async function handleSignUp(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }
        // Validate password strength (basic)
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }
        try {
            const client = getClient();
            const result = await client.signUp.email({
                email,
                password,
                name,
                role: defaultSignUpRole
            });
            if (result.error) {
                setError(result.error.message ?? 'Registration failed');
                setLoading(false);
                return;
            }
            // Registration successful - either auto-signed in or need to verify email
            if (result.data?.user) {
                // Re-fetch session to get updated user data (role may have been changed by hooks)
                // This handles cases like firstUserAdmin where the role is set after creation
                const sessionResult = await client.getSession();
                if (sessionResult.data?.user) {
                    const user = sessionResult.data.user;
                    // Check role if required
                    if (!checkUserRoles(user, requiredRole, requireAllRoles)) {
                        setAccessDenied(true);
                        setLoading(false);
                        return;
                    }
                }
                router.push(afterLoginPath);
                router.refresh();
            } else {
                // Likely requires email verification - show success and switch to login
                setSuccessMessage('Account created! Please check your email to verify your account.');
                setViewMode('login');
                setPassword('');
                setConfirmPassword('');
                setLoading(false);
            }
        } catch  {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    }
    async function handleForgotPassword(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const client = getClient();
            const result = await client.requestPasswordReset({
                email,
                redirectTo: resetPasswordUrl ?? `${window.location.origin}/admin/reset-password`
            });
            if (result.error) {
                setError(result.error.message ?? 'Failed to send reset email');
                setLoading(false);
                return;
            }
            // Success - show confirmation
            setViewMode('resetSent');
            setLoading(false);
        } catch  {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    }
    async function handleTotpVerify(e) {
        e.preventDefault();
        setTotpLoading(true);
        setError(null);
        try {
            const client = getClient();
            const result = await client.twoFactor.verifyTotp({
                code: totpCode
            });
            if (result.error) {
                setError(result.error.message ?? 'Invalid verification code');
                setTotpLoading(false);
                return;
            }
            // Verify-totp may not return all user fields (like custom 'role')
            // Fetch the session to get complete user data for role check
            if (requiredRole) {
                const sessionResult = await client.getSession();
                if (sessionResult.data?.user) {
                    const user = sessionResult.data.user;
                    if (!checkUserRoles(user, requiredRole, requireAllRoles)) {
                        setAccessDenied(true);
                        setTotpLoading(false);
                        return;
                    }
                }
            }
            router.push(afterLoginPath);
            router.refresh();
        } catch  {
            setError('An error occurred. Please try again.');
            setTotpLoading(false);
        }
    }
    function switchView(newView) {
        setViewMode(newView);
        setError(null);
        setSuccessMessage(null);
        // Reset form fields based on context
        if (newView === 'login') {
            setTotpCode('');
            setConfirmPassword('');
        } else if (newView === 'register') {
            setPassword('');
            setConfirmPassword('');
        } else if (newView === 'forgotPassword') {
            setPassword('');
        }
    }
    function handleBackToLogin() {
        switchView('login');
    }
    async function handlePasskeySignIn() {
        if (!passkeyAvailable) return;
        setPasskeyLoading(true);
        setError(null);
        setAccessDenied(false);
        try {
            const client = getClient();
            const result = await client.signIn.passkey();
            if (result.error) {
                setError(result.error.message ?? 'Passkey authentication failed');
                setPasskeyLoading(false);
                return;
            }
            // Passkey sign-in succeeded - fetch session to get full user data (including role)
            // This is more reliable than checking result.data.user which may vary by SDK version
            const sessionResult = await client.getSession();
            if (sessionResult.data?.user) {
                const user = sessionResult.data.user;
                // Check role if required
                if (!checkUserRoles(user, requiredRole, requireAllRoles)) {
                    setAccessDenied(true);
                    setPasskeyLoading(false);
                    return;
                }
                router.push(afterLoginPath);
                router.refresh();
            } else {
                // Session fetch failed - shouldn't happen after successful passkey auth
                setError('Authentication succeeded but session could not be verified');
                setPasskeyLoading(false);
            }
        } catch (err) {
            if (err instanceof Error && err.name === 'NotAllowedError') {
                setError('Passkey authentication was cancelled or not allowed');
            } else {
                setError(err instanceof Error ? err.message : 'Passkey authentication failed');
            }
            setPasskeyLoading(false);
        }
    }
    async function handleSignOut() {
        const client = getClient();
        await client.signOut();
        setAccessDenied(false);
        router.refresh();
    }
    // Loading state while checking session
    if (checkingSession) {
        return /*#__PURE__*/ _jsx("div", {
            style: {
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--theme-bg)'
            },
            children: /*#__PURE__*/ _jsx("div", {
                style: {
                    color: 'var(--theme-text)',
                    opacity: 0.7
                },
                children: "Loading..."
            })
        });
    }
    // Access denied state
    if (accessDenied) {
        return /*#__PURE__*/ _jsx("div", {
            style: {
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--theme-bg)',
                padding: 'var(--base)'
            },
            children: /*#__PURE__*/ _jsxs("div", {
                style: {
                    background: 'var(--theme-elevation-50)',
                    padding: 'calc(var(--base) * 2)',
                    borderRadius: 'var(--style-radius-m)',
                    boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'center'
                },
                children: [
                    /*#__PURE__*/ _jsx("h1", {
                        style: {
                            color: 'var(--theme-error-500)',
                            fontSize: 'var(--font-size-h3)',
                            fontWeight: 600,
                            margin: '0 0 var(--base) 0'
                        },
                        children: "Access Denied"
                    }),
                    /*#__PURE__*/ _jsx("p", {
                        style: {
                            color: 'var(--theme-text)',
                            opacity: 0.8,
                            marginBottom: 'calc(var(--base) * 1.5)',
                            fontSize: 'var(--font-size-small)'
                        },
                        children: "You don't have permission to access the admin panel. Please contact an administrator if you believe this is an error."
                    }),
                    /*#__PURE__*/ _jsx("button", {
                        onClick: handleSignOut,
                        style: {
                            padding: 'calc(var(--base) * 0.75) calc(var(--base) * 1.5)',
                            background: 'var(--theme-elevation-150)',
                            border: 'none',
                            borderRadius: 'var(--style-radius-s)',
                            color: 'var(--theme-text)',
                            fontSize: 'var(--font-size-base)',
                            cursor: 'pointer'
                        },
                        children: "Sign out and try again"
                    })
                ]
            })
        });
    }
    // Two-factor verification view
    if (viewMode === 'twoFactor') {
        return /*#__PURE__*/ _jsx("div", {
            style: {
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--theme-bg)',
                padding: 'var(--base)'
            },
            children: /*#__PURE__*/ _jsxs("div", {
                style: {
                    background: 'var(--theme-elevation-50)',
                    padding: 'calc(var(--base) * 2)',
                    borderRadius: 'var(--style-radius-m)',
                    boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '400px'
                },
                children: [
                    logo && /*#__PURE__*/ _jsx("div", {
                        style: {
                            textAlign: 'center',
                            marginBottom: 'calc(var(--base) * 1.5)'
                        },
                        children: logo
                    }),
                    /*#__PURE__*/ _jsx("h1", {
                        style: {
                            color: 'var(--theme-text)',
                            fontSize: 'var(--font-size-h3)',
                            fontWeight: 600,
                            margin: '0 0 calc(var(--base) * 0.5) 0',
                            textAlign: 'center'
                        },
                        children: "Two-Factor Authentication"
                    }),
                    /*#__PURE__*/ _jsx("p", {
                        style: {
                            color: 'var(--theme-text)',
                            opacity: 0.7,
                            fontSize: 'var(--font-size-small)',
                            textAlign: 'center',
                            marginBottom: 'calc(var(--base) * 1.5)'
                        },
                        children: "Enter the 6-digit code from your authenticator app"
                    }),
                    /*#__PURE__*/ _jsxs("form", {
                        onSubmit: handleTotpVerify,
                        children: [
                            /*#__PURE__*/ _jsxs("div", {
                                style: {
                                    marginBottom: 'calc(var(--base) * 1.5)'
                                },
                                children: [
                                    /*#__PURE__*/ _jsx("label", {
                                        htmlFor: "totp-code",
                                        style: {
                                            display: 'block',
                                            color: 'var(--theme-text)',
                                            marginBottom: 'calc(var(--base) * 0.5)',
                                            fontSize: 'var(--font-size-small)',
                                            fontWeight: 500
                                        },
                                        children: "Verification Code"
                                    }),
                                    /*#__PURE__*/ _jsx("input", {
                                        id: "totp-code",
                                        type: "text",
                                        inputMode: "numeric",
                                        pattern: "[0-9]*",
                                        autoComplete: "one-time-code",
                                        value: totpCode,
                                        onChange: (e)=>setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6)),
                                        required: true,
                                        placeholder: "000000",
                                        style: {
                                            width: '100%',
                                            padding: 'calc(var(--base) * 0.75)',
                                            background: 'var(--theme-input-bg)',
                                            border: '1px solid var(--theme-elevation-150)',
                                            borderRadius: 'var(--style-radius-s)',
                                            color: 'var(--theme-text)',
                                            fontSize: 'var(--font-size-h4)',
                                            fontFamily: 'monospace',
                                            textAlign: 'center',
                                            letterSpacing: '0.5em',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }
                                    })
                                ]
                            }),
                            error && /*#__PURE__*/ _jsx("div", {
                                style: {
                                    color: 'var(--theme-error-500)',
                                    marginBottom: 'var(--base)',
                                    fontSize: 'var(--font-size-small)',
                                    padding: 'calc(var(--base) * 0.5)',
                                    background: 'var(--theme-error-50)',
                                    borderRadius: 'var(--style-radius-s)',
                                    border: '1px solid var(--theme-error-200)'
                                },
                                children: error
                            }),
                            /*#__PURE__*/ _jsx("button", {
                                type: "submit",
                                disabled: totpLoading || totpCode.length !== 6,
                                style: {
                                    width: '100%',
                                    padding: 'calc(var(--base) * 0.75)',
                                    background: 'var(--theme-elevation-800)',
                                    border: 'none',
                                    borderRadius: 'var(--style-radius-s)',
                                    color: 'var(--theme-elevation-50)',
                                    fontSize: 'var(--font-size-base)',
                                    fontWeight: 500,
                                    cursor: totpLoading || totpCode.length !== 6 ? 'not-allowed' : 'pointer',
                                    opacity: totpLoading || totpCode.length !== 6 ? 0.7 : 1,
                                    transition: 'opacity 150ms ease'
                                },
                                children: totpLoading ? 'Verifying...' : 'Verify'
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("button", {
                        type: "button",
                        onClick: handleBackToLogin,
                        style: {
                            width: '100%',
                            marginTop: 'var(--base)',
                            padding: 'calc(var(--base) * 0.5)',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--theme-text)',
                            opacity: 0.7,
                            fontSize: 'var(--font-size-small)',
                            cursor: 'pointer'
                        },
                        children: "← Back to login"
                    })
                ]
            })
        });
    }
    // Registration view
    if (viewMode === 'register') {
        return /*#__PURE__*/ _jsx("div", {
            style: {
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--theme-bg)',
                padding: 'var(--base)'
            },
            children: /*#__PURE__*/ _jsxs("div", {
                style: {
                    background: 'var(--theme-elevation-50)',
                    padding: 'calc(var(--base) * 2)',
                    borderRadius: 'var(--style-radius-m)',
                    boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '400px'
                },
                children: [
                    logo && /*#__PURE__*/ _jsx("div", {
                        style: {
                            textAlign: 'center',
                            marginBottom: 'calc(var(--base) * 1.5)'
                        },
                        children: logo
                    }),
                    /*#__PURE__*/ _jsx("h1", {
                        style: {
                            color: 'var(--theme-text)',
                            fontSize: 'var(--font-size-h3)',
                            fontWeight: 600,
                            margin: '0 0 calc(var(--base) * 1.5) 0',
                            textAlign: 'center'
                        },
                        children: "Create Account"
                    }),
                    /*#__PURE__*/ _jsxs("form", {
                        onSubmit: handleSignUp,
                        children: [
                            /*#__PURE__*/ _jsxs("div", {
                                style: {
                                    marginBottom: 'var(--base)'
                                },
                                children: [
                                    /*#__PURE__*/ _jsx("label", {
                                        htmlFor: "name",
                                        style: {
                                            display: 'block',
                                            color: 'var(--theme-text)',
                                            marginBottom: 'calc(var(--base) * 0.5)',
                                            fontSize: 'var(--font-size-small)',
                                            fontWeight: 500
                                        },
                                        children: "Name"
                                    }),
                                    /*#__PURE__*/ _jsx("input", {
                                        id: "name",
                                        type: "text",
                                        value: name,
                                        onChange: (e)=>setName(e.target.value),
                                        required: true,
                                        autoComplete: "name",
                                        style: {
                                            width: '100%',
                                            padding: 'calc(var(--base) * 0.75)',
                                            background: 'var(--theme-input-bg)',
                                            border: '1px solid var(--theme-elevation-150)',
                                            borderRadius: 'var(--style-radius-s)',
                                            color: 'var(--theme-text)',
                                            fontSize: 'var(--font-size-base)',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                style: {
                                    marginBottom: 'var(--base)'
                                },
                                children: [
                                    /*#__PURE__*/ _jsx("label", {
                                        htmlFor: "register-email",
                                        style: {
                                            display: 'block',
                                            color: 'var(--theme-text)',
                                            marginBottom: 'calc(var(--base) * 0.5)',
                                            fontSize: 'var(--font-size-small)',
                                            fontWeight: 500
                                        },
                                        children: "Email"
                                    }),
                                    /*#__PURE__*/ _jsx("input", {
                                        id: "register-email",
                                        type: "email",
                                        value: email,
                                        onChange: (e)=>setEmail(e.target.value),
                                        required: true,
                                        autoComplete: "email",
                                        style: {
                                            width: '100%',
                                            padding: 'calc(var(--base) * 0.75)',
                                            background: 'var(--theme-input-bg)',
                                            border: '1px solid var(--theme-elevation-150)',
                                            borderRadius: 'var(--style-radius-s)',
                                            color: 'var(--theme-text)',
                                            fontSize: 'var(--font-size-base)',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                style: {
                                    marginBottom: 'var(--base)'
                                },
                                children: [
                                    /*#__PURE__*/ _jsx("label", {
                                        htmlFor: "register-password",
                                        style: {
                                            display: 'block',
                                            color: 'var(--theme-text)',
                                            marginBottom: 'calc(var(--base) * 0.5)',
                                            fontSize: 'var(--font-size-small)',
                                            fontWeight: 500
                                        },
                                        children: "Password"
                                    }),
                                    /*#__PURE__*/ _jsx("input", {
                                        id: "register-password",
                                        type: "password",
                                        value: password,
                                        onChange: (e)=>setPassword(e.target.value),
                                        required: true,
                                        autoComplete: "new-password",
                                        style: {
                                            width: '100%',
                                            padding: 'calc(var(--base) * 0.75)',
                                            background: 'var(--theme-input-bg)',
                                            border: '1px solid var(--theme-elevation-150)',
                                            borderRadius: 'var(--style-radius-s)',
                                            color: 'var(--theme-text)',
                                            fontSize: 'var(--font-size-base)',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                style: {
                                    marginBottom: 'calc(var(--base) * 1.5)'
                                },
                                children: [
                                    /*#__PURE__*/ _jsx("label", {
                                        htmlFor: "confirm-password",
                                        style: {
                                            display: 'block',
                                            color: 'var(--theme-text)',
                                            marginBottom: 'calc(var(--base) * 0.5)',
                                            fontSize: 'var(--font-size-small)',
                                            fontWeight: 500
                                        },
                                        children: "Confirm Password"
                                    }),
                                    /*#__PURE__*/ _jsx("input", {
                                        id: "confirm-password",
                                        type: "password",
                                        value: confirmPassword,
                                        onChange: (e)=>setConfirmPassword(e.target.value),
                                        required: true,
                                        autoComplete: "new-password",
                                        style: {
                                            width: '100%',
                                            padding: 'calc(var(--base) * 0.75)',
                                            background: 'var(--theme-input-bg)',
                                            border: '1px solid var(--theme-elevation-150)',
                                            borderRadius: 'var(--style-radius-s)',
                                            color: 'var(--theme-text)',
                                            fontSize: 'var(--font-size-base)',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }
                                    })
                                ]
                            }),
                            error && /*#__PURE__*/ _jsx("div", {
                                style: {
                                    color: 'var(--theme-error-500)',
                                    marginBottom: 'var(--base)',
                                    fontSize: 'var(--font-size-small)',
                                    padding: 'calc(var(--base) * 0.5)',
                                    background: 'var(--theme-error-50)',
                                    borderRadius: 'var(--style-radius-s)',
                                    border: '1px solid var(--theme-error-200)'
                                },
                                children: error
                            }),
                            /*#__PURE__*/ _jsx("button", {
                                type: "submit",
                                disabled: loading,
                                style: {
                                    width: '100%',
                                    padding: 'calc(var(--base) * 0.75)',
                                    background: 'var(--theme-elevation-800)',
                                    border: 'none',
                                    borderRadius: 'var(--style-radius-s)',
                                    color: 'var(--theme-elevation-50)',
                                    fontSize: 'var(--font-size-base)',
                                    fontWeight: 500,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1,
                                    transition: 'opacity 150ms ease'
                                },
                                children: loading ? 'Creating account...' : 'Create Account'
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        style: {
                            marginTop: 'calc(var(--base) * 1.5)',
                            textAlign: 'center',
                            fontSize: 'var(--font-size-small)',
                            color: 'var(--theme-text)',
                            opacity: 0.8
                        },
                        children: [
                            "Already have an account?",
                            ' ',
                            /*#__PURE__*/ _jsx("button", {
                                type: "button",
                                onClick: handleBackToLogin,
                                style: {
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--theme-elevation-800)',
                                    cursor: 'pointer',
                                    fontSize: 'inherit',
                                    textDecoration: 'underline',
                                    padding: 0
                                },
                                children: "Sign in"
                            })
                        ]
                    })
                ]
            })
        });
    }
    // Forgot password view
    if (viewMode === 'forgotPassword') {
        return /*#__PURE__*/ _jsx("div", {
            style: {
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--theme-bg)',
                padding: 'var(--base)'
            },
            children: /*#__PURE__*/ _jsxs("div", {
                style: {
                    background: 'var(--theme-elevation-50)',
                    padding: 'calc(var(--base) * 2)',
                    borderRadius: 'var(--style-radius-m)',
                    boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '400px'
                },
                children: [
                    logo && /*#__PURE__*/ _jsx("div", {
                        style: {
                            textAlign: 'center',
                            marginBottom: 'calc(var(--base) * 1.5)'
                        },
                        children: logo
                    }),
                    /*#__PURE__*/ _jsx("h1", {
                        style: {
                            color: 'var(--theme-text)',
                            fontSize: 'var(--font-size-h3)',
                            fontWeight: 600,
                            margin: '0 0 calc(var(--base) * 0.5) 0',
                            textAlign: 'center'
                        },
                        children: "Reset Password"
                    }),
                    /*#__PURE__*/ _jsx("p", {
                        style: {
                            color: 'var(--theme-text)',
                            opacity: 0.7,
                            fontSize: 'var(--font-size-small)',
                            textAlign: 'center',
                            marginBottom: 'calc(var(--base) * 1.5)'
                        },
                        children: "Enter your email and we'll send you a link to reset your password"
                    }),
                    /*#__PURE__*/ _jsxs("form", {
                        onSubmit: handleForgotPassword,
                        children: [
                            /*#__PURE__*/ _jsxs("div", {
                                style: {
                                    marginBottom: 'calc(var(--base) * 1.5)'
                                },
                                children: [
                                    /*#__PURE__*/ _jsx("label", {
                                        htmlFor: "forgot-email",
                                        style: {
                                            display: 'block',
                                            color: 'var(--theme-text)',
                                            marginBottom: 'calc(var(--base) * 0.5)',
                                            fontSize: 'var(--font-size-small)',
                                            fontWeight: 500
                                        },
                                        children: "Email"
                                    }),
                                    /*#__PURE__*/ _jsx("input", {
                                        id: "forgot-email",
                                        type: "email",
                                        value: email,
                                        onChange: (e)=>setEmail(e.target.value),
                                        required: true,
                                        autoComplete: "email",
                                        style: {
                                            width: '100%',
                                            padding: 'calc(var(--base) * 0.75)',
                                            background: 'var(--theme-input-bg)',
                                            border: '1px solid var(--theme-elevation-150)',
                                            borderRadius: 'var(--style-radius-s)',
                                            color: 'var(--theme-text)',
                                            fontSize: 'var(--font-size-base)',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }
                                    })
                                ]
                            }),
                            error && /*#__PURE__*/ _jsx("div", {
                                style: {
                                    color: 'var(--theme-error-500)',
                                    marginBottom: 'var(--base)',
                                    fontSize: 'var(--font-size-small)',
                                    padding: 'calc(var(--base) * 0.5)',
                                    background: 'var(--theme-error-50)',
                                    borderRadius: 'var(--style-radius-s)',
                                    border: '1px solid var(--theme-error-200)'
                                },
                                children: error
                            }),
                            /*#__PURE__*/ _jsx("button", {
                                type: "submit",
                                disabled: loading,
                                style: {
                                    width: '100%',
                                    padding: 'calc(var(--base) * 0.75)',
                                    background: 'var(--theme-elevation-800)',
                                    border: 'none',
                                    borderRadius: 'var(--style-radius-s)',
                                    color: 'var(--theme-elevation-50)',
                                    fontSize: 'var(--font-size-base)',
                                    fontWeight: 500,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1,
                                    transition: 'opacity 150ms ease'
                                },
                                children: loading ? 'Sending...' : 'Send Reset Link'
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("button", {
                        type: "button",
                        onClick: handleBackToLogin,
                        style: {
                            width: '100%',
                            marginTop: 'var(--base)',
                            padding: 'calc(var(--base) * 0.5)',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--theme-text)',
                            opacity: 0.7,
                            fontSize: 'var(--font-size-small)',
                            cursor: 'pointer'
                        },
                        children: "← Back to login"
                    })
                ]
            })
        });
    }
    // Reset link sent confirmation view
    if (viewMode === 'resetSent') {
        return /*#__PURE__*/ _jsx("div", {
            style: {
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--theme-bg)',
                padding: 'var(--base)'
            },
            children: /*#__PURE__*/ _jsxs("div", {
                style: {
                    background: 'var(--theme-elevation-50)',
                    padding: 'calc(var(--base) * 2)',
                    borderRadius: 'var(--style-radius-m)',
                    boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'center'
                },
                children: [
                    logo && /*#__PURE__*/ _jsx("div", {
                        style: {
                            marginBottom: 'calc(var(--base) * 1.5)'
                        },
                        children: logo
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        style: {
                            width: '64px',
                            height: '64px',
                            background: 'var(--theme-success-100)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto calc(var(--base) * 1.5)',
                            fontSize: '28px'
                        },
                        children: "✓"
                    }),
                    /*#__PURE__*/ _jsx("h1", {
                        style: {
                            color: 'var(--theme-text)',
                            fontSize: 'var(--font-size-h3)',
                            fontWeight: 600,
                            margin: '0 0 calc(var(--base) * 0.5) 0'
                        },
                        children: "Check Your Email"
                    }),
                    /*#__PURE__*/ _jsxs("p", {
                        style: {
                            color: 'var(--theme-text)',
                            opacity: 0.7,
                            fontSize: 'var(--font-size-small)',
                            marginBottom: 'calc(var(--base) * 1.5)'
                        },
                        children: [
                            "We've sent a password reset link to ",
                            /*#__PURE__*/ _jsx("strong", {
                                children: email
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("p", {
                        style: {
                            color: 'var(--theme-text)',
                            opacity: 0.6,
                            fontSize: 'var(--font-size-small)',
                            marginBottom: 'calc(var(--base) * 1.5)'
                        },
                        children: "Didn't receive the email? Check your spam folder or try again."
                    }),
                    /*#__PURE__*/ _jsx("button", {
                        type: "button",
                        onClick: handleBackToLogin,
                        style: {
                            padding: 'calc(var(--base) * 0.75) calc(var(--base) * 1.5)',
                            background: 'var(--theme-elevation-150)',
                            border: 'none',
                            borderRadius: 'var(--style-radius-s)',
                            color: 'var(--theme-text)',
                            fontSize: 'var(--font-size-base)',
                            cursor: 'pointer'
                        },
                        children: "Back to login"
                    })
                ]
            })
        });
    }
    // Main login view
    return /*#__PURE__*/ _jsx("div", {
        style: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--theme-bg)',
            padding: 'var(--base)'
        },
        children: /*#__PURE__*/ _jsxs("div", {
            style: {
                background: 'var(--theme-elevation-50)',
                padding: 'calc(var(--base) * 2)',
                borderRadius: 'var(--style-radius-m)',
                boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '400px'
            },
            children: [
                logo && /*#__PURE__*/ _jsx("div", {
                    style: {
                        textAlign: 'center',
                        marginBottom: 'calc(var(--base) * 1.5)'
                    },
                    children: logo
                }),
                /*#__PURE__*/ _jsx("h1", {
                    style: {
                        color: 'var(--theme-text)',
                        fontSize: 'var(--font-size-h3)',
                        fontWeight: 600,
                        textAlign: 'center',
                        margin: '0 0 calc(var(--base) * 1.5) 0'
                    },
                    children: title
                }),
                successMessage && /*#__PURE__*/ _jsx("div", {
                    style: {
                        color: 'var(--theme-success-500)',
                        marginBottom: 'var(--base)',
                        fontSize: 'var(--font-size-small)',
                        padding: 'calc(var(--base) * 0.5)',
                        background: 'var(--theme-success-50)',
                        borderRadius: 'var(--style-radius-s)',
                        border: '1px solid var(--theme-success-200)'
                    },
                    children: successMessage
                }),
                /*#__PURE__*/ _jsxs("form", {
                    onSubmit: handleSubmit,
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            style: {
                                marginBottom: 'var(--base)'
                            },
                            children: [
                                /*#__PURE__*/ _jsx("label", {
                                    htmlFor: "email",
                                    style: {
                                        display: 'block',
                                        color: 'var(--theme-text)',
                                        marginBottom: 'calc(var(--base) * 0.5)',
                                        fontSize: 'var(--font-size-small)',
                                        fontWeight: 500
                                    },
                                    children: "Email"
                                }),
                                /*#__PURE__*/ _jsx("input", {
                                    id: "email",
                                    type: "email",
                                    value: email,
                                    onChange: (e)=>setEmail(e.target.value),
                                    required: true,
                                    autoComplete: "email",
                                    style: {
                                        width: '100%',
                                        padding: 'calc(var(--base) * 0.75)',
                                        background: 'var(--theme-input-bg)',
                                        border: '1px solid var(--theme-elevation-150)',
                                        borderRadius: 'var(--style-radius-s)',
                                        color: 'var(--theme-text)',
                                        fontSize: 'var(--font-size-base)',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            style: {
                                marginBottom: 'var(--base)'
                            },
                            children: [
                                /*#__PURE__*/ _jsx("label", {
                                    htmlFor: "password",
                                    style: {
                                        display: 'block',
                                        color: 'var(--theme-text)',
                                        marginBottom: 'calc(var(--base) * 0.5)',
                                        fontSize: 'var(--font-size-small)',
                                        fontWeight: 500
                                    },
                                    children: "Password"
                                }),
                                /*#__PURE__*/ _jsx("input", {
                                    id: "password",
                                    type: "password",
                                    value: password,
                                    onChange: (e)=>setPassword(e.target.value),
                                    required: true,
                                    autoComplete: "current-password",
                                    style: {
                                        width: '100%',
                                        padding: 'calc(var(--base) * 0.75)',
                                        background: 'var(--theme-input-bg)',
                                        border: '1px solid var(--theme-elevation-150)',
                                        borderRadius: 'var(--style-radius-s)',
                                        color: 'var(--theme-text)',
                                        fontSize: 'var(--font-size-base)',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }
                                })
                            ]
                        }),
                        forgotPasswordAvailable && /*#__PURE__*/ _jsx("div", {
                            style: {
                                marginBottom: 'calc(var(--base) * 1.5)',
                                textAlign: 'right'
                            },
                            children: /*#__PURE__*/ _jsx("button", {
                                type: "button",
                                onClick: ()=>switchView('forgotPassword'),
                                style: {
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--theme-text)',
                                    opacity: 0.7,
                                    cursor: 'pointer',
                                    fontSize: 'var(--font-size-small)',
                                    padding: 0,
                                    textDecoration: 'underline'
                                },
                                children: "Forgot password?"
                            })
                        }),
                        error && /*#__PURE__*/ _jsx("div", {
                            style: {
                                color: 'var(--theme-error-500)',
                                marginBottom: 'var(--base)',
                                fontSize: 'var(--font-size-small)',
                                padding: 'calc(var(--base) * 0.5)',
                                background: 'var(--theme-error-50)',
                                borderRadius: 'var(--style-radius-s)',
                                border: '1px solid var(--theme-error-200)'
                            },
                            children: error
                        }),
                        /*#__PURE__*/ _jsx("button", {
                            type: "submit",
                            disabled: loading || passkeyLoading,
                            style: {
                                width: '100%',
                                padding: 'calc(var(--base) * 0.75)',
                                background: 'var(--theme-elevation-800)',
                                border: 'none',
                                borderRadius: 'var(--style-radius-s)',
                                color: 'var(--theme-elevation-50)',
                                fontSize: 'var(--font-size-base)',
                                fontWeight: 500,
                                cursor: loading || passkeyLoading ? 'not-allowed' : 'pointer',
                                opacity: loading || passkeyLoading ? 0.7 : 1,
                                transition: 'opacity 150ms ease'
                            },
                            children: loading ? 'Signing in...' : 'Sign In'
                        })
                    ]
                }),
                passkeyAvailable && /*#__PURE__*/ _jsxs(_Fragment, {
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                margin: 'calc(var(--base) * 1.5) 0',
                                gap: 'calc(var(--base) * 1)'
                            },
                            children: [
                                /*#__PURE__*/ _jsx("div", {
                                    style: {
                                        flex: 1,
                                        height: '1px',
                                        background: 'var(--theme-elevation-150)'
                                    }
                                }),
                                /*#__PURE__*/ _jsx("span", {
                                    style: {
                                        color: 'var(--theme-text)',
                                        opacity: 0.6,
                                        fontSize: 'var(--font-size-small)'
                                    },
                                    children: "or"
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    style: {
                                        flex: 1,
                                        height: '1px',
                                        background: 'var(--theme-elevation-150)'
                                    }
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("button", {
                            type: "button",
                            onClick: handlePasskeySignIn,
                            disabled: loading || passkeyLoading,
                            style: {
                                width: '100%',
                                padding: 'calc(var(--base) * 0.75)',
                                background: 'transparent',
                                border: '1px solid var(--theme-elevation-300)',
                                borderRadius: 'var(--style-radius-s)',
                                color: 'var(--theme-text)',
                                fontSize: 'var(--font-size-base)',
                                fontWeight: 500,
                                cursor: loading || passkeyLoading ? 'not-allowed' : 'pointer',
                                opacity: loading || passkeyLoading ? 0.7 : 1,
                                transition: 'opacity 150ms ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'calc(var(--base) * 0.5)'
                            },
                            children: [
                                /*#__PURE__*/ _jsx("span", {
                                    style: {
                                        fontSize: '18px'
                                    },
                                    children: "🔐"
                                }),
                                passkeyLoading ? 'Authenticating...' : 'Sign in with Passkey'
                            ]
                        })
                    ]
                }),
                signUpAvailable && /*#__PURE__*/ _jsxs("div", {
                    style: {
                        marginTop: 'calc(var(--base) * 1.5)',
                        textAlign: 'center',
                        fontSize: 'var(--font-size-small)',
                        color: 'var(--theme-text)',
                        opacity: 0.8
                    },
                    children: [
                        "Don't have an account?",
                        ' ',
                        /*#__PURE__*/ _jsx("button", {
                            type: "button",
                            onClick: ()=>switchView('register'),
                            style: {
                                background: 'none',
                                border: 'none',
                                color: 'var(--theme-elevation-800)',
                                cursor: 'pointer',
                                fontSize: 'inherit',
                                textDecoration: 'underline',
                                padding: 0
                            },
                            children: "Create account"
                        })
                    ]
                })
            ]
        })
    });
}
export default LoginView;
