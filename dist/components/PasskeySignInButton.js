'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { createPayloadAuthClient } from '../exports/client.js';
/**
 * Standalone passkey sign-in button component.
 * Handles the WebAuthn authentication flow with Better Auth.
 *
 * @example
 * ```tsx
 * import { PasskeySignInButton } from '@delmaredigital/payload-better-auth/components'
 *
 * function LoginForm() {
 *   return (
 *     <PasskeySignInButton
 *       onSuccess={(user) => {
 *         router.push('/dashboard')
 *       }}
 *       onError={(error) => {
 *         setError(error)
 *       }}
 *     />
 *   )
 * }
 * ```
 */ export function PasskeySignInButton({ authClient: providedClient, onSuccess, onError, label = 'Sign in with Passkey', loadingLabel = 'Authenticating...', disabled, children, ...buttonProps }) {
    const [loading, setLoading] = useState(false);
    async function handleClick() {
        setLoading(true);
        try {
            const client = providedClient ?? createPayloadAuthClient();
            const result = await client.signIn.passkey();
            if (result.error) {
                onError?.(result.error.message ?? 'Passkey authentication failed');
            } else if (result.data?.user) {
                onSuccess?.(result.data.user);
            }
        } catch (err) {
            if (err instanceof Error && err.name === 'NotAllowedError') {
                onError?.('Passkey authentication was cancelled or not allowed');
            } else {
                onError?.(err instanceof Error ? err.message : 'Passkey authentication failed');
            }
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ _jsx("button", {
        type: "button",
        onClick: handleClick,
        disabled: disabled || loading,
        ...buttonProps,
        children: children ?? (loading ? loadingLabel : label)
    });
}
export default PasskeySignInButton;
