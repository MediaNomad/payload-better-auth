'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { createPayloadAuthClient } from '../../exports/client.js';
/**
 * Client component for two-factor authentication management.
 * Shows 2FA status and allows enabling/disabling.
 */ export function TwoFactorManagementClient({ authClient: providedClient, title = 'Two-Factor Authentication' } = {}) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [step, setStep] = useState('status');
    const [totpUri, setTotpUri] = useState(null);
    const [secret, setSecret] = useState(null);
    const [backupCodes, setBackupCodes] = useState([]);
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const getClient = ()=>providedClient ?? createPayloadAuthClient();
    useEffect(()=>{
        checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    async function checkStatus() {
        setLoading(true);
        try {
            const client = getClient();
            const result = await client.getSession();
            if (result.data?.user) {
                setIsEnabled(result.data.user.twoFactorEnabled ?? false);
            } else {
                setIsEnabled(false);
            }
        } catch  {
            setError('Failed to check 2FA status');
        } finally{
            setLoading(false);
        }
    }
    function handleEnableClick() {
        // Show password prompt first
        setStep('password');
        setPassword('');
        setError(null);
    }
    async function handleEnableWithPassword(e) {
        e.preventDefault();
        setActionLoading(true);
        setError(null);
        try {
            const client = getClient();
            const result = await client.twoFactor.enable({
                password
            });
            if (result.error) {
                setError(result.error.message ?? 'Failed to enable 2FA');
            } else if (result.data) {
                setTotpUri(result.data.totpURI);
                // Secret is embedded in the totpURI, extract it for manual entry option
                const secretMatch = result.data.totpURI.match(/secret=([A-Z2-7]+)/i);
                setSecret(secretMatch ? secretMatch[1] : null);
                setBackupCodes(result.data.backupCodes ?? []);
                setPassword(''); // Clear password
                setStep('setup');
            }
        } catch  {
            setError('Failed to enable 2FA');
        } finally{
            setActionLoading(false);
        }
    }
    async function handleVerify(e) {
        e.preventDefault();
        setActionLoading(true);
        setError(null);
        try {
            const client = getClient();
            const result = await client.twoFactor.verifyTotp({
                code: verificationCode
            });
            if (result.error) {
                setError(result.error.message ?? 'Invalid verification code');
            } else {
                if (backupCodes.length > 0) {
                    setStep('backup');
                } else {
                    setIsEnabled(true);
                    setStep('status');
                }
            }
        } catch  {
            setError('Verification failed');
        } finally{
            setActionLoading(false);
        }
    }
    async function handleDisable() {
        if (!confirm('Are you sure you want to disable two-factor authentication?')) {
            return;
        }
        setActionLoading(true);
        setError(null);
        try {
            const client = getClient();
            const result = await client.twoFactor.disable({
                password: ''
            });
            if (result.error) {
                setError(result.error.message ?? 'Failed to disable 2FA');
            } else {
                setIsEnabled(false);
            }
        } catch  {
            setError('Failed to disable 2FA');
        } finally{
            setActionLoading(false);
        }
    }
    function handleBackupContinue() {
        setIsEnabled(true);
        setStep('status');
    }
    if (loading) {
        return /*#__PURE__*/ _jsx("div", {
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'calc(var(--base) * 3)'
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
    return /*#__PURE__*/ _jsxs("div", {
        style: {
            maxWidth: '600px',
            margin: '0 auto',
            padding: 'calc(var(--base) * 2)'
        },
        children: [
            /*#__PURE__*/ _jsx("h1", {
                style: {
                    color: 'var(--theme-text)',
                    fontSize: 'var(--font-size-h2)',
                    fontWeight: 600,
                    margin: '0 0 calc(var(--base) * 2) 0'
                },
                children: title
            }),
            error && /*#__PURE__*/ _jsx("div", {
                style: {
                    color: 'var(--theme-error-500)',
                    marginBottom: 'var(--base)',
                    fontSize: 'var(--font-size-small)',
                    padding: 'calc(var(--base) * 0.75)',
                    background: 'var(--theme-error-50)',
                    borderRadius: 'var(--style-radius-s)',
                    border: '1px solid var(--theme-error-200)'
                },
                children: error
            }),
            step === 'status' && /*#__PURE__*/ _jsx("div", {
                style: {
                    background: 'var(--theme-elevation-50)',
                    padding: 'calc(var(--base) * 1.5)',
                    borderRadius: 'var(--style-radius-m)',
                    border: '1px solid var(--theme-elevation-100)'
                },
                children: /*#__PURE__*/ _jsxs("div", {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    },
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            children: [
                                /*#__PURE__*/ _jsx("div", {
                                    style: {
                                        color: 'var(--theme-text)',
                                        fontWeight: 500,
                                        marginBottom: 'calc(var(--base) * 0.25)'
                                    },
                                    children: "Status"
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    style: {
                                        color: isEnabled ? 'var(--theme-success-500)' : 'var(--theme-elevation-600)',
                                        fontSize: 'var(--font-size-small)'
                                    },
                                    children: isEnabled ? '✓ Enabled' : 'Not enabled'
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsx("button", {
                            onClick: isEnabled ? handleDisable : handleEnableClick,
                            disabled: actionLoading,
                            style: {
                                padding: 'calc(var(--base) * 0.5) calc(var(--base) * 1)',
                                background: isEnabled ? 'var(--theme-error-500)' : 'var(--theme-elevation-800)',
                                border: 'none',
                                borderRadius: 'var(--style-radius-s)',
                                color: 'var(--theme-elevation-50)',
                                fontSize: 'var(--font-size-small)',
                                cursor: actionLoading ? 'not-allowed' : 'pointer',
                                opacity: actionLoading ? 0.7 : 1
                            },
                            children: actionLoading ? 'Loading...' : isEnabled ? 'Disable' : 'Enable'
                        })
                    ]
                })
            }),
            step === 'password' && /*#__PURE__*/ _jsxs("div", {
                style: {
                    background: 'var(--theme-elevation-50)',
                    padding: 'calc(var(--base) * 2)',
                    borderRadius: 'var(--style-radius-m)',
                    border: '1px solid var(--theme-elevation-100)'
                },
                children: [
                    /*#__PURE__*/ _jsx("h2", {
                        style: {
                            color: 'var(--theme-text)',
                            fontSize: 'var(--font-size-h4)',
                            fontWeight: 500,
                            margin: '0 0 var(--base) 0'
                        },
                        children: "Confirm Your Password"
                    }),
                    /*#__PURE__*/ _jsx("p", {
                        style: {
                            color: 'var(--theme-text)',
                            opacity: 0.7,
                            fontSize: 'var(--font-size-small)',
                            marginBottom: 'calc(var(--base) * 1.5)'
                        },
                        children: "Enter your password to enable two-factor authentication."
                    }),
                    /*#__PURE__*/ _jsxs("form", {
                        onSubmit: handleEnableWithPassword,
                        children: [
                            /*#__PURE__*/ _jsx("input", {
                                type: "password",
                                value: password,
                                onChange: (e)=>setPassword(e.target.value),
                                placeholder: "Enter your password",
                                required: true,
                                style: {
                                    width: '100%',
                                    padding: 'calc(var(--base) * 0.75)',
                                    background: 'var(--theme-input-bg)',
                                    border: '1px solid var(--theme-elevation-150)',
                                    borderRadius: 'var(--style-radius-s)',
                                    color: 'var(--theme-text)',
                                    fontSize: 'var(--font-size-base)',
                                    marginBottom: 'var(--base)',
                                    boxSizing: 'border-box'
                                }
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                style: {
                                    display: 'flex',
                                    gap: 'calc(var(--base) * 0.5)'
                                },
                                children: [
                                    /*#__PURE__*/ _jsx("button", {
                                        type: "submit",
                                        disabled: actionLoading || !password,
                                        style: {
                                            padding: 'calc(var(--base) * 0.75) calc(var(--base) * 1.5)',
                                            background: 'var(--theme-elevation-800)',
                                            border: 'none',
                                            borderRadius: 'var(--style-radius-s)',
                                            color: 'var(--theme-elevation-50)',
                                            fontSize: 'var(--font-size-base)',
                                            cursor: actionLoading || !password ? 'not-allowed' : 'pointer',
                                            opacity: actionLoading || !password ? 0.7 : 1
                                        },
                                        children: actionLoading ? 'Enabling...' : 'Continue'
                                    }),
                                    /*#__PURE__*/ _jsx("button", {
                                        type: "button",
                                        onClick: ()=>setStep('status'),
                                        style: {
                                            padding: 'calc(var(--base) * 0.75) calc(var(--base) * 1.5)',
                                            background: 'transparent',
                                            border: '1px solid var(--theme-elevation-200)',
                                            borderRadius: 'var(--style-radius-s)',
                                            color: 'var(--theme-text)',
                                            fontSize: 'var(--font-size-base)',
                                            cursor: 'pointer'
                                        },
                                        children: "Cancel"
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            step === 'setup' && totpUri && /*#__PURE__*/ _jsxs("div", {
                style: {
                    background: 'var(--theme-elevation-50)',
                    padding: 'calc(var(--base) * 2)',
                    borderRadius: 'var(--style-radius-m)',
                    textAlign: 'center'
                },
                children: [
                    /*#__PURE__*/ _jsx("p", {
                        style: {
                            color: 'var(--theme-text)',
                            opacity: 0.7,
                            marginBottom: 'calc(var(--base) * 1.5)'
                        },
                        children: "Scan this QR code with your authenticator app:"
                    }),
                    /*#__PURE__*/ _jsx("img", {
                        src: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpUri)}`,
                        alt: "QR Code",
                        style: {
                            width: '200px',
                            height: '200px',
                            border: '1px solid var(--theme-elevation-150)',
                            borderRadius: 'var(--style-radius-s)',
                            marginBottom: 'var(--base)'
                        }
                    }),
                    secret && /*#__PURE__*/ _jsxs("div", {
                        style: {
                            marginBottom: 'calc(var(--base) * 1.5)'
                        },
                        children: [
                            /*#__PURE__*/ _jsx("p", {
                                style: {
                                    color: 'var(--theme-text)',
                                    opacity: 0.7,
                                    fontSize: 'var(--font-size-small)',
                                    marginBottom: 'calc(var(--base) * 0.5)'
                                },
                                children: "Or enter manually:"
                            }),
                            /*#__PURE__*/ _jsx("code", {
                                style: {
                                    display: 'inline-block',
                                    padding: 'calc(var(--base) * 0.5)',
                                    background: 'var(--theme-elevation-100)',
                                    borderRadius: 'var(--style-radius-s)',
                                    fontFamily: 'monospace',
                                    fontSize: 'var(--font-size-small)',
                                    color: 'var(--theme-text)'
                                },
                                children: secret
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("form", {
                        onSubmit: handleVerify,
                        children: [
                            /*#__PURE__*/ _jsx("input", {
                                type: "text",
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                                value: verificationCode,
                                onChange: (e)=>setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6)),
                                placeholder: "Enter 6-digit code",
                                style: {
                                    width: '100%',
                                    maxWidth: '200px',
                                    padding: 'calc(var(--base) * 0.75)',
                                    background: 'var(--theme-input-bg)',
                                    border: '1px solid var(--theme-elevation-150)',
                                    borderRadius: 'var(--style-radius-s)',
                                    color: 'var(--theme-text)',
                                    fontSize: 'var(--font-size-h4)',
                                    fontFamily: 'monospace',
                                    textAlign: 'center',
                                    letterSpacing: '0.5em',
                                    marginBottom: 'var(--base)',
                                    boxSizing: 'border-box'
                                }
                            }),
                            /*#__PURE__*/ _jsx("br", {}),
                            /*#__PURE__*/ _jsx("button", {
                                type: "submit",
                                disabled: actionLoading || verificationCode.length !== 6,
                                style: {
                                    padding: 'calc(var(--base) * 0.75) calc(var(--base) * 2)',
                                    background: 'var(--theme-elevation-800)',
                                    border: 'none',
                                    borderRadius: 'var(--style-radius-s)',
                                    color: 'var(--theme-elevation-50)',
                                    fontSize: 'var(--font-size-base)',
                                    cursor: actionLoading || verificationCode.length !== 6 ? 'not-allowed' : 'pointer',
                                    opacity: actionLoading || verificationCode.length !== 6 ? 0.7 : 1
                                },
                                children: actionLoading ? 'Verifying...' : 'Verify'
                            })
                        ]
                    })
                ]
            }),
            step === 'backup' && /*#__PURE__*/ _jsxs("div", {
                style: {
                    background: 'var(--theme-elevation-50)',
                    padding: 'calc(var(--base) * 2)',
                    borderRadius: 'var(--style-radius-m)'
                },
                children: [
                    /*#__PURE__*/ _jsx("h2", {
                        style: {
                            color: 'var(--theme-text)',
                            fontSize: 'var(--font-size-h3)',
                            fontWeight: 600,
                            margin: '0 0 var(--base) 0',
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
                        children: "Store these codes safely. Use them if you lose your authenticator."
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        style: {
                            background: 'var(--theme-elevation-100)',
                            padding: 'var(--base)',
                            borderRadius: 'var(--style-radius-s)',
                            marginBottom: 'var(--base)',
                            fontFamily: 'monospace'
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
                        onClick: ()=>navigator.clipboard.writeText(backupCodes.join('\n')),
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
                            cursor: 'pointer'
                        },
                        children: "I've Saved My Codes"
                    })
                ]
            })
        ]
    });
}
export default TwoFactorManagementClient;
