'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { createPayloadAuthClient } from '../../exports/client.js';
/**
 * Client component for passkey management.
 * Lists, registers, and deletes passkeys.
 */ export function PasskeysManagementClient({ authClient: providedClient, title = 'Passkeys' } = {}) {
    const [passkeys, setPasskeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [registering, setRegistering] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [passkeyName, setPasskeyName] = useState('');
    const getClient = ()=>providedClient ?? createPayloadAuthClient();
    useEffect(()=>{
        fetchPasskeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    async function fetchPasskeys() {
        setLoading(true);
        setError(null);
        try {
            const client = getClient();
            const result = await client.passkey.listUserPasskeys();
            if (result.error) {
                setError(result.error.message ?? 'Failed to load passkeys');
            } else {
                setPasskeys(result.data ?? []);
            }
        } catch  {
            setError('Failed to load passkeys');
        } finally{
            setLoading(false);
        }
    }
    async function handleRegister(e) {
        e.preventDefault();
        setRegistering(true);
        setError(null);
        setSuccess(null);
        try {
            const client = getClient();
            const result = await client.passkey.addPasskey({
                name: passkeyName || undefined
            });
            if (result.error) {
                setError(result.error.message ?? 'Failed to register passkey');
            } else {
                setSuccess('Passkey registered successfully!');
                setShowRegisterForm(false);
                setPasskeyName('');
                fetchPasskeys();
            }
        } catch (err) {
            if (err instanceof Error && err.name === 'NotAllowedError') {
                setError('Passkey registration was cancelled or not allowed');
            } else if (err instanceof Error && err.name === 'InvalidStateError') {
                setError('This passkey is already registered');
            } else {
                setError(err instanceof Error ? err.message : 'Failed to register passkey');
            }
        } finally{
            setRegistering(false);
        }
    }
    async function handleDelete(passkeyId) {
        if (!confirm('Are you sure you want to delete this passkey?')) {
            return;
        }
        setDeleting(passkeyId);
        setError(null);
        setSuccess(null);
        try {
            const client = getClient();
            const result = await client.passkey.deletePasskey({
                id: passkeyId
            });
            if (result.error) {
                setError(result.error.message ?? 'Failed to delete passkey');
            } else {
                setPasskeys((prev)=>prev.filter((p)=>p.id !== passkeyId));
                setSuccess('Passkey deleted successfully');
            }
        } catch  {
            setError('Failed to delete passkey');
        } finally{
            setDeleting(null);
        }
    }
    function formatDate(date) {
        if (!date) return 'Never';
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleString();
    }
    return /*#__PURE__*/ _jsxs("div", {
        style: {
            maxWidth: '900px',
            margin: '0 auto',
            padding: 'calc(var(--base) * 2)'
        },
        children: [
            /*#__PURE__*/ _jsxs("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'calc(var(--base) * 2)'
                },
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        children: [
                            /*#__PURE__*/ _jsx("h1", {
                                style: {
                                    color: 'var(--theme-text)',
                                    fontSize: 'var(--font-size-h2)',
                                    fontWeight: 600,
                                    margin: 0
                                },
                                children: title
                            }),
                            /*#__PURE__*/ _jsx("p", {
                                style: {
                                    color: 'var(--theme-text)',
                                    opacity: 0.7,
                                    fontSize: 'var(--font-size-small)',
                                    margin: 'calc(var(--base) * 0.5) 0 0 0'
                                },
                                children: "Passkeys provide secure, passwordless sign-in using your device's biometrics or security keys."
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("button", {
                        onClick: ()=>setShowRegisterForm(true),
                        style: {
                            padding: 'calc(var(--base) * 0.5) calc(var(--base) * 1)',
                            background: 'var(--theme-elevation-800)',
                            border: 'none',
                            borderRadius: 'var(--style-radius-s)',
                            color: 'var(--theme-elevation-50)',
                            fontSize: 'var(--font-size-small)',
                            cursor: 'pointer'
                        },
                        children: "Add Passkey"
                    })
                ]
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
            success && /*#__PURE__*/ _jsx("div", {
                style: {
                    color: 'var(--theme-success-700)',
                    marginBottom: 'var(--base)',
                    fontSize: 'var(--font-size-small)',
                    padding: 'calc(var(--base) * 0.75)',
                    background: 'var(--theme-success-50)',
                    borderRadius: 'var(--style-radius-s)',
                    border: '1px solid var(--theme-success-200)'
                },
                children: success
            }),
            showRegisterForm && /*#__PURE__*/ _jsxs("div", {
                style: {
                    marginBottom: 'calc(var(--base) * 1.5)',
                    padding: 'calc(var(--base) * 1.5)',
                    background: 'var(--theme-elevation-50)',
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
                        children: "Register New Passkey"
                    }),
                    /*#__PURE__*/ _jsxs("form", {
                        onSubmit: handleRegister,
                        children: [
                            /*#__PURE__*/ _jsxs("div", {
                                style: {
                                    marginBottom: 'var(--base)'
                                },
                                children: [
                                    /*#__PURE__*/ _jsx("label", {
                                        style: {
                                            display: 'block',
                                            color: 'var(--theme-text)',
                                            fontSize: 'var(--font-size-small)',
                                            marginBottom: 'calc(var(--base) * 0.25)'
                                        },
                                        children: "Name (optional)"
                                    }),
                                    /*#__PURE__*/ _jsx("input", {
                                        type: "text",
                                        value: passkeyName,
                                        onChange: (e)=>setPasskeyName(e.target.value),
                                        placeholder: "e.g., MacBook Pro, iPhone",
                                        style: {
                                            width: '100%',
                                            padding: 'calc(var(--base) * 0.5)',
                                            background: 'var(--theme-input-bg)',
                                            border: '1px solid var(--theme-elevation-150)',
                                            borderRadius: 'var(--style-radius-s)',
                                            color: 'var(--theme-text)',
                                            boxSizing: 'border-box'
                                        }
                                    }),
                                    /*#__PURE__*/ _jsx("p", {
                                        style: {
                                            color: 'var(--theme-text)',
                                            opacity: 0.6,
                                            fontSize: 'var(--font-size-small)',
                                            margin: 'calc(var(--base) * 0.25) 0 0 0'
                                        },
                                        children: "Your browser will prompt you to use your device's biometrics or security key."
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                style: {
                                    display: 'flex',
                                    gap: 'calc(var(--base) * 0.5)'
                                },
                                children: [
                                    /*#__PURE__*/ _jsx("button", {
                                        type: "submit",
                                        disabled: registering,
                                        style: {
                                            padding: 'calc(var(--base) * 0.5) calc(var(--base) * 1)',
                                            background: 'var(--theme-elevation-800)',
                                            border: 'none',
                                            borderRadius: 'var(--style-radius-s)',
                                            color: 'var(--theme-elevation-50)',
                                            fontSize: 'var(--font-size-small)',
                                            cursor: registering ? 'not-allowed' : 'pointer',
                                            opacity: registering ? 0.7 : 1
                                        },
                                        children: registering ? 'Registering...' : 'Register Passkey'
                                    }),
                                    /*#__PURE__*/ _jsx("button", {
                                        type: "button",
                                        onClick: ()=>setShowRegisterForm(false),
                                        style: {
                                            padding: 'calc(var(--base) * 0.5) calc(var(--base) * 1)',
                                            background: 'transparent',
                                            border: '1px solid var(--theme-elevation-200)',
                                            borderRadius: 'var(--style-radius-s)',
                                            color: 'var(--theme-text)',
                                            fontSize: 'var(--font-size-small)',
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
            loading ? /*#__PURE__*/ _jsx("div", {
                style: {
                    color: 'var(--theme-text)',
                    opacity: 0.7,
                    textAlign: 'center',
                    padding: 'calc(var(--base) * 3)'
                },
                children: "Loading passkeys..."
            }) : passkeys.length === 0 ? /*#__PURE__*/ _jsx("div", {
                style: {
                    color: 'var(--theme-text)',
                    opacity: 0.7,
                    textAlign: 'center',
                    padding: 'calc(var(--base) * 3)'
                },
                children: "No passkeys registered. Add one to enable passwordless sign-in."
            }) : /*#__PURE__*/ _jsx("div", {
                style: {
                    background: 'var(--theme-elevation-50)',
                    borderRadius: 'var(--style-radius-m)',
                    overflow: 'hidden',
                    border: '1px solid var(--theme-elevation-100)'
                },
                children: passkeys.map((pk, index)=>/*#__PURE__*/ _jsxs("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 'calc(var(--base) * 1)',
                            borderBottom: index < passkeys.length - 1 ? '1px solid var(--theme-elevation-100)' : 'none'
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
                                        children: pk.name || 'Passkey'
                                    }),
                                    /*#__PURE__*/ _jsxs("div", {
                                        style: {
                                            color: 'var(--theme-elevation-600)',
                                            fontSize: 'var(--font-size-small)'
                                        },
                                        children: [
                                            /*#__PURE__*/ _jsxs("span", {
                                                children: [
                                                    "Created: ",
                                                    formatDate(pk.createdAt)
                                                ]
                                            }),
                                            pk.lastUsedAt && /*#__PURE__*/ _jsxs("span", {
                                                children: [
                                                    " | Last used: ",
                                                    formatDate(pk.lastUsedAt)
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsx("button", {
                                onClick: ()=>handleDelete(pk.id),
                                disabled: deleting === pk.id,
                                style: {
                                    padding: 'calc(var(--base) * 0.5) calc(var(--base) * 0.75)',
                                    background: 'transparent',
                                    border: '1px solid var(--theme-error-300)',
                                    borderRadius: 'var(--style-radius-s)',
                                    color: 'var(--theme-error-500)',
                                    fontSize: 'var(--font-size-small)',
                                    cursor: deleting === pk.id ? 'not-allowed' : 'pointer',
                                    opacity: deleting === pk.id ? 0.7 : 1
                                },
                                children: deleting === pk.id ? 'Deleting...' : 'Delete'
                            })
                        ]
                    }, pk.id))
            })
        ]
    });
}
export default PasskeysManagementClient;
