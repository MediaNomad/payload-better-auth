import { type PayloadAuthClient } from '../exports/client.js';
export type LoginViewProps = {
    /** Optional pre-configured auth client */
    authClient?: PayloadAuthClient;
    /** Custom logo element */
    logo?: React.ReactNode;
    /** Login page title. Default: 'Login' */
    title?: string;
    /** Path to redirect after successful login. Default: '/admin' */
    afterLoginPath?: string;
    /**
     * Required role(s) for admin access.
     * - string: Single role required (default: 'admin')
     * - string[]: Multiple roles (behavior depends on requireAllRoles)
     * - null/undefined: Disable role checking
     * For complex RBAC beyond these options, disable the login view and create your own.
     */
    requiredRole?: string | string[] | null;
    /**
     * When requiredRole is an array, require ALL roles (true) or ANY role (false).
     * Default: false (any matching role grants access)
     */
    requireAllRoles?: boolean;
    /**
     * Enable passkey (WebAuthn) sign-in option.
     * - true: Always show passkey button
     * - false: Never show passkey button
     * - 'auto' (default): Auto-detect if passkey plugin is available
     */
    enablePasskey?: boolean | 'auto';
    /**
     * Enable user registration (sign up) option.
     * - true: Always show "Create account" link
     * - false: Never show registration option
     * - 'auto' (default): Auto-detect if sign-up endpoint is available
     */
    enableSignUp?: boolean | 'auto';
    /**
     * Default role to assign to new users during registration.
     * Default: 'user'
     */
    defaultSignUpRole?: string;
    /**
     * Enable forgot password option.
     * - true: Always show "Forgot password?" link
     * - false: Never show forgot password option
     * - 'auto' (default): Auto-detect if forget-password endpoint is available
     */
    enableForgotPassword?: boolean | 'auto';
    /**
     * Custom URL for password reset page. If provided, users will be redirected here
     * instead of showing the inline password reset form.
     * The reset token will be appended as ?token=xxx
     */
    resetPasswordUrl?: string;
};
export declare function LoginView({ authClient: providedClient, logo, title, afterLoginPath, requiredRole, requireAllRoles, enablePasskey, enableSignUp, defaultSignUpRole, enableForgotPassword, resetPasswordUrl, }: LoginViewProps): import("react").JSX.Element;
export default LoginView;
