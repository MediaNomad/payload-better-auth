'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { useRouter } from 'next/navigation.js';
/**
 * Logout button component styled to match Payload's admin nav.
 * Uses Payload's CSS classes and variables for native theme integration.
 */ export function LogoutButton() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    async function handleLogout() {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await fetch('/api/auth/sign-out', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            router.push('/admin/login');
        } catch (error) {
            console.error('[better-auth] Logout error:', error);
            setIsLoading(false);
        }
    }
    return /*#__PURE__*/ _jsx("button", {
        onClick: handleLogout,
        disabled: isLoading,
        type: "button",
        className: "nav__link",
        style: {
            background: 'none',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            width: '100%',
            textAlign: 'left',
            padding: 0
        },
        children: /*#__PURE__*/ _jsx("span", {
            className: "nav__link-label",
            children: isLoading ? 'Logging out...' : 'Log out'
        })
    });
}
export default LogoutButton;
