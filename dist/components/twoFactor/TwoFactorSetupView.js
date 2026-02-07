'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
/**
 * Two-factor authentication setup component.
 * Displays QR code for TOTP apps and allows verification.
 * Uses Better Auth's twoFactor plugin endpoints.
 */ export function TwoFactorSetupView({ logo, title = 'Set Up Two-Factor Authentication', afterSetupPath = '/admin', onSetupComplete }) {
    const [step, setStep] = useState('loading');
    const [totpUri, setTotpUri] = useState(null);
    const [secret, setSecret] = useState(null);
    const [backupCodes, setBackupCodes] = useState([]);
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        async function enableTwoFactor() {
            try {
                const response = await fetch('/api/auth/two-factor/enable', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({})
                });
                if (response.ok) {
                    const data = await response.json();
                    setTotpUri(data.totpURI);
                    setSecret(data.secret);
                    setBackupCodes(data.backupCodes || []);
                    setStep('qr');
                } else {
                    const data = await response.json().catch(()=>({}));
                    setError(data.message || 'Failed to enable two-factor authentication.');
                    setStep('qr');
                }
            } catch  {
                setError('An error occurred. Please try again.');
                setStep('qr');
            }
        }
        enableTwoFactor();
    }, []);
    async function handleVerify(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/two-factor/verify-totp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    code: verificationCode
                })
            });
            if (response.ok) {
                if (backupCodes.length > 0) {
                    setStep('backup');
                } else {
                    setStep('complete');
                    onSetupComplete?.();
                }
            } else {
                const data = await response.json().catch(()=>({}));
                setError(data.message || 'Invalid verification code. Please try again.');
            }
        } catch  {
            setError('An error occurred. Please try again.');
        } finally{
            setLoading(false);
        }
    }
    function handleBackupContinue() {
        setStep('complete');
        onSetupComplete?.();
    }
    // Loading state
    if (step === 'loading') {
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
                children: "Setting up two-factor authentication..."
            })
        });
    }
    // Complete state
    if (step === 'complete') {
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
                    /*#__PURE__*/ _jsx("h1", {
                        style: {
                            color: 'var(--theme-success-500)',
                            fontSize: 'var(--font-size-h3)',
                            fontWeight: 600,
                            margin: '0 0 var(--base) 0'
                        },
                        children: "Two-Factor Enabled!"
                    }),
                    /*#__PURE__*/ _jsx("p", {
                        style: {
                            color: 'var(--theme-text)',
                            opacity: 0.8,
                            marginBottom: 'calc(var(--base) * 1.5)',
                            fontSize: 'var(--font-size-small)'
                        },
                        children: "Your account is now protected with two-factor authentication."
                    }),
                    /*#__PURE__*/ _jsx("a", {
                        href: afterSetupPath,
                        style: {
                            display: 'inline-block',
                            padding: 'calc(var(--base) * 0.75) calc(var(--base) * 1.5)',
                            background: 'var(--theme-elevation-800)',
                            border: 'none',
                            borderRadius: 'var(--style-radius-s)',
                            color: 'var(--theme-elevation-50)',
                            fontSize: 'var(--font-size-base)',
                            fontWeight: 500,
                            textDecoration: 'none'
                        },
                        children: "Continue"
                    })
                ]
            })
        });
    }
    // Backup codes state
    if (step === 'backup') {
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
                    maxWidth: '450px'
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
                        children: "Save Your Backup Codes"
                    }),
                    /*#__PURE__*/ _jsx("p", {
                        style: {
                            color: 'var(--theme-text)',
                            opacity: 0.7,
                            fontSize: 'var(--font-size-small)',
                            textAlign: 'center',
                            marginBottom: 'calc(var(--base) * 1.5)'
                        },
                        children: "Store these codes safely. You can use them to access your account if you lose your authenticator."
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        style: {
                            background: 'var(--theme-elevation-100)',
                            padding: 'var(--base)',
                            borderRadius: 'var(--style-radius-s)',
                            marginBottom: 'calc(var(--base) * 1.5)',
                            fontFamily: 'monospace',
                            fontSize: 'var(--font-size-small)'
                        },
                        children: /*#__PURE__*/ _jsx("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: 'calc(var(--base) * 0.5)'
                            },
                            children: backupCodes.map((code, index)=>/*#__PURE__*/ _jsx("div", {
                                    style: {
                                        color: 'var(--theme-text)',
                                        padding: 'calc(var(--base) * 0.25)'
                                    },
                                    children: code
                                }, index))
                        })
                    }),
                    /*#__PURE__*/ _jsx("button", {
                        onClick: ()=>{
                            navigator.clipboard.writeText(backupCodes.join('\n'));
                        },
                        style: {
                            width: '100%',
                            padding: 'calc(var(--base) * 0.5)',
                            background: 'var(--theme-elevation-150)',
                            border: 'none',
                            borderRadius: 'var(--style-radius-s)',
                            color: 'var(--theme-text)',
                            fontSize: 'var(--font-size-small)',
                            cursor: 'pointer',
                            marginBottom: 'var(--base)'
                        },
                        children: "Copy to Clipboard"
                    }),
                    /*#__PURE__*/ _jsx("button", {
                        onClick: handleBackupContinue,
                        style: {
                            width: '100%',
                            padding: 'calc(var(--base) * 0.75)',
                            background: 'var(--theme-elevation-800)',
                            border: 'none',
                            borderRadius: 'var(--style-radius-s)',
                            color: 'var(--theme-elevation-50)',
                            fontSize: 'var(--font-size-base)',
                            fontWeight: 500,
                            cursor: 'pointer'
                        },
                        children: "I've Saved My Codes"
                    })
                ]
            })
        });
    }
    // QR code and verify state
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
                    children: title
                }),
                /*#__PURE__*/ _jsx("p", {
                    style: {
                        color: 'var(--theme-text)',
                        opacity: 0.7,
                        fontSize: 'var(--font-size-small)',
                        textAlign: 'center',
                        marginBottom: 'calc(var(--base) * 1.5)'
                    },
                    children: "Scan the QR code with your authenticator app, then enter the code below."
                }),
                totpUri && /*#__PURE__*/ _jsx("div", {
                    style: {
                        textAlign: 'center',
                        marginBottom: 'calc(var(--base) * 1.5)'
                    },
                    children: /*#__PURE__*/ _jsx("img", {
                        src: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpUri)}`,
                        alt: "QR Code for authenticator app",
                        style: {
                            width: '200px',
                            height: '200px',
                            border: '1px solid var(--theme-elevation-150)',
                            borderRadius: 'var(--style-radius-s)'
                        }
                    })
                }),
                secret && /*#__PURE__*/ _jsxs("div", {
                    style: {
                        marginBottom: 'calc(var(--base) * 1.5)',
                        textAlign: 'center'
                    },
                    children: [
                        /*#__PURE__*/ _jsx("p", {
                            style: {
                                color: 'var(--theme-text)',
                                opacity: 0.7,
                                fontSize: 'var(--font-size-small)',
                                marginBottom: 'calc(var(--base) * 0.5)'
                            },
                            children: "Or enter this code manually:"
                        }),
                        /*#__PURE__*/ _jsx("code", {
                            style: {
                                display: 'inline-block',
                                padding: 'calc(var(--base) * 0.5)',
                                background: 'var(--theme-elevation-100)',
                                borderRadius: 'var(--style-radius-s)',
                                fontFamily: 'monospace',
                                fontSize: 'var(--font-size-small)',
                                color: 'var(--theme-text)',
                                wordBreak: 'break-all'
                            },
                            children: secret
                        })
                    ]
                }),
                /*#__PURE__*/ _jsxs("form", {
                    onSubmit: handleVerify,
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            style: {
                                marginBottom: 'calc(var(--base) * 1.5)'
                            },
                            children: [
                                /*#__PURE__*/ _jsx("label", {
                                    htmlFor: "code",
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
                                    id: "code",
                                    type: "text",
                                    inputMode: "numeric",
                                    pattern: "[0-9]*",
                                    autoComplete: "one-time-code",
                                    value: verificationCode,
                                    onChange: (e)=>setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6)),
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
                            disabled: loading || verificationCode.length !== 6,
                            style: {
                                width: '100%',
                                padding: 'calc(var(--base) * 0.75)',
                                background: 'var(--theme-elevation-800)',
                                border: 'none',
                                borderRadius: 'var(--style-radius-s)',
                                color: 'var(--theme-elevation-50)',
                                fontSize: 'var(--font-size-base)',
                                fontWeight: 500,
                                cursor: loading || verificationCode.length !== 6 ? 'not-allowed' : 'pointer',
                                opacity: loading || verificationCode.length !== 6 ? 0.7 : 1,
                                transition: 'opacity 150ms ease'
                            },
                            children: loading ? 'Verifying...' : 'Verify and Enable'
                        })
                    ]
                })
            ]
        })
    });
}
export default TwoFactorSetupView;
